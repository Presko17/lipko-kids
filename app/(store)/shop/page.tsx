import type { Metadata } from "next";
import Link from "next/link";
import { getCategoryThumbs } from "@/lib/products";
import { CATEGORIES, CATEGORY_EMOJI, categoryToSlug } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Магазин",
  description:
    "Разгледайте играчките в Липко по категория — Монтесори, STEM, пъзели, образователни, ролеви игри и още.",
};

export default async function ShopPage() {
  const catImages = await getCategoryThumbs();

  return (
    <main className="section">
      <div className="wrap">
        <nav className="crumbs" aria-label="Трохи">
          <Link href="/">Начало</Link>
          <span>/</span>
          <span className="here">Магазин</span>
        </nav>
        <div className="cat-head">
          <div>
            <h1>Магазин</h1>
            <p className="lede">Изберете категория, за да разгледате играчките в нея.</p>
          </div>
        </div>

        <div className="shop-cats">
          <Link href="/shop/all" className="shop-cat shop-cat-all tint-0">
            <span className="shop-cat-img">
              <span className="shop-cat-emoji">✨</span>
            </span>
            <span className="shop-cat-name">Всички играчки</span>
          </Link>
          {CATEGORIES.map((c, i) => {
            const img = catImages[c];
            return (
              <Link
                key={c}
                href={`/category/${categoryToSlug(c)}`}
                className={`shop-cat tint-${(i + 1) % 4}`}
              >
                <span className="shop-cat-img">
                  {img ? (
                    <img src={img} alt={c} loading="lazy" />
                  ) : (
                    <span className="shop-cat-emoji">{CATEGORY_EMOJI[c] ?? "🧸"}</span>
                  )}
                </span>
                <span className="shop-cat-name">{c}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
