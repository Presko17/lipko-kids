import Link from "next/link";
import type { Metadata } from "next";
import { getOrders } from "@/lib/orders";
import { getAllProducts } from "@/lib/products";
import { money } from "@/lib/money";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Табло — Липко админ" };

export default async function DashboardPage() {
  const [orders, products] = await Promise.all([getOrders(), getAllProducts()]);

  const revenue = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((s, o) => s + o.amountTotal, 0);
  const now = new Date();
  const monthRevenue = orders
    .filter((o) => {
      const d = new Date(o.createdAt);
      return (
        o.paymentStatus === "paid" &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    })
    .reduce((s, o) => s + o.amountTotal, 0);
  const avg = orders.length ? revenue / orders.length : 0;
  const toShip = orders.filter((o) => o.status === "Обработва се").length;
  const lowStock = products.filter((p) => p.active && p.stock <= 5);

  // Profit & margin from cost of goods sold. Uses each product's current
  // purchase price (cost, in лв) matched to sold items by productId; items
  // whose product has no cost set are excluded from the margin base so the
  // numbers aren't overstated.
  const costById = new Map<string, number | null>(products.map((p) => [p.id, p.cost]));
  let coveredRevenue = 0; // product revenue for items with a known cost
  let cogs = 0; // cost of those goods
  let missingCost = false; // some sold items have no cost set
  for (const o of orders) {
    if (o.paymentStatus !== "paid") continue;
    for (const it of o.items) {
      const c = it.productId ? costById.get(it.productId) : undefined;
      if (c == null) {
        missingCost = true;
        continue;
      }
      coveredRevenue += it.amount;
      cogs += c * it.quantity;
    }
  }
  const profit = coveredRevenue - cogs;
  const margin = coveredRevenue > 0 ? (profit / coveredRevenue) * 100 : 0;

  // Best sellers by quantity sold.
  const sold = new Map<string, { name: string; qty: number }>();
  for (const o of orders) {
    for (const it of o.items) {
      const key = it.productId || it.name;
      const cur = sold.get(key) || { name: it.name, qty: 0 };
      cur.qty += it.quantity;
      sold.set(key, cur);
    }
  }
  const topSellers = [...sold.values()].sort((a, b) => b.qty - a.qty).slice(0, 5);

  const stats = [
    { label: "Оборот (общо)", value: money(revenue), sub: `${orders.length} поръчки` },
    {
      label: "Печалба",
      value: money(profit),
      sub: missingCost ? "части без покупна цена не се броят" : "след себестойност",
    },
    { label: "Марж", value: `${margin.toFixed(1)}%`, sub: "средно по продажби" },
    { label: "Оборот този месец", value: money(monthRevenue) },
    { label: "Средна поръчка", value: money(avg) },
    { label: "За изпращане", value: String(toShip), sub: "чакат обработка" },
  ];

  return (
    <div className="admin-page">
      <header className="admin-head">
        <h1>Табло</h1>
        <p>Преглед на бизнеса</p>
      </header>

      <div className="admin-stats">
        {stats.map((s) => (
          <div className="admin-stat" key={s.label}>
            <div className="admin-stat-label">{s.label}</div>
            <div className="admin-stat-value">{s.value}</div>
            {s.sub && <div className="admin-stat-sub">{s.sub}</div>}
          </div>
        ))}
      </div>

      <div className="admin-cols">
        <section className="admin-card">
          <div className="admin-card-head">
            <h2>Последни поръчки</h2>
            <Link href="/admin/orders">Всички →</Link>
          </div>
          {orders.length === 0 ? (
            <p className="admin-empty">Все още няма поръчки.</p>
          ) : (
            <table className="admin-table">
              <tbody>
                {orders.slice(0, 6).map((o) => (
                  <tr key={o.id}>
                    <td>
                      <Link href={`/admin/orders/${o.id}`}>{o.name || o.email || "—"}</Link>
                      <div className="admin-sub">
                        {new Date(o.createdAt).toLocaleDateString("bg-BG")}
                      </div>
                    </td>
                    <td>
                      <span className="admin-pill">{o.status}</span>
                    </td>
                    <td className="num">{money(o.amountTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="admin-card">
          <div className="admin-card-head">
            <h2>Ниска наличност</h2>
            <Link href="/admin/products">Продукти →</Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="admin-empty">Всичко е налично. 👍</p>
          ) : (
            <ul className="admin-list">
              {lowStock.map((p) => (
                <li key={p.id}>
                  <Link href={`/admin/products/${p.id}`}>
                    {p.emoji} {p.name}
                  </Link>
                  <span className={`admin-stock ${p.stock === 0 ? "out" : "low"}`}>
                    {p.stock} бр.
                  </span>
                </li>
              ))}
            </ul>
          )}

          {topSellers.length > 0 && (
            <>
              <div className="admin-card-head" style={{ marginTop: 24 }}>
                <h2>Най-продавани</h2>
              </div>
              <ul className="admin-list">
                {topSellers.map((t) => (
                  <li key={t.name}>
                    <span>{t.name}</span>
                    <span className="admin-sub">{t.qty} продадени</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
