import Link from "next/link";
import type { Metadata } from "next";
import { getOrders } from "@/lib/orders";
import { money } from "@/lib/money";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Поръчки — Липко админ" };

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="admin-page">
      <header className="admin-head">
        <h1>Поръчки</h1>
        <p>{orders.length} общо</p>
      </header>

      {orders.length === 0 ? (
        <div className="admin-card">
          <p className="admin-empty">Все още няма поръчки. Завършените плащания ще се появят тук.</p>
        </div>
      ) : (
        <div className="admin-card admin-card-flush">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Поръчка</th>
                  <th>Клиент</th>
                  <th>Дата</th>
                  <th>Статус</th>
                  <th>Плащане</th>
                  <th className="num">Сума</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <Link href={`/admin/orders/${o.id}`} className="admin-mono">
                        {o.id.replace(/^cs_(test|live)_/, "").slice(0, 10).toUpperCase()}
                      </Link>
                    </td>
                    <td>
                      <div>{o.name || "—"}</div>
                      <div className="admin-sub">{o.email || "—"}</div>
                    </td>
                    <td>{new Date(o.createdAt).toLocaleDateString("bg-BG")}</td>
                    <td>
                      <span className="admin-pill">{o.status}</span>
                    </td>
                    <td>
                      <span className={`admin-pill ${o.paymentStatus === "paid" ? "ok" : ""}`}>
                        {o.paymentStatus === "paid" ? "Платена" : "—"}
                      </span>
                    </td>
                    <td className="num">{money(o.amountTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
