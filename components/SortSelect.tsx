"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SORT_OPTIONS } from "@/lib/types";

// Icon-only sort control: a compact button showing a sort glyph, with a
// transparent native <select> on top that opens the options. State lives in
// the URL (?sort=…) so the server re-renders the grid in the chosen order.
export default function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") ?? "";
  const currentLabel = SORT_OPTIONS.find((o) => o.value === current)?.label ?? "Подредба";

  const onChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("sort", value);
    else params.delete("sort");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <div
      className={`sort-btn${current ? " active" : ""}`}
      title={`Сортиране: ${currentLabel}`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 6h16M6 12h12M9 18h6" />
      </svg>
      <select
        value={current}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Сортиране на продуктите"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
