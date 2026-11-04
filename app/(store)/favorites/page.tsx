import type { Metadata } from "next";
import Link from "next/link";
import { getCatalogProducts } from "@/lib/products";
import FavoritesView from "@/components/FavoritesView";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Любими",
  // Per-visitor list saved in the browser — nothing to index.
  robots: { index: false, follow: true },
};

export default async function FavoritesPage() {
  const products = await getCatalogProducts();

  return (
    <main className="section">
      <div className="wrap">
        <nav className="crumbs" aria-label="Трохи">
          <Link href="/">Начало</Link>
          <span>/</span>
          <span className="here">Любими</span>
        </nav>
        <FavoritesView products={products} />
      </div>
    </main>
  );
}
