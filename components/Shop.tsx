import Link from "next/link";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import CategoryBar from "./CategoryBar";

export default function Shop({
  products,
  title = "Играчки, които учат на нещо",
  lede = "Всяка развива истинско умение — букви, броене, сортиране, координация — докато прилича на игра.",
  showCategories = true,
  variant = "default", // "showcase" = big images; "row" = always one row
  footerHref,
  footerText,
  emptyText,
}: {
  products: Product[];
  title?: string | null; // null hides the section header (showcase look)
  lede?: string;
  showCategories?: boolean;
  variant?: "default" | "showcase" | "row"; // showcase = big images; row = single row
  footerHref?: string; // centered link under the grid
  footerText?: string;
  emptyText?: string;
}) {
  const counts: Record<string, number> = {};
  for (const p of products) counts[p.category] = (counts[p.category] ?? 0) + 1;

  return (
    <section className={`section ${variant === "showcase" ? "showcase" : ""}`} id="shop">
      <div className="wrap">
        {title && (
          <div className="sec-head">
            <div>
              <h2>{title}</h2>
              {lede && <p className="lede">{lede}</p>}
            </div>
          </div>
        )}
        {showCategories && <CategoryBar counts={counts} />}
        {products.length === 0 ? (
          <p className="admin-empty">{emptyText ?? "Няма продукти."}</p>
        ) : (
          <div
            className={`grid ${
              variant === "showcase" ? "grid-showcase" : variant === "row" ? "grid-row" : ""
            }`}
          >
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
        {footerHref && (
          <div className="sec-foot">
            <Link href={footerHref} className="sec-foot-link">
              {footerText ?? "Виж всички играчки →"}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
