import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getProduct } from "@/lib/products";
import { getSettings } from "@/lib/settings";
import { bgnToEur } from "@/lib/money";

// Create a Stripe Checkout Session from the cart and return its hosted URL.
// Prices are ALWAYS read from our own database on the server — never trusted
// from the client — so the amount charged can't be tampered with.
export async function POST(req: NextRequest) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Плащането все още не е конфигурирано. Добавете STRIPE_SECRET_KEY в .env.local." },
      { status: 400 }
    );
  }

  const stripe = new Stripe(key);

  let items: Record<string, number> = {};
  try {
    const body = await req.json();
    items = body.items || {};
  } catch {
    return NextResponse.json({ error: "Невалидна заявка." }, { status: 400 });
  }

  const ids = Object.keys(items).filter((id) => Number(items[id]) > 0);
  const products = await Promise.all(ids.map((id) => getProduct(id)));

  const line_items = [];
  const cartForMeta: Record<string, number> = {};
  let subtotal = 0;

  for (let i = 0; i < ids.length; i++) {
    const p = products[i];
    const qty = items[ids[i]];
    if (!p || !p.active) continue;
    if (p.stock < qty) {
      return NextResponse.json(
        { error: `Няма достатъчна наличност от „${p.name}“.` },
        { status: 400 }
      );
    }
    line_items.push({
      quantity: qty,
      price_data: {
        currency: "eur",
        unit_amount: Math.round(bgnToEur(p.price) * 100), // в евроцентове (лв → €, България вече е в еврозоната)
        product_data: { name: p.name, description: `${p.material} · Възраст ${p.age}` },
      },
    });
    cartForMeta[p.id] = qty;
    subtotal += p.price * qty;
  }

  if (line_items.length === 0) {
    return NextResponse.json({ error: "Количката ви е празна." }, { status: 400 });
  }

  const settings = await getSettings();
  const origin =
    req.headers.get("origin") || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    metadata: { cart: JSON.stringify(cartForMeta) },
    shipping_address_collection: {
      allowed_countries: ["BG", "RO", "GR", "DE", "AT", "GB"],
    },
    shipping_options:
      subtotal >= settings.freeShippingThreshold
        ? undefined
        : [
            {
              shipping_rate_data: {
                type: "fixed_amount",
                fixed_amount: { amount: Math.round(bgnToEur(settings.shippingRate) * 100), currency: "eur" },
                display_name: "Стандартна доставка",
              },
            },
          ],
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cart`,
  });

  return NextResponse.json({ url: session.url });
}
