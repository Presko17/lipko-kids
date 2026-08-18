"use client";

import { useRouter } from "next/navigation";
import { CATEGORIES, categoryToSlug } from "@/lib/types";

// Compact category dropdown for the catalog pages — categories are tucked into a
// menu instead of a permanent bar above the products. `current` is the active
// category slug, or null on the "all" (/shop) page.
export default function CategorySelect({
  counts,
  current,
}: {
  counts?: Record<string, number>;
  current?: string | null;
}) {
  const router = useRouter();
  const total = counts ? Object.values(counts).reduce((a, b) => a + b, 0) : undefined;

  return (
    <div className="cat-select">
      <span className="cat-select-label">Категория</span>
      <select
        value={current ?? "all"}
        onChange={(e) => {
          const v = e.target.value;
          router.push(v === "all" ? "/shop" : `/category/${v}`);
        }}
      >
        <option value="all">Всички{total != null ? ` (${total})` : ""}</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={categoryToSlug(c)}>
            {c}
            {counts?.[c] != null ? ` (${counts[c]})` : ""}
          </option>
        ))}
      </select>
    </div>
  );
}
