"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { primaryImage } from "@/lib/types";
import { useCart } from "@/lib/cart";
import { toast } from "./Toaster";

export default function ProductActions({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [wished, setWished] = useState(false);
  const soldOut = product.stock <= 0;

  const onAdd = () => {
    if (soldOut) return;
    add(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        emoji: product.emoji,
        image: primaryImage(product),
        category: product.category,
        material: product.material,
        age: product.age,
      },
      qty
    );
    toast(`${qty} × ${product.name} в количката`);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  if (soldOut) {
    return (
      <div className="pdp-actions">
        <button className="btn btn-primary pdp-add" disabled>
          Изчерпан
        </button>
      </div>
    );
  }

  return (
    <div className="pdp-actions">
      <div className="qty" aria-label="Количество">
        <button type="button" className="qminus" aria-label="Намали количеството" onClick={() => setQty((q) => Math.max(1, q - 1))}>
          −
        </button>
        <span className="qval">{qty}</span>
        <button type="button" className="qplus" aria-label="Увеличи количеството" onClick={() => setQty((q) => Math.min(product.stock, Math.min(20, q + 1)))}>
          +
        </button>
      </div>
      <button className={`btn btn-primary pdp-add${added ? " added" : ""}`} onClick={onAdd}>
        {added ? "Добавено ✓" : "Добави в количката"}
      </button>
      <button
        className="wishbig"
        aria-label="Добави в любими"
        onClick={() => setWished((w) => !w)}
        style={{ color: wished ? "var(--t1-ink)" : undefined }}
      >
        {wished ? "♥" : "♡"}
      </button>
    </div>
  );
}
