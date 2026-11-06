"use client";

import { useState, useEffect } from "react";
import type { Product } from "@/lib/types";
import { primaryImage } from "@/lib/types";
import { useCart } from "@/lib/cart";
import { cartAdded } from "./CartAdded";
import WishButton from "./WishButton";
import { gaEvent, gaItem, eur } from "@/lib/track";

export const VARIANT_EVENT = "lipko:variant";

export default function ProductActions({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const soldOut = product.stock <= 0;

  // One selected option per variant group, defaulting to the first option.
  const [sel, setSel] = useState<Record<string, string>>(() =>
    Object.fromEntries(product.variants.map((g) => [g.label, g.options[0]]))
  );
  const variantLabel = product.variants.length
    ? product.variants.map((g) => `${g.label}: ${sel[g.label]}`).join(" · ")
    : undefined;

  // Analytics: one view_item per product page view.
  useEffect(() => {
    gaEvent("view_item", {
      currency: "EUR",
      value: eur(product.price),
      items: [gaItem({ id: product.id, name: product.name, category: product.category, price: product.price })],
    });
  }, [product.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Let the mobile sticky bar add the same variant the shopper picked here.
  useEffect(() => {
    window.dispatchEvent(new CustomEvent(VARIANT_EVENT, { detail: { id: product.id, variant: variantLabel } }));
  }, [product.id, variantLabel]);

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
      id: product.id,
      category: product.category,
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
        <WishButton id={product.id} name={product.name} className="wishbig" size={22} />
      </div>
    );
  }

  return (
    <>
      {product.variants.map((g) => {
        const fid = `variant-${g.label}`;
        return (
          <div className="pdp-variant" key={g.label}>
            <label className="pdp-variant-label" htmlFor={fid}>
              {g.label}
            </label>
            <div className="pdp-select">
              <select
                id={fid}
                value={sel[g.label]}
                onChange={(e) => setSel((s) => ({ ...s, [g.label]: e.target.value }))}
              >
                {g.options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        );
      })}

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
        <WishButton id={product.id} name={product.name} className="wishbig" size={22} />
      </div>
    </>
  );
}
