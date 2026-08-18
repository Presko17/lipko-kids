import Link from "next/link";
import type { Metadata } from "next";
import { getAllProducts } from "@/lib/products";
import { price } from "@/lib/money";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Продукти — Липко админ" };

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div className="admin-page">
      <header className="admin-head">
        <div>
          <h1>Продукти</h1>
          <p>{products.length} общо</p>
        </div>
        <div className="admin-head-actions">
          <Link href="/admin/import">
            <button className="btn btn-ghost">⬇︎ Импортиране</button>
          </Link>
          <Link href="/admin/products/new">
            <button className="btn btn-primary">+ Нов продукт</button>
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
                <th className="num">Цена</th>
                <th className="num">Наличност</th>
                <th>Статус</th>
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
