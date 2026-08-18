"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES, categoryToSlug } from "@/lib/types";

// Horizontal category pills, reused on /shop and each /category page. Highlights
// the active category from the URL. `counts` (optional) shows a number per pill.
export default function CategoryBar({ counts }: { counts?: Record<string, number> }) {
  const pathname = usePathname();
  const total = counts ? Object.values(counts).reduce((a, b) => a + b, 0) : undefined;

  return (
    <nav className="cat-bar" aria-label="Категории">
      <Link href="/shop" className={`cat-pill ${pathname === "/shop" ? "active" : ""}`}>
        Всички{total != null && <span className="cat-count">{total}</span>}
      </Link>
      {CATEGORIES.map((c) => {
        const href = `/category/${categoryToSlug(c)}`;
        const n = counts?.[c];
        return (
          <Link key={c} href={href} className={`cat-pill ${pathname === href ? "active" : ""}`}>
            {c}
            {n != null && <span className="cat-count">{n}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
