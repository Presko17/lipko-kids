import Link from "next/link";
import type { Metadata } from "next";
import { getOrders } from "@/lib/orders";
import { getAllProducts } from "@/lib/products";
import { money } from "@/lib/money";
import { Icon } from "@/components/admin/icons";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Табло — Липко админ" };

const TZ = "Europe/Sofia";
const ymd = (d: Date) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
const ym = (d: Date) => ymd(d).slice(0, 7);
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export default async function DashboardPage() {
  const [orders, products] = await Promise.all([getOrders(), getAllProducts()]);
  const paid = orders.filter((o) => o.paymentStatus === "paid");
  const now = new Date();

  // ---- revenue ----
  const revenue = paid.reduce((s, o) => s + o.amountTotal, 0);
  const thisMonth = ym(now);
  const prev = new Date(now);
  prev.setUTCDate(1);
  prev.setUTCMonth(prev.getUTCMonth() - 1);
  const prevMonth = ym(prev);
  const monthRevenue = paid.filter((o) => ym(new Date(o.createdAt)) === thisMonth).reduce((s, o) => s + o.amountTotal, 0);
  const prevRevenue = paid.filter((o) => ym(new Date(o.createdAt)) === prevMonth).reduce((s, o) => s + o.amountTotal, 0);
  const change = prevRevenue > 0 ? ((monthRevenue - prevRevenue) / prevRevenue) * 100 : null;
  const avg = paid.length ? revenue / paid.length : 0;

  // Last 14 days of revenue, oldest → today (Sofia time).
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(now.getTime() - (13 - i) * 86_400_000);
    const key = ymd(d);
    const v = paid.filter((o) => ymd(new Date(o.createdAt)) === key).reduce((s, o) => s + o.amountTotal, 0);
    return { key, v, label: new Intl.DateTimeFormat("bg-BG", { timeZone: TZ, day: "numeric", month: "short" }).format(d) };
  });
  const maxDay = Math.max(...days.map((d) => d.v), 0);

  // ---- profit & margin (only items whose product has a purchase price) ----
  const costById = new Map<string, number | null>(products.map((p) => [p.id, p.cost]));
  let covered = 0;
  let cogs = 0;
  let missingCost = false;
  for (const o of paid) {
    for (const it of o.items) {
      const c = it.productId ? costById.get(it.productId) : undefined;
      if (c == null) {
        missingCost = true;
        continue;
      }
      covered += it.amount;
      cogs += c * it.quantity;
    }
  }
  const profit = covered - cogs;
  const margin = covered > 0 ? (profit / covered) * 100 : 0;

  // ---- operations ----
  const toShip = orders.filter((o) => o.status === "Обработва се").length;
  const active = products.filter((p) => p.active).length;
  const drafts = products.length - active;
  const lowStock = products
    .filter((p) => p.active && p.stock <= 5)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 6);

  // Best sellers by quantity.
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
  const topMax = topSellers[0]?.qty || 1;

  // ---- greeting ----
  const hour = Number(new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "numeric", hour12: false }).format(now));
  const greeting = hour < 11 ? "Добро утро" : hour < 18 ? "Добър ден" : "Добър вечер";
  const dateLabel = new Intl.DateTimeFormat("bg-BG", { timeZone: TZ, weekday: "long", day: "numeric", month: "long" }).format(now);

  const statusClass = (s: string) =>
    s === "Обработва се" ? "warn" : s === "Изпратена" || s === "Доставена" ? "ok" : "";

  return (
    <div className="admin-page dash">
      <header className="admin-head">
        <div>
          <h1>Табло</h1>
        </div>
        <div className="admin-head-actions">
          <Link href="/admin/import" className="btn btn-ghost">
            Импорт
          </Link>
          <Link href="/admin/products/new" className="btn btn-primary">
            <Icon name="plus" size={16} /> Нов продукт
          </Link>
        </div>
      </header>

      {/* Greeting + this month */}
      <section className="dash-top">
        <div className="acard dash-hello">
          <div className="dash-eyebrow">{dateLabel}</div>
          <h2 className="dash-greet">{greeting}!</h2>
          <p className="dash-summary">
            {toShip > 0 ? (
              <b className="warn">{plural(toShip, "поръчка чака", "поръчки чакат")} изпращане</b>
            ) : (
              <>Няма поръчки, които чакат изпращане</>
            )}
            {lowStock.length > 0 ? (
              <>
                , <b>{plural(lowStock.length, "продукт е", "продукта са")}</b> с ниска наличност
              </>
            ) : (
              <>, наличностите са наред</>
            )}{" "}
            и <b>{plural(active, "играчка е активна", "играчки са активни")}</b> в магазина
            {drafts > 0 && <> ({plural(drafts, "чернова", "чернови")} чакат публикуване)</>}.
          </p>
          <div className="dash-hello-actions">
            <Link href="/admin/orders" className="apill-btn dark">
              <Icon name="truck" size={15} /> Поръчки
            </Link>
            <Link href="/admin/products" className="apill-btn">
              <Icon name="box" size={15} /> Продукти
            </Link>
          </div>
        </div>

        <div className="acard dash-cash">
          <div className="acard-head">
            <span className="aico">
              <Icon name="wallet" size={17} />
            </span>
            <h2>Оборот този месец</h2>
          </div>
          <div className="dash-cash-row">
            <span className="dash-big">{money(monthRevenue)}</span>
            {change != null ? (
              <span className={`achip ${change >= 0 ? "ok" : "warn"}`}>
                {change >= 0 ? "+" : ""}
                {change.toFixed(0)}% спрямо мин. месец
              </span>
            ) : (
              <span className="achip">първи месец</span>
            )}
          </div>
          <div className="dash-bars" role="img" aria-label="Оборот за последните 14 дни">
            {days.map((d) => (
              <span
                key={d.key}
                className={d.v > 0 ? "on" : ""}
                style={{ height: maxDay > 0 && d.v > 0 ? `${Math.max(10, (d.v / maxDay) * 100)}%` : undefined }}
                title={`${d.label}: ${money(d.v)}`}
              />
            ))}
          </div>
          <div className="dash-bars-legend">
            <span>{days[0].label}</span>
            <span>последните 14 дни</span>
            <span>днес</span>
          </div>
        </div>
      </section>

      {/* Key numbers */}
      <section className="dash-stats" aria-label="Основни показатели">
        <div className="dstat feat">
          <div className="dstat-top">
            <span className="aico">
              <Icon name="trend" size={16} />
            </span>
            Оборот (общо)
          </div>
          <div className="dstat-value">{money(revenue)}</div>
          <span className="achip">{plural(paid.length, "поръчка", "поръчки")}</span>
        </div>
        <div className="dstat blue">
          <div className="dstat-top">
            <span className="aico">
              <Icon name="percent" size={16} />
            </span>
            Печалба
          </div>
          <div className="dstat-value">{money(profit)}</div>
          <span className="achip" title={missingCost ? "Продукти без покупна цена не се броят" : undefined}>
            марж {margin.toFixed(1)}%{missingCost ? " *" : ""}
          </span>
        </div>
        <div className="dstat">
          <div className="dstat-top">
            <span className="aico">
              <Icon name="receipt" size={16} />
            </span>
            Средна поръчка
          </div>
          <div className="dstat-value">{money(avg)}</div>
          <span className="achip">на поръчка</span>
        </div>
        <div className="dstat">
          <div className="dstat-top">
            <span className="aico">
              <Icon name="truck" size={16} />
            </span>
            За изпращане
          </div>
          <div className="dstat-value">{toShip}</div>
          <span className={`achip ${toShip > 0 ? "warn" : "ok"}`}>
            {toShip > 0 ? "чакат обработка" : "всичко е изпратено"}
          </span>
        </div>
      </section>

      {/* Orders + attention */}
      <section className="dash-bottom">
        <div className="acard">
          <div className="acard-head">
            <span className="aico">
              <Icon name="receipt" size={17} />
            </span>
            <h2>Последни поръчки</h2>
            <Link href="/admin/orders" className="apill-btn sm">
              Всички <Icon name="chevron" size={14} />
            </Link>
          </div>
          {orders.length === 0 ? (
            <div className="dash-empty">
              Все още няма поръчки — първата ще се появи тук веднага след плащане.
            </div>
          ) : (
            <ul className="arows">
              {orders.slice(0, 6).map((o) => {
                const who = o.name || o.email || "Клиент";
                return (
                  <li className="arow" key={o.id}>
                    <span className="arow-tile">{who.trim().charAt(0).toUpperCase()}</span>
                    <span className="arow-main">
                      <Link href={`/admin/orders/${o.id}`}>{who}</Link>
                      <span className="arow-sub">
                        {new Date(o.createdAt).toLocaleDateString("bg-BG", { timeZone: TZ })} ·{" "}
                        {plural(o.items.reduce((n, it) => n + it.quantity, 0), "артикул", "артикула")}
                      </span>
                    </span>
                    <span className={`achip ${statusClass(o.status)}`}>{o.status}</span>
                    <span className="arow-amt">{money(o.amountTotal)}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="acard">
          <div className="acard-head">
            <span className="aico">
              <Icon name="alert" size={17} />
            </span>
            <h2>Ниска наличност</h2>
            {lowStock.length > 0 && <span className="achip warn">{lowStock.length}</span>}
          </div>
          {lowStock.length === 0 ? (
            <div className="dash-empty">Всички активни продукти са с наличност над 5 бр.</div>
          ) : (
            <ul className="arows">
              {lowStock.map((p) => (
                <li className="arow" key={p.id}>
                  <span className="arow-tile">
                    {p.images[0] ? <img src={p.images[0]} alt="" /> : p.emoji}
                  </span>
                  <span className="arow-main">
                    <Link href={`/admin/products/${p.id}`}>{p.name}</Link>
                    <span className="arow-sub">{p.stock === 0 ? "изчерпан" : `остават ${p.stock} бр.`}</span>
                  </span>
                  <Link href={`/admin/products/${p.id}`} className="apill-btn sm">
                    Зареди
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {topSellers.length > 0 && (
            <>
              <div className="acard-head dash-sub-head">
                <span className="aico">
                  <Icon name="chart" size={17} />
                </span>
                <h2>Най-продавани</h2>
              </div>
              <ul className="arows">
                {topSellers.map((t) => (
                  <li className="arow" key={t.name}>
                    <span className="arow-main">
                      <span className="arow-title">{t.name}</span>
                      <span className="arow-bar">
                        <i style={{ width: `${(t.qty / topMax) * 100}%` }} />
                      </span>
                    </span>
                    <span className="arow-sub">{t.qty} бр.</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
