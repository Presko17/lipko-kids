import Link from "next/link";
import type { Metadata } from "next";
import { getOrder } from "@/lib/orders";
import OrderDetail from "@/components/OrderDetail";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Вашата поръчка" };

// Single-order view reached via the (unguessable) Stripe session id — the link
// the customer lands on after paying, and can bookmark. Because the id is a
// long random token, it acts like a magic link only the buyer has.
export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);

  return (
    <main className="wrap order-page">
      {order ? (
        <>
          <h1 className="order-title">Вашата поръчка</h1>
          <OrderDetail order={order} />
          <div className="order-actions">
            <Link href="/#shop">
              <button className="btn btn-primary">Продължи пазаруването</button>
            </Link>
            <Link href="/orders" className="cart-continue">
              Проследи друга поръчка →
            </Link>
          </div>
        </>
      ) : (
        <div className="cart-empty">
          <h1>Поръчката не е намерена</h1>
          <p>
            Ако току-що платихте, поръчката ви може още да се обработва — опреснете след момент. В
            противен случай проверете връзката или я потърсете с номер на поръчка и имейл.
          </p>
          <Link href="/orders">
            <button className="btn btn-primary">Проследи поръчката си</button>
          </Link>
        </div>
      )}
    </main>
  );
}
