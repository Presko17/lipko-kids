"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { CATEGORIES, categoryToSlug } from "@/lib/types";
import LeafMark from "@/components/LeafMark";

export default function Nav() {
  const { count } = useCart();

  return (
    <>
      <div className="announce">
        Учене чрез игра · Безплатна доставка над 75 лв · Възраст 1–8
      </div>
      <header className="nav">
        <div className="wrap nav-inner">
          <Link href="/" className="logo">
            <LeafMark />
            Липко
          </Link>
          <nav className="nav-links">
            <Link href="/shop">Магазин</Link>

            <div className="nav-drop">
              <button type="button" className="nav-drop-btn">
                Играчки <span className="caret">▾</span>
              </button>
              <div className="nav-menu">
                {CATEGORIES.map((c) => (
                  <Link key={c} href={`/category/${categoryToSlug(c)}`}>
                    {c}
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/#news">Подаръци</Link>
          </nav>
          <span className="nav-spacer" />
          <button className="icon-btn" aria-label="Търсене" type="button">
            🔍
          </button>
          <Link className="icon-btn" href="/cart" aria-label="Количка">
            🛒<span className="cart-count">{count}</span>
          </Link>
        </div>
      </header>
    </>
  );
}
