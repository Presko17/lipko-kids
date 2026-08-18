import type { Metadata } from "next";
import { getCustomers } from "@/lib/orders";
import { money } from "@/lib/money";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Клиенти — Липко админ" };

export default async function AdminCustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="admin-page">
      <header className="admin-head">
        <h1>Клиенти</h1>
        <p>{customers.length} общо</p>
      </header>

      {customers.length === 0 ? (
        <div className="admin-card">
          <p className="admin-empty">Още няма клиенти. Клиентите се появяват след първата поръчка.</p>
        </div>
      ) : (
        <div className="admin-card admin-card-flush">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Клиент</th>
                  <th className="num">Поръчки</th>
                  <th className="num">Похарчено</th>
                  <th>Последна</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.email}>
                    <td>
                      <div>{c.name || "—"}</div>
                      <div className="admin-sub">{c.email}</div>
                    </td>
                    <td className="num">{c.orders}</td>
                    <td className="num">{money(c.totalSpent)}</td>
                    <td>{new Date(c.lastOrder).toLocaleDateString("bg-BG")}</td>
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
