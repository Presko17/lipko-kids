import Link from "next/link";
import type { Metadata } from "next";
import { getAllProducts } from "@/lib/products";
import { price } from "@/lib/money";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

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
          <table className="admin-table">
            <thead>
              <tr>
                <th>Продукт</th>
                <th>Категория</th>
                <th>Доставка от</th>
                <th className="num">Цена</th>
                <th className="num">Наличност</th>
                <th>Статус</th>
                <th>Етикети</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link href={`/admin/products/${p.id}`} className="admin-prod">
                      <span className="admin-thumb">
                        {p.images[0] ? <img src={p.images[0]} alt="" /> : <span>{p.emoji}</span>}
                      </span>
                      {p.name}
                    </Link>
                  </td>
                  <td>{p.category}</td>
                  <td className="admin-ships">
                    {p.shipsFrom ? `Доставка от ${p.shipsFrom}` : <span className="admin-tag-none">—</span>}
                  </td>
                  <td className="num">{price(p.price)}</td>
                  <td className="num">
                    <span className={`admin-stock ${p.stock === 0 ? "out" : p.stock <= 5 ? "low" : ""}`}>
                      {p.stock} бр.
                    </span>
                  </td>
                  <td>
                    <span className={`admin-pill ${p.active ? "ok" : ""}`}>
                      {p.active ? "Активен" : "Скрит"}
                    </span>
                  </td>
                  <td>
                    <div className="admin-tags">
                      {p.promo && <span className="admin-tag promo">Промо</span>}
                      {p.featured && <span className="admin-tag featured">Търсен</span>}
                      {!p.promo && !p.featured && <span className="admin-tag-none">—</span>}
                    </div>
                  </td>
                  <td className="admin-row-actions">
                    <DeleteProductButton id={p.id} name={p.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
