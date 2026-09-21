"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { primaryImage } from "@/lib/types";
import { useCart } from "@/lib/cart";
import { cartAdded } from "./CartAdded";

export default function ProductActions({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [wished, setWished] = useState(false);
  const soldOut = product.stock <= 0;

  // One selected option per variant group, defaulting to the first option.
  const [sel, setSel] = useState<Record<string, string>>(() =>
    Object.fromEntries(product.variants.map((g) => [g.label, g.options[0]]))
  );
  const variantLabel = product.variants.length
    ? product.variants.map((g) => `${g.label}: ${sel[g.label]}`).join(" · ")
    : undefined;

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
        variant: variantLabel,
      },
      qty
    );
    cartAdded({
      name: product.name,
      image: primaryImage(product),
      emoji: product.emoji,
      price: product.price,
      qty,
      variant: variantLabel,
    });
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
    <>
      {product.variants.map((g) => (
        <div className="pdp-variant" key={g.label}>
          <div className="pdp-variant-label">
            {g.label}: <b>{sel[g.label]}</b>
          </div>
          <div className="pdp-variant-opts">
            {g.options.map((o) => (
              <button
                type="button"
                key={o}
                className={`pdp-variant-opt${sel[g.label] === o ? " active" : ""}`}
                onClick={() => setSel((s) => ({ ...s, [g.label]: o }))}
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      ))}

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
    </>
  );
}
