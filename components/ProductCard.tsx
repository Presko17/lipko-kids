"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { tintOf, primaryImage } from "@/lib/types";
import { useCart } from "@/lib/cart";
import { price } from "@/lib/money";
import { toast } from "./Toaster";

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);
  const soldOut = product.stock <= 0;
  const onSale = product.oldPrice != null && product.oldPrice > product.price;
  const discount = onSale
    ? Math.round((1 - product.price / (product.oldPrice as number)) * 100)
    : 0;

  const onAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (soldOut) return;
    add({
      id: product.id,
      name: product.name,
      price: product.price,
      emoji: product.emoji,
      image: primaryImage(product),
      category: product.category,
      material: product.material,
      age: product.age,
    });
    setAdded(true);
    toast(`${product.name} е добавена в количката`);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article className={`card ${tintOf(product.id)}`}>
      <div className="thumb">
        <Link className="panel" href={`/product/${product.id}`} aria-label={`Виж ${product.name}`}>
          {primaryImage(product) ? (
            <img className="pimg" src={primaryImage(product)!} alt={product.name} />
          ) : (
            <span>{product.emoji}</span>
          )}
        </Link>
        <span className="mk" aria-hidden="true" />
        {soldOut ? (
          <span className="badge badge-out">Изчерпан</span>
        ) : onSale ? (
          <span className="badge badge-promo">−{discount}%</span>
        ) : (
          product.tag && <span className="badge">{product.tag}</span>
        )}
        <button
          className="wish"
          aria-label="Добави в любими"
          title="Любими"
          onClick={(e) => {
            e.stopPropagation();
            setWished((w) => !w);
          }}
          style={{ color: wished ? "var(--t1-ink)" : undefined }}
        >
          {wished ? "♥" : "♡"}
        </button>
      </div>
      <div className="info">
        <div className="cat">
          {product.category} · Възраст {product.age}
        </div>
        <h3>
          <Link href={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <div className="spec">{product.material}</div>
        <div className="buy">
          <span className="prices">
            <span className={`price${onSale ? " on-sale" : ""}`}>{price(product.price)}</span>
            {onSale && <s className="price-old">{price(product.oldPrice as number)}</s>}
          </span>
          <button
            className={`add${added ? " added" : ""}`}
            onClick={onAdd}
            disabled={soldOut}
            aria-label={`Добави ${product.name} в количката`}
          >
            {added ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="9" cy="20" r="1.4" />
                <circle cx="18" cy="20" r="1.4" />
                <path d="M2 3h2.2l2.1 12a1.5 1.5 0 0 0 1.5 1.2h8.7a1.5 1.5 0 0 0 1.5-1.2L21 7H5.4" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
