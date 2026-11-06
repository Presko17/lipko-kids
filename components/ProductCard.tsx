"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { tintOf, primaryImage, defaultVariantLabel } from "@/lib/types";
import { useCart } from "@/lib/cart";
import { price } from "@/lib/money";
import { cartAdded } from "./CartAdded";
import { Icon } from "./admin/icons";
import WishButton from "./WishButton";

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
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
    setAdded(true);
    cartAdded({
      id: product.id,
      category: product.category,
      name: product.name,
      image: primaryImage(product),
      emoji: product.emoji,
      price: product.price,
      qty: 1,
      variant,
    });
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
        <WishButton id={product.id} name={product.name} className="wish" />
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
          <div className="buy-actions">
            {/* Phones: the heart sits next to the cart button instead of on the photo. */}
            <WishButton id={product.id} name={product.name} className="wish-inline" size={19} />
            <button
              className={`add${added ? " added" : ""}`}
              onClick={onAdd}
              disabled={soldOut}
              aria-label={`Добави ${product.name} в количката`}
            >
              <Icon name={added ? "check" : "bag"} size={20} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
