"use client";

import Link from "next/link";
import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { useWishlist, useAccount, FAV_LANDED } from "@/lib/wishlist";
import LeafMark from "@/components/LeafMark";
import CartDrawer from "@/components/CartDrawer";
import NavSearchPop from "@/components/NavSearchPop";
import { Icon } from "@/components/admin/icons";

const TABS = [
  { href: "/", label: "Начало" },
  { href: "/shop", label: "Категории" },
  { href: "/shop/all", label: "Всички играчки" },
  { href: "/faq", label: "Въпроси" },
  { href: "/orders", label: "Моята поръчка" },
] as const;

// Which tab a path belongs to. Category pages live under "Категории";
// /shop/all and product pages under "Всички играчки".
const tabFor = (path: string) => {
  if (path === "/") return "/";
  if (path.startsWith("/shop/all") || path.startsWith("/product") || path.startsWith("/search")) return "/shop/all";
  if (path.startsWith("/shop") || path.startsWith("/category")) return "/shop";
  if (path.startsWith("/faq")) return "/faq";
  if (path.startsWith("/orders") || path.startsWith("/order/")) return "/orders";
  return null;
};

export default function Nav() {
  const { count } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  /* ---------- sliding active pill (same behaviour as the admin) ---------- */
  const [pending, setPending] = useState<string | null>(null);
  useEffect(() => setPending(null), [pathname]);
  const current = pending ?? tabFor(pathname);

  const trackRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState({ x: 0, w: 0, on: false });
  const [animOn, setAnimOn] = useState(false);

  // The tab row sticks under the glass bar; once it's floating over content
  // it gets a deeper shadow.
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const place = useCallback((smooth: boolean) => {
    const track = trackRef.current;
    const el = track?.querySelector<HTMLElement>('[data-active="true"]');
    if (!track || !el) {
      setPill((p) => ({ ...p, on: false }));
      return;
    }
    setPill({ x: el.offsetLeft, w: el.offsetWidth, on: true });
    if (track.scrollWidth > track.clientWidth) {
      track.scrollTo({
        left: el.offsetLeft - (track.clientWidth - el.offsetWidth) / 2,
        behavior: smooth ? "smooth" : "auto",
      });
    }
  }, []);

  useLayoutEffect(() => {
    place(animOn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, place]);

  useEffect(() => {
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setAnimOn(true));
    });
    const onResize = () => place(false);
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(() => place(false)).catch(() => {});
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.removeEventListener("resize", onResize);
    };
  }, [place]);

  /* ---------- cart bounce ---------- */
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

  /* ---------- favourites: the count updates when the flying heart lands ---------- */
  const { count: favLive, ready: favReady } = useWishlist();
  const { user } = useAccount();
  const [favCount, setFavCount] = useState(0);
  const [favBump, setFavBump] = useState(false);
  const favLiveRef = useRef(favLive);
  favLiveRef.current = favLive;
  const favInit = useRef(false);
  useEffect(() => {
    // The first load and removals show at once; additions wait for the heart
    // to land (with a fallback in case the flight never finishes).
    if (!favReady) return;
    if (!favInit.current) {
      favInit.current = true;
      setFavCount(favLive);
      return;
    }
    setFavCount((c) => Math.min(c, favLive));
    const t = setTimeout(() => setFavCount(favLiveRef.current), 1400);
    return () => clearTimeout(t);
  }, [favLive, favReady]);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const onLand = () => {
      setFavCount(favLiveRef.current);
      setFavBump(true);
      clearTimeout(t);
      t = setTimeout(() => setFavBump(false), 620);
    };
    window.addEventListener(FAV_LANDED, onLand);
    return () => {
      window.removeEventListener(FAV_LANDED, onLand);
      clearTimeout(t);
    };
  }, []);

  /* ---------- search ---------- */
  const searchRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (!searchOpen) return;
    const onDown = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [searchOpen]);
  useEffect(() => setSearchOpen(false), [pathname]);

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = query.trim();
    if (!term) return;
    router.push(`/search?q=${encodeURIComponent(term)}`);
    setSearchOpen(false);
  };

  return (
    <>
      <header className="nav">
        <div className="wrap nav-inner">
          <Link href="/" className="logo" aria-label="Липко — начало">
            <span className="logo-tile">
              <LeafMark />
            </span>
            <span className="logo-text">Липко</span>
          </Link>

          <div className="nav-right">
            <form
              ref={searchRef}
              className={`nav-search${searchOpen ? " open" : ""}`}
              role="search"
              onSubmit={onSearchSubmit}
            >
              <button
                className="icon-btn"
                type="button"
                aria-label="Търсене"
                aria-expanded={searchOpen}
                onClick={() => setSearchOpen((o) => !o)}
              >
                <Icon name={searchOpen ? "close" : "search"} />
              </button>
              {searchOpen && (
                <NavSearchPop query={query} setQuery={setQuery} onClose={() => setSearchOpen(false)} />
              )}
            </form>
            <Link
              href="/favorites"
              className={`icon-btn fav-link${favCount > 0 ? " has" : ""}${favBump ? " bump" : ""}`}
              aria-label={`Любими (${favCount})`}
              title="Любими"
              aria-current={pathname === "/favorites" ? "page" : undefined}
              data-fav-target
            >
              <Icon name="heart" />
              {favCount > 0 && <span className={`fav-count${favBump ? " pop" : ""}`}>{favCount}</span>}
            </Link>
            <Link
              href="/account"
              className={`icon-btn acct-link${user ? " in" : ""}`}
              aria-label={user ? `Профил (${user.email})` : "Вход в профила"}
              title={user ? "Профил" : "Вход"}
              aria-current={pathname === "/account" ? "page" : undefined}
            >
              <Icon name="user" />
            </Link>
            <button
              type="button"
              className={`icon-btn icon-btn-dark cart-link${bump ? " bump" : ""}`}
              aria-label={`Количка (${count})`}
              onClick={() => setCartOpen(true)}
            >
              <Icon name="bag" />
              {count > 0 && <span className={`cart-count${bump ? " pop" : ""}`}>{count}</span>}
            </button>
          </div>
        </div>
      </header>
      {/* Section tabs: their own sticky row under the glass bar, no glass behind them. */}
      <div className={`stabs-row${stuck ? " stuck" : ""}`}>
        <div className="wrap">
            <nav className="stabs" aria-label="Основна навигация">
              <div className={`stabs-track${pill.on ? " ready" : ""}`} ref={trackRef}>
                <span
                  className={`stabs-pill${pill.on ? " on" : ""}${animOn ? " anim" : ""}`}
                  style={{ transform: `translateX(${pill.x}px)`, width: pill.w }}
                  aria-hidden="true"
                />
                {TABS.map((t) => {
                  const active = current === t.href;
                  return (
                    <Link
                      key={t.href}
                      href={t.href}
                      className={`stab${active ? " active" : ""}`}
                      data-active={active}
                      aria-current={tabFor(pathname) === t.href ? "page" : undefined}
                      onClick={(e) => {
                        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                        if (tabFor(pathname) !== t.href) setPending(t.href);
                      }}
                    >
                      {t.label}
                    </Link>
                  );
                })}
              </div>
            </nav>
        </div>
      </div>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
