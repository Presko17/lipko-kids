import Link from "next/link";
import type { Metadata } from "next";
import { getAllProducts } from "@/lib/products";
import ProductsTable from "@/components/admin/ProductsTable";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Продукти — Липко админ" };

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const term = (q ?? "").trim().toLowerCase();
  const all = await getAllProducts();
  const products = term
    ? all.filter((p) => `${p.name} ${p.category} ${p.id}`.toLowerCase().includes(term))
    : all;

  return (
    <div className="admin-page">
      <header className="admin-head">
        <div>
          <h1>Продукти</h1>
          <p>
            {term ? (
              <>
                {products.length} от {all.length} за „{q}“ ·{" "}
                <Link href="/admin/products" className="admin-clear">
                  изчисти търсенето
                </Link>
              </>
            ) : (
              `${all.length} общо`
            )}
          </p>
        </div>
        <div className="admin-head-actions">
          <Link href="/admin/import" className="btn btn-ghost">
            Импортиране
          </Link>
          <Link href="/admin/products/new" className="btn btn-primary">
            + Нов продукт
          </Link>
        </div>
      </header>

      <div className="admin-card admin-card-flush">
        <div className="admin-table-wrap">
          <ProductsTable
            products={products.map((p) => ({
              id: p.id,
              name: p.name,
              image: p.images[0] ?? null,
              emoji: p.emoji,
              category: p.category,
              shipsFrom: p.shipsFrom,
              supplierMinimum: p.supplierMinimum,
              price: p.price,
              stock: p.stock,
              active: p.active,
              promo: p.promo,
              featured: p.featured,
            }))}
          />
        </div>
      </div>
    </div>
  );
}
