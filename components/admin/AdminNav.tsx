"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import LeafMark from "@/components/LeafMark";

const LINKS = [
  { href: "/admin", label: "Табло", icon: "▚" },
  { href: "/admin/orders", label: "Поръчки", icon: "🧾" },
  { href: "/admin/products", label: "Продукти", icon: "📦" },
  { href: "/admin/categories", label: "Категории", icon: "🏷︎" },
  { href: "/admin/import", label: "Импортиране", icon: "⬇︎" },
  { href: "/admin/customers", label: "Клиенти", icon: "👤" },
  { href: "/admin/settings", label: "Настройки", icon: "⚙︎" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const active = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="admin-nav">
      <div className="admin-brand">
        <LeafMark />
        <span>Липко</span>
      </div>
      <nav className="admin-links">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className={active(l.href) ? "active" : ""}>
            <span className="ai">{l.icon}</span>
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="admin-nav-foot">
        <Link href="/" className="admin-viewsite" target="_blank">
          Виж магазина ↗
        </Link>
        <button className="admin-logout" onClick={logout}>
          Изход
        </button>
      </div>
    </aside>
  );
}
