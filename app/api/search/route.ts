import { NextResponse } from "next/server";
import { getCatalogProducts } from "@/lib/products";
import { searchProducts, rankSuggestions, primaryImage } from "@/lib/types";

export const dynamic = "force-dynamic";

// Live suggestions for the header search: a few best matches, slimmed down.
export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") ?? "").trim().slice(0, 80);
  if (q.length < 2) return NextResponse.json({ items: [], total: 0 });

  const matches = searchProducts(await getCatalogProducts(), q);
  const items = rankSuggestions(matches, q)
    .slice(0, 6)
    .map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      oldPrice: p.oldPrice,
      image: primaryImage(p),
      emoji: p.emoji,
      soldOut: p.stock <= 0,
    }));
  return NextResponse.json({ items, total: matches.length });
}
