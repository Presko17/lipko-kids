"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { CATEGORIES, categoryToSlug } from "@/lib/types";
import LeafMark from "@/components/LeafMark";
import CartDrawer from "@/components/CartDrawer";

export default function Nav() {
  const { count } = useCart();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  // Bounce the cart icon whenever the item count grows.
  const [bump, setBump] = useState(false);
  const prevCount = useRef(count);
  useEffect(() => {
    if (count > prevCount.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 520);
      prevCount.current = count;
      return () => clearTimeout(t);
    }
    prevCount.current = count;
  }, [count]);

  // First click opens the field; a second submit (with text) runs the search.
  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchOpen) {
      setSearchOpen(true);
      return;
    }
    const term = query.trim();
    if (term) {
      router.push(`/search?q=${encodeURIComponent(term)}`);
      setSearchOpen(false);
    } else {
      setSearchOpen(false);
    }
  };

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
          </nav>
          <span className="nav-spacer" />
          <form className={`nav-search${searchOpen ? " open" : ""}`} role="search" onSubmit={onSearchSubmit}>
            {searchOpen && (
              <input
                autoFocus
                type="search"
                className="nav-search-input"
                placeholder="Търси играчка…"
                aria-label="Търсене на играчки"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onBlur={() => { if (!query.trim()) setSearchOpen(false); }}
                onKeyDown={(e) => { if (e.key === "Escape") { setQuery(""); setSearchOpen(false); } }}
              />
            )}
            <button className="icon-btn" aria-label="Търсене" type="submit">
              🔍
            </button>
          </form>
          <button
            type="button"
            className={`icon-btn cart-link${bump ? " bump" : ""}`}
            aria-label="Количка"
            onClick={() => setCartOpen(true)}
          >
            🛒<span className={`cart-count${bump ? " pop" : ""}`}>{count}</span>
          </button>
        </div>
      </header>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
