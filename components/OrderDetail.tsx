import { Order } from "@/lib/orders";
import { money } from "@/lib/money";

function shortId(id: string) {
  return id.replace(/^cs_(test|live)_/, "").slice(0, 10).toUpperCase();
}

export default function OrderDetail({ order }: { order: Order }) {
  return (
    <div className="order-card">
      <div className="order-head">
        <div>
          <div className="order-num">Поръчка №{shortId(order.id)}</div>
          <div className="order-date">
            {new Date(order.createdAt).toLocaleDateString("bg-BG", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
        <span className={`ord-pill ${order.paymentStatus === "paid" ? "paid" : ""}`}>
          {order.paymentStatus === "paid" ? "Платена" : "Обработва се"}
        </span>
      </div>

      <div className="order-items">
        {order.items.map((it, i) => (
          <div className="order-line" key={i}>
            <span className="order-line-name">
              <span className="order-qty">{it.quantity}×</span> {it.name}
            </span>
            <span className="order-line-amt">{money(it.amount)}</span>
          </div>
        ))}
      </div>

      <div className="order-total">
        <span>Платена сума</span>
        <span>{money(order.amountTotal)}</span>
      </div>

      <div className="order-meta">
        {order.email && (
          <div>
            <dt>Потвърждение изпратено до</dt>
            <dd>{order.email}</dd>
          </div>
        )}
        {order.shippingAddress && (
          <div>
            <dt>Доставка до</dt>
            <dd>
              {order.name ? order.name + " · " : ""}
              {order.shippingAddress}
            </dd>
          </div>
        )}
      </div>
    </div>
  );
}
