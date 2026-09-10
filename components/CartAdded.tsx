"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { price } from "@/lib/money";

export type CartAddedDetail = {
  name: string;
  image: string | null;
  emoji: string;
  price: number;
  qty: number;
};

// Fire the "added to cart" popup from anywhere (product card, PDP, quick buy…).
export function cartAdded(detail: CartAddedDetail) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("toybox-cart-added", { detail }));
  }
}

// Global slide-in confirmation that asks the shopper to keep browsing or check
// out right away. Reads live cart totals from context.
export default function CartAdded() {
  const { count, totals } = useCart();
  const [item, setItem] = useState<CartAddedDetail | null>(null);
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const onAdd = (e: Event) => {
      setItem((e as CustomEvent<CartAddedDetail>).detail);
      setShow(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setShow(false), 6500);
    };
    window.addEventListener("toybox-cart-added", onAdd);
    return () => {
      window.removeEventListener("toybox-cart-added", onAdd);
      clearTimeout(timer.current);
    };
  }, []);

  const close = () => {
    setShow(false);
    clearTimeout(timer.current);
  };

  return (
    <div className={`cart-added${show ? " show" : ""}`} role="status" aria-live="polite">
      {item && (
        <>
          <div className="cart-added-top">
            <span className="cart-added-check" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </span>
            <b>Добавено в количката</b>
            <button className="cart-added-x" onClick={close} aria-label="Затвори" type="button">
              ×
            </button>
          </div>

          <div className="cart-added-body">
            <div className="cart-added-thumb">
              {item.image ? (
                <img src={item.image} alt={item.name} />
              ) : (
                <span>{item.emoji}</span>
              )}
            </div>
            <div className="cart-added-meta">
              <span className="cart-added-name">{item.name}</span>
              <span className="cart-added-price">
                {item.qty > 1 ? `${item.qty} × ` : ""}
                {price(item.price)}
              </span>
            </div>
          </div>

          <div className="cart-added-sum">
            В количката: <b>{count}</b> {count === 1 ? "артикул" : "артикула"} ·{" "}
            {price(totals().subtotal)}
          </div>

          <div className="cart-added-actions">
            <button className="btn cart-added-cont" onClick={close} type="button">
              Продължи пазаруването
            </button>
            <Link className="btn btn-primary cart-added-go" href="/cart" onClick={close}>
              Поръчай сега
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
