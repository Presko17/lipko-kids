import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { saveOrder } from "@/lib/orders";
import { getProduct } from "@/lib/products";
import { prisma } from "@/lib/prisma";
import { eurToBgn } from "@/lib/money";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Stripe calls this when events happen (e.g. a payment completes). We verify the
// signature so we know the request genuinely came from Stripe, then record the
// paid order and decrement stock.
export async function POST(req: NextRequest) {
  const key = process.env.STRIPE_SECRET_KEY;
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!key || !whSecret) {
    return NextResponse.json(
      { error: "Webhook isn't configured. Add STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET." },
      { status: 400 }
    );
  }

  const stripe = new Stripe(key);
  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig || "", whSecret);
  } catch (err) {
    return NextResponse.json(
      { error: `Signature verification failed: ${(err as Error).message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    try {
      const cart: Record<string, number> = JSON.parse(session.metadata?.cart || "{}");

      const items = [];
      for (const [id, qty] of Object.entries(cart)) {
        const p = await getProduct(id);
        if (!p) continue;
        items.push({ productId: id, name: p.name, quantity: qty, amount: p.price * qty });
        // Decrement stock (never below zero).
        await prisma.product.update({
          where: { id },
          data: { stock: Math.max(0, p.stock - qty) },
        });
      }

      const shipping = (session as unknown as { shipping_details?: { address?: Stripe.Address } })
        .shipping_details;
      const addr = shipping?.address || session.customer_details?.address || null;
      const shippingAddress = addr
        ? [addr.line1, addr.line2, addr.city, addr.state, addr.postal_code, addr.country]
            .filter(Boolean)
            .join(", ")
        : null;

      await saveOrder({
        id: session.id,
        createdAt: new Date((session.created ?? Date.now() / 1000) * 1000).toISOString(),
        email: session.customer_details?.email ?? null,
        name: session.customer_details?.name ?? null,
        // Charged in EUR (Bulgaria is in the eurozone); store the canonical total in лв
        // so it matches the item amounts and the €/лв display everywhere.
        amountTotal: eurToBgn((session.amount_total || 0) / 100),
        currency: "BGN",
        items,
        shippingAddress,
        paymentStatus: session.payment_status ?? null,
      });
    } catch (err) {
      console.error("Failed to record order:", err);
      return NextResponse.json({ received: true, recorded: false }, { status: 200 });
    }
  }

  return NextResponse.json({ received: true });
}
