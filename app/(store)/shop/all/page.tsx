import type { Metadata } from "next";
import Link from "next/link";
import { getCatalogProducts } from "@/lib/products";
import { sortProducts } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import SortSelect from "@/components/SortSelect";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Всички играчки",
  description: "Всички налични образователни и дървени играчки в Липко на едно място.",
};

export default async function AllProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const { sort } = await searchParams;
  const products = await getCatalogProducts();
  const sorted = sortProducts(products, sort);

  return (
    <main className="section">
      <div className="wrap">
        <nav className="crumbs" aria-label="Трохи">
          <Link href="/">Начало</Link>
          <span>/</span>
          <Link href="/shop">Магазин</Link>
          <span>/</span>
          <span className="here">Всички играчки</span>
        </nav>
        <div className="cat-head">
          <div>
            <h1>Всички играчки</h1>
            <p className="lede">Всички налични играчки на едно място.</p>
          </div>
          <div className="cat-tools">
            <SortSelect />
          </div>
        </div>
        {sorted.length === 0 ? (
          <p className="admin-empty">Все още няма налични играчки.</p>
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
