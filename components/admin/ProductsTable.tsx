"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { price } from "@/lib/money";
import DeleteProductButton from "./DeleteProductButton";

export type ProductRow = {
  id: string;
  name: string;
  image: string | null;
  emoji: string;
  category: string;
  shipsFrom: string | null;
  supplierMinimum: number | null;
  price: number;
  stock: number;
  active: boolean;
  promo: boolean;
  featured: boolean;
};

type Key = "name" | "category" | "shipsFrom" | "supplierMinimum" | "price" | "stock" | "active" | "tags";

const COLS: { key: Key; label: string; num?: boolean }[] = [
  { key: "name", label: "Продукт" },
  { key: "category", label: "Категория" },
  { key: "shipsFrom", label: "Доставка от" },
  { key: "supplierMinimum", label: "Мин. поръчка", num: true },
  { key: "price", label: "Цена", num: true },
  { key: "stock", label: "Наличност", num: true },
  { key: "active", label: "Статус" },
  { key: "tags", label: "Етикети" },
];

// Whole euros without decimals ("100"), otherwise two ("98.39").
const eur = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2));

const collator = new Intl.Collator("bg", { sensitivity: "base", numeric: true });

// Sort value per column; empty values always go to the end.
const val = (p: ProductRow, k: Key): string | number | null => {
  switch (k) {
    case "name": return p.name;
    case "category": return p.category;
    case "shipsFrom": return p.shipsFrom || null;
    case "supplierMinimum": return p.supplierMinimum;
    case "price": return p.price;
    case "stock": return p.stock;
    case "active": return p.active ? 0 : 1; // активни първи при възходящо
    case "tags": return (p.promo ? 2 : 0) + (p.featured ? 1 : 0) || null;
  }
};

// The admin product list. Click a column heading to sort by it; click it again
// to flip between ascending and descending.
export default function ProductsTable({ products }: { products: ProductRow[] }) {
  const [sort, setSort] = useState<{ key: Key; dir: 1 | -1 } | null>(null);

  const rows = useMemo(() => {
    if (!sort) return products;
    const { key, dir } = sort;
    return [...products].sort((a, b) => {
      const x = val(a, key), y = val(b, key);
      if (x === null && y === null) return 0;
      if (x === null) return 1;
      if (y === null) return -1;
      const c = typeof x === "number" && typeof y === "number" ? x - y : collator.compare(String(x), String(y));
      return c * dir || collator.compare(a.name, b.name);
    });
  }, [products, sort]);

  const toggle = (key: Key) =>
    setSort((s) => (s?.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: 1 }));

  return (
    <table className="admin-table">
      <thead>
        <tr>
          {COLS.map((c) => {
            const on = sort?.key === c.key;
            return (
              <th
                key={c.key}
                className={c.num ? "num" : undefined}
                aria-sort={on ? (sort!.dir === 1 ? "ascending" : "descending") : "none"}
              >
                <button type="button" className={`admin-sort${on ? " on" : ""}`} onClick={() => toggle(c.key)}>
                  {c.label}
                  <span className="admin-sort-ico" aria-hidden="true">
                    {on ? (sort!.dir === 1 ? "↑" : "↓") : "↕"}
                  </span>
                </button>
              </th>
            );
          })}
          <th></th>
        </tr>
      </thead>
      <tbody>
        {rows.map((p) => (
          <tr key={p.id}>
            <td>
              <Link href={`/admin/products/${p.id}`} className="admin-prod">
                <span className="admin-thumb">{p.image ? <img src={p.image} alt="" /> : <span>{p.emoji}</span>}</span>
                {p.name}
              </Link>
            </td>
            <td>{p.category}</td>
            <td className="admin-ships">{p.shipsFrom || <span className="admin-tag-none">—</span>}</td>
            <td className="num">
              {p.supplierMinimum != null ? `${eur(p.supplierMinimum)} €` : <span className="admin-tag-none">—</span>}
            </td>
            <td className="num">{price(p.price)}</td>
            <td className="num">
              <span className={`admin-stock ${p.stock === 0 ? "out" : p.stock <= 5 ? "low" : ""}`}>{p.stock} бр.</span>
            </td>
            <td>
              <span className={`admin-pill ${p.active ? "ok" : ""}`}>{p.active ? "Активен" : "Скрит"}</span>
            </td>
            <td>
              <div className="admin-tags">
                {p.promo && <span className="admin-tag promo">Промо</span>}
                {p.featured && <span className="admin-tag featured">Търсен</span>}
                {!p.promo && !p.featured && <span className="admin-tag-none">—</span>}
              </div>
            </td>
            <td className="admin-row-actions">
              <DeleteProductButton id={p.id} name={p.name} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
