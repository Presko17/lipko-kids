import { prisma } from "./prisma";

export type OrderItem = { name: string; quantity: number; amount: number; productId?: string | null };

export type Order = {
  id: string;
  createdAt: string;
  email: string | null;
  name: string | null;
  amountTotal: number;
  currency: string;
  items: OrderItem[];
  shippingAddress: string | null;
  paymentStatus: string | null;
  status: string;
  tracking: string | null;
};

// Fulfillment statuses the shop moves an order through.
export const ORDER_STATUSES = ["Обработва се", "Изпратена", "Доставена", "Отменена", "Върната"];

type Row = {
  id: string;
  createdAt: Date;
  email: string | null;
  name: string | null;
  amountTotal: number;
  currency: string;
  shippingAddress: string | null;
  paymentStatus: string | null;
  status: string;
  tracking: string | null;
  items: { name: string; quantity: number; amount: number; productId: string | null }[];
};

function toOrder(row: Row): Order {
  return {
    id: row.id,
    createdAt: row.createdAt.toISOString(),
    email: row.email,
    name: row.name,
    amountTotal: row.amountTotal,
    currency: row.currency,
    shippingAddress: row.shippingAddress,
    paymentStatus: row.paymentStatus,
    status: row.status,
    tracking: row.tracking,
    items: row.items.map((i) => ({
      name: i.name,
      quantity: i.quantity,
      amount: i.amount,
      productId: i.productId,
    })),
  };
}

type SaveInput = Omit<Order, "createdAt" | "status" | "tracking"> & {
  createdAt: string;
};

// Idempotent — Stripe can deliver the same event twice.
export async function saveOrder(order: SaveInput): Promise<void> {
  const existing = await prisma.order.findUnique({ where: { id: order.id } });
  if (existing) return;

  await prisma.order.create({
    data: {
      id: order.id,
      createdAt: new Date(order.createdAt),
      email: order.email ? order.email.toLowerCase() : null,
      name: order.name,
      amountTotal: order.amountTotal,
      currency: order.currency,
      shippingAddress: order.shippingAddress,
      paymentStatus: order.paymentStatus,
      items: {
        create: order.items.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          amount: i.amount,
          productId: i.productId ?? null,
        })),
      },
    },
  });
}

export async function getOrders(): Promise<Order[]> {
  const rows = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toOrder);
}

export async function getOrder(id: string): Promise<Order | null> {
  const row = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  return row ? toOrder(row) : null;
}

export async function getOrderForCustomer(id: string, email: string): Promise<Order | null> {
  const order = await getOrder(id);
  if (!order) return null;
  if (!order.email || order.email !== email.trim().toLowerCase()) return null;
  return order;
}

export async function updateOrder(
  id: string,
  data: { status?: string; tracking?: string | null }
): Promise<void> {
  await prisma.order.update({ where: { id }, data });
}

// Customers derived from orders (no separate accounts yet).
export type Customer = {
  email: string;
  name: string | null;
  orders: number;
  totalSpent: number;
  lastOrder: string;
};

export async function getCustomers(): Promise<Customer[]> {
  const orders = await getOrders();
  const map = new Map<string, Customer>();
  for (const o of orders) {
    if (!o.email) continue;
    const c = map.get(o.email);
    if (c) {
      c.orders += 1;
      c.totalSpent += o.amountTotal;
      if (o.createdAt > c.lastOrder) c.lastOrder = o.createdAt;
      if (!c.name && o.name) c.name = o.name;
    } else {
      map.set(o.email, {
        email: o.email,
        name: o.name,
        orders: 1,
        totalSpent: o.amountTotal,
        lastOrder: o.createdAt,
      });
    }
  }
  return [...map.values()].sort((a, b) => b.totalSpent - a.totalSpent);
}
