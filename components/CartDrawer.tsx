"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { tintOf } from "@/lib/types";
import { money } from "@/lib/money";
import { toast } from "./Toaster";

// Slide-in cart drawer: opens from the right on desktop, covers the full screen
// on mobile. Shows the cart with a checkout ("Поръчай") and a "Виж количката"
// button, plus a close (×) in the top-right corner.
export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, ready, setQty, remove, totals } = useCart();
  const [loading, setLoading] = useState(false);

  // Lock body scroll and allow Escape to close while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const ids = ready ? Object.keys(items) : [];
  const { total, shipping } = totals();
  const count = ids.reduce((n, id) => n + items[id].qty, 0);

  // Straight to Stripe Checkout — same flow as the cart page's "Плащане".
  const checkout = async () => {
    if (ids.length === 0) return;
    setLoading(true);
    try {
      const payload = Object.fromEntries(ids.map((id) => [id, items[id].qty]));
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: payload }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        toast(data.error || "Плащането не бе успешно — опитайте отново.");
        setLoading(false);
      }
    } catch {
      toast("Плащането не бе успешно — опитайте отново.");
      setLoading(false);
    }
  };

  return (
    <div className={`drawer-root${open ? " open" : ""}`} aria-hidden={!open}>
      <div className="drawer-backdrop" onClick={onClose} />
      <aside className="drawer-panel" role="dialog" aria-modal="true" aria-label="Количка">
        <header className="drawer-head">
          <b>
            Количка
            {count > 0 && <span className="drawer-count">{count}</span>}
          </b>
          <button className="drawer-x" onClick={onClose} aria-label="Затвори" type="button">
            ×
          </button>
        </header>

        {ids.length === 0 ? (
          <div className="drawer-empty">
            <p>Количката ви е празна.</p>
            <Link href="/#shop" className="btn btn-primary" onClick={onClose}>
              Разгледай магазина
            </Link>
          </div>
        ) : (
          <>
            <div className="drawer-lines">
              {ids.map((id) => {
                const { qty, product: p } = items[id];
                return (
                  <div className="drawer-line" key={id}>
                    <Link
                      className={`drawer-media ${tintOf(p.id)}`}
                      href={`/product/${p.id}`}
                      onClick={onClose}
                    >
                      {p.image ? <img src={p.image} alt={p.name} /> : <span>{p.emoji}</span>}
                    </Link>
                    <div className="drawer-line-main">
                      <Link className="drawer-line-name" href={`/product/${p.id}`} onClick={onClose}>
                        {p.name}
                      </Link>
                      <div className="drawer-line-price">{money(p.price * qty)}</div>
                      <div className="drawer-line-row">
                        <div className="qty drawer-qty">
                          <button type="button" onClick={() => setQty(id, qty - 1)} aria-label="Намали количеството">
                            −
                          </button>
                          <span className="qval">{qty}</span>
                          <button type="button" onClick={() => setQty(id, qty + 1)} aria-label="Увеличи количеството">
                            +
                          </button>
                        </div>
                        <button
                          className="drawer-remove"
                          type="button"
                          onClick={() => {
                            remove(id);
                            toast(`${p.name} е премахната`);
                          }}
                        >
                          Премахни
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <footer className="drawer-foot">
              <div className="drawer-sum">
                <span>Общо{shipping === 0 ? " · безплатна доставка" : ""}</span>
                <b>{money(total)}</b>
              </div>
              <div className="drawer-actions">
                <button
                  className="btn btn-primary drawer-checkout"
                  onClick={checkout}
                  disabled={loading}
                  type="button"
                >
                  {loading ? "Пренасочване…" : "Поръчай"}
                </button>
                <Link href="/cart" className="btn drawer-viewcart" onClick={onClose}>
                  Виж количката
                </Link>
              </div>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
