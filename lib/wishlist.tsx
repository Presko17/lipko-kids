"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from "react";

// Saved ("любими") products. Signed-out visitors keep the ids in this browser;
// signed-in customers keep them on their account (synced across devices).
// Only ids are stored, newest first — the favourites page renders them from the
// live catalogue, so prices and stock stay current.
const KEY = "lipko-wishlist-v1";
export const FAV_LANDED = "lipko-fav-landed";

export type AccountUser = { id: string; email: string; name: string | null };

type WishlistValue = {
  ids: string[];
  count: number;
  ready: boolean;
  has: (id: string) => boolean;
  /** Adds or removes the product; returns true when it was added. */
  toggle: (id: string) => boolean;
  remove: (id: string) => void;
};

type AccountValue = {
  user: AccountUser | null;
  ready: boolean;
  /** Call after a successful login/registration with the server's response. */
  signedIn: (user: AccountUser, favorites: string[]) => void;
  logout: () => Promise<void>;
  /** Favourites saved in this browser while signed out (sent on login to merge). */
  localFavorites: () => string[];
};

const WishlistContext = createContext<WishlistValue | null>(null);
const AccountContext = createContext<AccountValue | null>(null);

const read = (): string[] => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
};
const write = (ids: string[] | null) => {
  try {
    if (ids) localStorage.setItem(KEY, JSON.stringify(ids));
    else localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
};

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [user, setUser] = useState<AccountUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/account/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { user: null }))
      .catch(() => ({ user: null }))
      .then((d: { user: AccountUser | null; favorites: string[] | null }) => {
        if (!alive) return;
        if (d.user) {
          setUser(d.user);
          setIds(d.favorites ?? []);
        } else {
          setIds(read());
        }
        setReady(true);
      });
    // Keep several open tabs in sync (signed-out list only).
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setIds((prev) => (userRef.current ? prev : read()));
    };
    window.addEventListener("storage", onStorage);
    return () => {
      alive = false;
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const userRef = useRef<AccountUser | null>(null);
  userRef.current = user;

  // Signed out: the browser is the store.
  useEffect(() => {
    if (ready && !user) write(ids);
  }, [ids, ready, user]);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  const sync = (id: string, on: boolean) => {
    if (!userRef.current) return;
    fetch("/api/account/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: id, on }),
    })
      .then((r) => {
        if (!r.ok) throw new Error();
      })
      .catch(() => {
        // Roll back the optimistic change if the server didn't take it.
        setIds((prev) => (on ? prev.filter((x) => x !== id) : prev.includes(id) ? prev : [id, ...prev]));
      });
  };

  const toggle = (id: string) => {
    const adding = !ids.includes(id);
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]));
    sync(id, adding);
    return adding;
  };

  const remove = (id: string) => {
    setIds((prev) => prev.filter((x) => x !== id));
    sync(id, false);
  };

  const account: AccountValue = {
    user,
    ready,
    signedIn: (u, favorites) => {
      setUser(u);
      setIds(favorites);
      write(null); // now kept on the account
    },
    logout: async () => {
      await fetch("/api/account/logout", { method: "POST" }).catch(() => {});
      setUser(null);
      setIds([]);
      write(null);
    },
    localFavorites: () => (user ? [] : ids),
  };

  return (
    <AccountContext.Provider value={account}>
      <WishlistContext.Provider value={{ ids, count: ids.length, ready, has, toggle, remove }}>
        {children}
      </WishlistContext.Provider>
    </AccountContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccount must be used inside WishlistProvider");
  return ctx;
}

/* ---------- the heart that flies to the nav ---------- */

const HEART =
  "M12 20.6s-7.6-4.7-9.3-9.6C1.5 7.4 3.9 4.3 7.3 4.3c2 0 3.6 1.1 4.7 2.8 1.1-1.7 2.7-2.8 4.7-2.8 3.4 0 5.8 3.1 4.6 6.7-1.7 4.9-9.3 9.6-9.3 9.6z";
