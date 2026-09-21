"use client";

import type { Product } from "@/lib/types";
import { primaryImage, defaultVariantLabel } from "@/lib/types";
import { price } from "@/lib/money";
import { useCart } from "@/lib/cart";
import { cartAdded } from "./CartAdded";

// Sticky add-to-cart bar shown at the bottom on mobile product pages.
export default function StickyBuyBar({ product }: { product: Product }) {
  const { add } = useCart();
  const soldOut = product.stock <= 0;

  const onAdd = () => {
    if (soldOut) return;
    const variant = defaultVariantLabel(product.variants);
    add({
      id: product.id,
      name: product.name,
      price: product.price,
      emoji: product.emoji,
      image: primaryImage(product),
      category: product.category,
      material: product.material,
      age: product.age,
      variant,
    });
    cartAdded({
      name: product.name,
      image: primaryImage(product),
      emoji: product.emoji,
      price: product.price,
      qty: 1,
      variant,
    });
  };

  return (
    <div className="sticky-buy" role="region" aria-label="Бърза покупка">
      <div className="sticky-buy-info">
        <span className="sticky-buy-name">{product.name}</span>
        <span className="sticky-buy-price">{price(product.price)}</span>
      </div>
      <button className="btn btn-primary sticky-buy-btn" onClick={onAdd} disabled={soldOut}>
        {soldOut ? "Изчерпан" : "Добави"}
      </button>
    </div>
  );
}
