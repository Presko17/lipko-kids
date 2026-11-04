import type { Metadata } from "next";
import Link from "next/link";
import { currentAccount } from "@/lib/account";
import { getOrdersForAccount } from "@/lib/orders";
import { getCatalogProducts } from "@/lib/products";
import { money } from "@/lib/money";
import AccountAuth from "@/components/AccountAuth";
import AccountLogout from "@/components/AccountLogout";
import AccountFavorites from "@/components/AccountFavorites";
import { Icon } from "@/components/admin/icons";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Профил", robots: { index: false, follow: false } };

const dateFmt = new Intl.DateTimeFormat("bg-BG", { day: "numeric", month: "long", year: "numeric" });

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const user = await currentAccount().catch(() => null);

  if (!user) {
    return (
      <main className="wrap acct-page">
        <AccountAuth next={next} />
      </main>
    );
  }

  const [orders, products] = await Promise.all([getOrdersForAccount(user.id), getCatalogProducts()]);
  const first = (user.name || "").split(" ")[0];

  return (
    <main className="wrap acct-page">
      <div className="acct-head">
        <div>
          <h1>{first ? `Здравейте, ${first}` : "Вашият профил"}</h1>
          <p>{user.email}</p>
        </div>
        <AccountLogout />
      </div>

      <AccountFavorites products={products} />

      <section className="acct-card">
        <div className="acct-card-head">
          <span className="acct-ico t-sage">
            <Icon name="box" size={18} />
          </span>
          <h2>Моите поръчки</h2>
          <span className="acct-count">{orders.length}</span>
        </div>
        {orders.length === 0 ? (
          <p className="acct-empty">
            Тук ще виждате поръчките, които направите, докато сте влезли в профила си. За по-стара
            поръчка използвайте <Link href="/orders">проследяване на поръчка</Link>.
          </p>
        ) : (
          <ul className="acct-orders">
            {orders.map((o) => {
              const qty = o.items.reduce((a, i) => a + i.quantity, 0);
              return (
                <li key={o.id}>
                  <Link href={`/order/${o.id}`} className="acct-order">
                    <span className="acct-order-main">
                      <b>{dateFmt.format(new Date(o.createdAt))}</b>
                      <small>
                        {qty} {qty === 1 ? "артикул" : "артикула"} · {o.items[0]?.name}
                        {o.items.length > 1 ? ` и още ${o.items.length - 1}` : ""}
                      </small>
                    </span>
                    <span className="acct-order-side">
                      <span className={`acct-status s-${o.status === "Доставена" ? "ok" : o.status === "Отменена" || o.status === "Върната" ? "off" : "on"}`}>
                        {o.status}
                      </span>
                      <b>{money(o.amountTotal)}</b>
                    </span>
                    <Icon name="chevron" size={16} />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
