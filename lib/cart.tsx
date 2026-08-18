"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { CartProduct } from "./types";

type CartItems = Record<string, { qty: number; product: CartProduct }>;
const KEY = "toybox-cart-v2";

type Totals = { subtotal: number; shipping: number; total: number; freeOver: number };

type CartContextValue = {
  items: CartItems;
  count: number;
  ready: boolean;
  add: (product: CartProduct, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  totals: () => Totals;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  children,
  freeOver = 75,
  shipRate = 6.95,
}: {
  children: ReactNode;
  freeOver?: number;
  shipRate?: number;
}) {
  const [items, setItems] = useState<CartItems>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem(KEY) || "{}"));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, ready]);

  const add = (product: CartProduct, qty = 1) =>
    setItems((prev) => ({
      ...prev,
      [product.id]: { qty: (prev[product.id]?.qty || 0) + qty, product },
    }));

  const setQty = (id: string, qty: number) =>
    setItems((prev) => {
      const next = { ...prev };
      if (qty <= 0) delete next[id];
      else if (next[id]) next[id] = { ...next[id], qty };
      return next;
    });

  const remove = (id: string) =>
    setItems((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

  const clear = () => setItems({});

  const count = Object.values(items).reduce((a, b) => a + b.qty, 0);

  const totals = (): Totals => {
    let subtotal = 0;
    for (const id in items) subtotal += items[id].product.price * items[id].qty;
    const shipping = subtotal === 0 || subtotal >= freeOver ? 0 : shipRate;
    return { subtotal, shipping, total: subtotal + shipping, freeOver };
  };

  return (
    <CartContext.Provider value={{ items, count, ready, add, setQty, remove, clear, totals }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
