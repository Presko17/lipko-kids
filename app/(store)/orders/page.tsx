import Link from "next/link";
import type { Metadata } from "next";
import { getOrderForCustomer } from "@/lib/orders";
import OrderDetail from "@/components/OrderDetail";
import OrderLookupForm from "@/components/OrderLookupForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Проследи поръчката си" };

// Guest order lookup. Requires BOTH the order number and the matching email —
// the order number alone is unguessable, and the email confirms ownership.
// (Full order history needs customer accounts / auth — a future step.)
export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; email?: string }>;
}) {
  const { id, email } = await searchParams;
  const searched = Boolean(id && email);
  const order = searched ? await getOrderForCustomer(id!, email!) : null;

  return (
    <main className="wrap order-page">
      <h1 className="order-title">Проследи поръчката си</h1>
      <p className="order-lede">
        Въведете номера на поръчката от имейла за потвърждение, заедно с имейла, който използвахте
        при плащане.
      </p>

      <OrderLookupForm defaultId={id ?? ""} defaultEmail={email ?? ""} />

      {searched && order && (
        <div style={{ marginTop: 36 }}>
          <OrderDetail order={order} />
          <div className="order-actions">
            <Link href="/#shop">
              <button className="btn btn-primary">Продължи пазаруването</button>
            </Link>
          </div>
        </div>
      )}

      {searched && !order && (
        <p className="lookup-miss">
          Не открихме поръчка с този номер и имейл. Проверете и двете или отговорете на имейла за
          потвърждение и ще помогнем.
        </p>
      )}
    </main>
  );
}
