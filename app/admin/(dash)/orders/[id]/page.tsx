import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getOrder, ORDER_STATUSES } from "@/lib/orders";
import { money } from "@/lib/money";
import { updateOrderAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Поръчка — Липко админ" };

export default async function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const o = await getOrder(id);
  if (!o) notFound();

  const shortId = o.id.replace(/^cs_(test|live)_/, "").slice(0, 10).toUpperCase();

  return (
    <div className="admin-page">
      <header className="admin-head">
        <div>
          <Link href="/admin/orders" className="admin-back">
            ← Поръчки
          </Link>
          <h1>Поръчка #{shortId}</h1>
          <p>
            {new Date(o.createdAt).toLocaleString("bg-BG")} ·{" "}
            {o.paymentStatus === "paid" ? "Платена" : "Неплатена"}
          </p>
        </div>
      </header>

      <div className="admin-cols">
        <section className="admin-card">
          <div className="admin-card-head">
            <h2>Артикули</h2>
          </div>
          <table className="admin-table">
            <tbody>
              {o.items.map((it, i) => (
                <tr key={i}>
                  <td>
                    {it.productId ? (
                      <Link href={`/admin/products/${it.productId}`}>{it.name}</Link>
                    ) : (
                      it.name
                    )}
                    <div className="admin-sub">{it.quantity} бр.</div>
                  </td>
                  <td className="num">{money(it.amount)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>
                  <b>Общо платено</b>
                </td>
                <td className="num">
                  <b>{money(o.amountTotal)}</b>
                </td>
              </tr>
            </tfoot>
          </table>
        </section>

        <section className="admin-card">
          <div className="admin-card-head">
            <h2>Изпълнение</h2>
          </div>
          <form action={updateOrderAction} className="admin-form">
            <input type="hidden" name="id" value={o.id} />
            <label>
              <span>Статус</span>
              <select name="status" defaultValue={o.status}>
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Номер за проследяване</span>
              <input name="tracking" defaultValue={o.tracking || ""} placeholder="напр. BG123456789" />
            </label>
            <button className="btn btn-primary" type="submit">
              Запази
            </button>
          </form>

          <div className="admin-card-head" style={{ marginTop: 24 }}>
            <h2>Клиент</h2>
          </div>
          <dl className="admin-dl">
            <div>
              <dt>Име</dt>
              <dd>{o.name || "—"}</dd>
            </div>
            <div>
              <dt>Имейл</dt>
              <dd>{o.email || "—"}</dd>
            </div>
            <div>
              <dt>Доставка до</dt>
              <dd>{o.shippingAddress || "—"}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
