"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import LeafMark from "@/components/LeafMark";
import { Icon } from "./icons";

const THEME_KEY = "lipko-admin-theme";

const TABS = [
  { href: "/admin", label: "Табло" },
  { href: "/admin/orders", label: "Поръчки", badge: "toShip" },
  { href: "/admin/products", label: "Продукти", badge: "lowStock" },
  { href: "/admin/categories", label: "Категории" },
  { href: "/admin/import", label: "Импорт" },
  { href: "/admin/customers", label: "Клиенти" },
  { href: "/admin/settings", label: "Настройки" },
] as const;

const isActive = (pathname: string, href: string) =>
  href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

// Admin chrome: top bar (logo · pill tabs with a sliding active indicator ·
// bell + account menu) and a floating rail of quick actions.
export default function AdminChrome({ toShip, lowStock }: { toShip: number; lowStock: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const counts: Record<string, number> = { toShip, lowStock };

  // Optimistic tab: the pill moves the moment a tab is clicked, instead of
  // waiting for the (server-rendered) page to arrive. Cleared on route commit.
  const [pending, setPending] = useState<string | null>(null);
  useEffect(() => setPending(null), [pathname]);
  const current = pending ?? pathname;

  /* ---------- sliding active pill ---------- */
  const trackRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState({ x: 0, w: 0, on: false });
  // The slide transition switches on only after the first placement has
  // painted, so the pill doesn't fly in from the left edge on page load.
  const [animOn, setAnimOn] = useState(false);

  const place = useCallback((smooth: boolean) => {
    const track = trackRef.current;
    const el = track?.querySelector<HTMLElement>('[data-active="true"]');
    if (!track || !el) {
      setPill((p) => ({ ...p, on: false }));
      return;
    }
    setPill({ x: el.offsetLeft, w: el.offsetWidth, on: true });
    // Keep the active tab in view when the tab row scrolls (phones).
    if (track.scrollWidth > track.clientWidth) {
      track.scrollTo({
        left: el.offsetLeft - (track.clientWidth - el.offsetWidth) / 2,
        behavior: smooth ? "smooth" : "auto",
      });
    }
  }, []);

  // Re-place whenever the (optimistic) current tab changes.
  useLayoutEffect(() => {
    place(animOn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, place]);

  // Mount only: enable the transition after first paint; re-measure on resize
  // and once web fonts have loaded (they can change tab widths).
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

  /* ---------- theme (system by default, toggle overrides) ---------- */
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const shell = document.querySelector<HTMLElement>(".admin-shell");
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(THEME_KEY);
    } catch {
      /* ignore */
    }
    if (shell && (saved === "dark" || saved === "light")) shell.setAttribute("data-theme", saved);
    const explicit = shell?.getAttribute("data-theme");
    const system = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    setTheme(explicit === "dark" || explicit === "light" ? explicit : system);
  }, []);
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.querySelector<HTMLElement>(".admin-shell")?.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* ignore */
    }
  };

  /* ---------- search popover + account menu ---------- */
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Close popovers when the route changes.
  useEffect(() => {
    setSearchOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? `/admin/products?q=${encodeURIComponent(term)}` : "/admin/products");
    setSearchOpen(false);
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <>
      <header className="atop">
        <Link href="/admin" className="atop-brand" aria-label="Липко — табло">
          <span className="atop-logo">
            <LeafMark />
          </span>
          <span className="atop-brand-text">
            <b>Липко</b>
            <small>Админ панел</small>
          </span>
        </Link>

        <nav className="atabs" aria-label="Основна навигация">
          <div className={`atabs-track${pill.on ? " ready" : ""}`} ref={trackRef}>
            <span
              className={`atabs-pill${pill.on ? " on" : ""}${animOn ? " anim" : ""}`}
              style={{ transform: `translateX(${pill.x}px)`, width: pill.w }}
              aria-hidden="true"
            />
            {TABS.map((t) => {
              const active = isActive(current, t.href);
              const n = "badge" in t ? counts[t.badge] : 0;
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className={`atab${active ? " active" : ""}`}
                  data-active={active}
                  aria-current={isActive(pathname, t.href) ? "page" : undefined}
                  aria-label={n > 0 ? `${t.label} (${n})` : undefined}
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                    if (!isActive(pathname, t.href)) setPending(t.href);
                  }}
                >
                  {t.label}
                  {n > 0 && <span className="atab-badge">{n}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="atop-right">
          <Link
            href="/admin/orders"
            className="acircle"
            aria-label={toShip > 0 ? `${toShip} поръчки чакат изпращане` : "Поръчки"}
            title={toShip > 0 ? `${toShip} за изпращане` : "Няма чакащи поръчки"}
          >
            <Icon name="bell" />
            {toShip > 0 && <span className="acircle-dot" />}
          </Link>
          <div className="aavatar-wrap" ref={menuRef}>
            <button
              type="button"
              className="aavatar"
              aria-label="Меню на профила"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              Л
            </button>
            {menuOpen && (
              <div className="amenu" role="menu">
                <a href="/" target="_blank" rel="noopener noreferrer" role="menuitem">
                  <Icon name="external" size={16} /> Виж магазина
                </a>
                <Link href="/admin/settings" role="menuitem">
                  <Icon name="settings" size={16} /> Настройки
                </Link>
                <button type="button" role="menuitem" className="danger" onClick={logout}>
                  <Icon name="logout" size={16} /> Изход
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <aside className="arail" aria-label="Бързи действия">
        <div className="arail-search" ref={searchRef}>
          <button
            type="button"
            className="arail-btn"
            aria-label="Търсене на продукт"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((o) => !o)}
          >
            <Icon name="search" />
            <span className="arail-tip">Търсене</span>
          </button>
          {searchOpen && (
            <form className="arail-pop" onSubmit={submitSearch} role="search">
              <Icon name="search" size={16} />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Търси продукт…"
                aria-label="Търси продукт"
              />
              <button type="submit">Търси</button>
            </form>
          )}
        </div>
        <Link href="/admin/products/new" className="arail-btn" aria-label="Нов продукт">
          <Icon name="plus" />
          <span className="arail-tip">Нов продукт</span>
        </Link>
        <button
          type="button"
          className="arail-btn"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Светла тема" : "Тъмна тема"}
        >
          <Icon name={theme === "dark" ? "sun" : "moon"} />
          <span className="arail-tip">{theme === "dark" ? "Светла тема" : "Тъмна тема"}</span>
        </button>
        <span className="arail-sep" aria-hidden="true" />
        <a href="/" target="_blank" rel="noopener noreferrer" className="arail-btn" aria-label="Виж магазина">
          <Icon name="external" />
          <span className="arail-tip">Виж магазина</span>
        </a>
        <button type="button" className="arail-btn" onClick={logout} aria-label="Изход">
          <Icon name="logout" />
          <span className="arail-tip">Изход</span>
        </button>
      </aside>
    </>
  );
}
