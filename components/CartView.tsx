"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { tintOf } from "@/lib/types";
import { money } from "@/lib/money";
import { toast } from "./Toaster";

export default function CartView() {
  const { items, ready, setQty, remove, totals } = useCart();
  const [loading, setLoading] = useState(false);

  // Avoid a hydration mismatch: the cart lives in localStorage, so render
  // nothing until the client has read it.
  if (!ready) return <div id="cartRoot" />;

  const ids = Object.keys(items);

  if (ids.length === 0) {
    return (
      <main className="wrap" id="cartRoot">
        <div className="cart-empty">
          <div className="cart-empty-mark">
            <span className="mk-c" />
            <span className="mk-t" />
            <span className="mk-s" />
          </div>
          <h1>Количката ви е празна</h1>
          <p>Все още е празно — намерете нещо, което си заслужава.</p>
          <Link href="/#shop">
            <button className="btn btn-primary">Разгледай колекцията</button>
          </Link>
        </div>
      </main>
    );
  }

  const { subtotal, shipping, total, freeOver } = totals();
  const count = ids.reduce((n, id) => n + items[id].qty, 0);
  const away = freeOver - subtotal;

  const checkout = async () => {
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
    <main className="wrap" id="cartRoot">
      <h1 className="cart-title">
        Вашата количка{" "}
        <span className="cart-count-lbl">
          {count} {count === 1 ? "артикул" : "артикула"}
        </span>
      </h1>
      <div className="cart-grid">
        <div className="cart-lines">
          {ids.map((id) => {
            const { qty, product: p } = items[id];
            return (
              <div className="line" key={id}>
                <Link className={`line-media ${tintOf(p.id)}`} href={`/product/${p.id}`}>
                  {p.image ? <img className="pimg" src={p.image} alt={p.name} /> : p.emoji}
                </Link>
                <div className="line-main">
                  <Link className="line-name" href={`/product/${p.id}`}>
                    {p.name}
                  </Link>
                  <div className="line-meta">
                    {p.category} · {p.material} · Възраст {p.age}
                  </div>
                  <button
                    className="line-remove"
                    onClick={() => {
                      remove(id);
                      toast(`${p.name} е премахната`);
                    }}
                  >
                    Премахни
                  </button>
                </div>
                <div className="line-qty">
                  <div className="qty">
                    <button type="button" className="qminus" aria-label="Намали количеството" onClick={() => setQty(id, qty - 1)}>
                      −
                    </button>
                    <span className="qval">{qty}</span>
                    <button type="button" className="qplus" aria-label="Увеличи количеството" onClick={() => setQty(id, qty + 1)}>
                      +
                    </button>
                  </div>
                </div>
                <div className="line-price">{money(p.price * qty)}</div>
              </div>
            );
          })}
          <Link className="cart-continue" href="/#shop">
            ← Продължи пазаруването
          </Link>
        </div>

        <aside className="summary">
          <h2>Обобщение на поръчката</h2>
          <div className="sum-row">
            <span>Междинна сума</span>
            <span>{money(subtotal)}</span>
          </div>
          <div className="sum-row">
            <span>Доставка</span>
            <span>{shipping === 0 ? "Безплатна" : money(shipping)}</span>
          </div>
          <div className="sum-note">
            {shipping === 0 ? (
              <span className="ship-free">Спечелихте безплатна доставка 🎉</span>
            ) : (
              <>
                Добавете още <b>{money(away)}</b> за безплатна доставка
              </>
            )}
          </div>
          <div className="sum-row sum-total">
            <span>Общо</span>
            <span>{money(total)}</span>
          </div>
          <button className="btn btn-primary sum-checkout" onClick={checkout} disabled={loading}>
            {loading ? "Пренасочване…" : "Плащане"}
          </button>
          <ul className="assure">
            <li>
              <span className="mk m-circ" /> Сигурно плащане
            </li>
            <li>
              <span className="mk m-tri" /> Лесно връщане до 30 дни
            </li>
            <li>
              <span className="mk m-sq" /> 10 години гаранция за качество
            </li>
          </ul>
        </aside>
      </div>
    </main>
  );
}
