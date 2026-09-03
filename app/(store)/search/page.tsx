import type { Metadata } from "next";
import Link from "next/link";
import { getCatalogProducts } from "@/lib/products";
import { sortProducts } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import SortSelect from "@/components/SortSelect";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  const term = (q ?? "").trim();
  return {
    title: term ? `Търсене: ${term}` : "Търсене",
    // Result pages are per-query and thin — keep them out of the index.
    robots: { index: false, follow: true },
  };
}

const norm = (s: string) => (s ?? "").toLowerCase();

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string }>;
}) {
  const { q, sort } = await searchParams;
  const term = (q ?? "").trim();

  const all = await getCatalogProducts();
  const words = norm(term).split(/\s+/).filter(Boolean);
  const matches = term
    ? all.filter((p) => {
        const hay = norm(`${p.name} ${p.category} ${p.material} ${p.age} ${p.tag ?? ""} ${p.desc}`);
        return words.every((w) => hay.includes(w));
      })
    : [];
  const sorted = sortProducts(matches, sort);

  return (
    <main className="section">
      <div className="wrap">
        <nav className="crumbs" aria-label="Трохи">
          <Link href="/">Начало</Link>
          <span>/</span>
          <Link href="/shop">Магазин</Link>
          <span>/</span>
          <span className="here">Търсене</span>
        </nav>
        <div className="cat-head">
          <div>
            <h1>{term ? `Резултати за „${term}“` : "Търсене"}</h1>
            <p className="lede">
              {term
                ? `${sorted.length} ${sorted.length === 1 ? "намерена играчка" : "намерени играчки"}`
                : "Въведете дума, за да намерите играчка."}
            </p>
          </div>
          {sorted.length > 0 && (
            <div className="cat-tools">
              <SortSelect />
            </div>
          )}
        </div>
        {term && sorted.length === 0 ? (
          <p className="admin-empty">
            Няма намерени играчки за „{term}“. Опитайте друга дума или разгледайте{" "}
            <Link href="/shop/all">всички играчки</Link>.
          </p>
        ) : (
          <div className="grid">
            {sorted.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
