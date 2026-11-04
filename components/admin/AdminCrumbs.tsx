"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./icons";

const NAMES: Record<string, string> = {
  orders: "Поръчки",
  products: "Продукти",
  categories: "Категории",
  import: "Импорт",
  customers: "Клиенти",
  settings: "Настройки",
  new: "Нов продукт",
};

// Breadcrumb trail derived from the URL + a live status chip (time, orders
// waiting, low stock). Shared by every admin page.
export function AdminCrumbs({ toShip, lowStock }: { toShip: number; lowStock: number }) {
  const pathname = usePathname();
  const segs = pathname.split("/").filter(Boolean).slice(1); // drop "admin"

  const crumbs: { href: string; label: string }[] = [{ href: "/admin", label: "Липко" }];
  if (segs.length === 0) crumbs.push({ href: "/admin", label: "Табло" });
  let acc = "/admin";
  segs.forEach((s, i) => {
    acc += `/${s}`;
    const parent = segs[i - 1];
    const label =
      NAMES[s] ??
      (parent === "orders" ? "Поръчка" : parent === "products" ? "Редакция" : decodeURIComponent(s));
    crumbs.push({ href: acc, label });
  });

  // Clock rendered only after mount (avoids a server/client time mismatch).
  const [now, setNow] = useState("");
  useEffect(() => {
    const tick = () =>
      setNow(new Date().toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const busy = toShip > 0;

  return (
    <div className="acrumbs-row">
      <nav className="acrumbs" aria-label="Път">
        {crumbs.map((c, i) =>
          i < crumbs.length - 1 ? (
            <span key={`${c.href}-${i}`}>
              <Link href={c.href}>{c.label}</Link>
              <Icon name="chevron" size={13} />
            </span>
          ) : (
            <span key={`${c.href}-${i}`} className="here" aria-current="page">
              {c.label}
            </span>
          )
        )}
      </nav>

      <Link href={busy ? "/admin/orders" : "/admin/products"} className="astatus">
        <span className={`astatus-dot${busy ? " busy" : ""}`} aria-hidden="true" />
        {now && <b>{now}</b>}
        <span className="astatus-text">
          <span>
            {busy
              ? `${toShip} ${toShip === 1 ? "поръчка" : "поръчки"} за изпращане`
              : "Няма чакащи поръчки"}
          </span>
          <small>{lowStock > 0 ? `${lowStock} с ниска наличност` : "Наличностите са наред"}</small>
        </span>
      </Link>
    </div>
  );
}

// Re-keys on route change so each page fades in (fade-only under reduced motion).
export function AdminFade({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="afade">
      {children}
    </div>
  );
}
