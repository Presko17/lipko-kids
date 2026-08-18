"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { tintOf, primaryImage } from "@/lib/types";
import { price } from "@/lib/money";
import { useCart } from "@/lib/cart";
import { toast } from "./Toaster";

// Compact product boxes for quick buying — main photo + a small "Купи" button
// that adds straight to the cart.
export default function QuickBuy({ products }: { products: Product[] }) {
  const { add } = useCart();

  const buy = (p: Product) => {
    if (p.stock <= 0) return;
    add({
      id: p.id,
      name: p.name,
      price: p.price,
      emoji: p.emoji,
      image: primaryImage(p),
      category: p.category,
      material: p.material,
      age: p.age,
    });
    toast(`${p.name} е добавена в количката`);
  };

  return (
    <div className="qbuy-grid">
      {products.map((p) => {
        const soldOut = p.stock <= 0;
        return (
          <div className={`qbuy ${tintOf(p.id)}`} key={p.id}>
            <Link href={`/product/${p.id}`} className="qbuy-img" aria-label={p.name}>
              {primaryImage(p) ? (
                <img src={primaryImage(p)!} alt={p.name} />
              ) : (
                <span className="qbuy-emoji">{p.emoji}</span>
              )}
            </Link>
            <Link href={`/product/${p.id}`} className="qbuy-name">
              {p.name}
            </Link>
            <div className="qbuy-foot">
              <span className="qbuy-price">{price(p.price)}</span>
              <button
                type="button"
                className="qbuy-btn"
                onClick={() => buy(p)}
                disabled={soldOut}
                aria-label={`Купи ${p.name}`}
              >
                {soldOut ? "Няма" : "Купи"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