const BURST = ["#d9683f", "#e2b54a", "#6f8f52", "#d9683f", "#e2b54a", "#6f8f52", "#d9683f"];

function heartEl(size: number, color: string, className: string) {
  const el = document.createElement("span");
  el.className = className;
  el.setAttribute("aria-hidden", "true");
  el.style.width = el.style.height = `${size}px`;
  el.innerHTML = `<svg viewBox="0 0 24 24" width="${size}" height="${size}"><path d="${HEART}" fill="${color}"/></svg>`;
  document.body.appendChild(el);
  return el;
}

const at = (x: number, y: number, size: number, extra = "") =>
  `translate(${x - size / 2}px, ${y - size / 2}px) ${extra}`;

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Small hearts pop out of the button, then one heart swoops up into the
// "Любими" button in the header. When it lands, the nav is told to bump.
export function flyHeart(from: HTMLElement) {
  const land = () => window.dispatchEvent(new Event(FAV_LANDED));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const target = document.querySelector<HTMLElement>("[data-fav-target]");
  const a = from.getBoundingClientRect();
  const b = target?.getBoundingClientRect();
  if (reduce || !b || !b.width || typeof document.body.animate !== "function") {
    land();
    return;
  }

  const x0 = a.left + a.width / 2;
  const y0 = a.top + a.height / 2;
  const x1 = b.left + b.width / 2;
  const y1 = b.top + b.height / 2;

  // Burst: tiny hearts in leaf, honey and terracotta fan out and fade.
  BURST.forEach((color, i) => {
    const size = 9 + (i % 3) * 2;
    const el = heartEl(size, color, "heart-spark");
    const ang = (-90 + (i - (BURST.length - 1) / 2) * 34) * (Math.PI / 180);
    const dist = 30 + (i % 2) * 14;
    const dx = Math.cos(ang) * dist;
    const dy = Math.sin(ang) * dist;
    el.animate(
      [
        { transform: at(x0, y0, size, "scale(.2)"), opacity: 1 },
        { transform: at(x0 + dx, y0 + dy, size, `scale(1) rotate(${(i - 3) * 12}deg)`), opacity: 1, offset: 0.55 },
        { transform: at(x0 + dx * 1.2, y0 + dy * 1.2 + 10, size, "scale(.6)"), opacity: 0 },
      ],
      { duration: 620, easing: "cubic-bezier(.2,.8,.3,1)" }
    ).onfinish = () => el.remove();
  });

  // Flight along a curve: rises from the product, then sweeps into the button.
  const size = 30;
  const el = heartEl(size, "#d9683f", "heart-fly");
  const cx = x0 + (x1 - x0) * 0.15;
  const cy = Math.max(12, Math.min(y0, y1) - 40);
  const frames: Keyframe[] = [
    { transform: at(x0, y0, size, "scale(.3)"), opacity: 0, offset: 0 },
    { transform: at(x0, y0 - 16, size, "scale(1.45) rotate(-8deg)"), opacity: 1, offset: 0.18 },
  ];
  const N = 16;
  for (let i = 1; i <= N; i++) {
    const t = easeInOut(i / N);
    const sy = y0 - 16;
    const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1;
    const y = (1 - t) * (1 - t) * sy + 2 * (1 - t) * t * cy + t * t * y1;
    const s = 1.45 - 0.95 * (i / N);
    frames.push({
      transform: at(x, y, size, `scale(${s.toFixed(3)}) rotate(${(-8 + 16 * (i / N)).toFixed(1)}deg)`),
      opacity: i === N ? 0.85 : 1,
      offset: 0.18 + 0.82 * (i / N),
    });
  }
  const anim = el.animate(frames, { duration: 900, easing: "linear" });
  anim.onfinish = () => {
    el.remove();
    land();
  };
  anim.oncancel = anim.onfinish;
}
