// Google Analytics 4 e-commerce events.
//
// GA only loads after the visitor accepts analytics cookies (see Analytics.tsx).
// Events fired before gtag.js has initialised (e.g. view_item right after a
// product page hydrates) are queued in window.__gaq and flushed by the init
// script right after `gtag('config', …)`, so nothing is lost or sent too early.
// Without consent or without NEXT_PUBLIC_GA_ID every call is a no-op.

import { bgnToEur } from "./money";

export type GaItem = {
  item_id?: string;
  item_name: string;
  item_category?: string;
  item_variant?: string;
  price?: number; // EUR
  quantity?: number;
};

type W = Window & {
  gtag?: (...a: unknown[]) => void;
  __gaReady?: boolean;
  __gaq?: unknown[][] | null;
};

// Public GA4 Measurement ID (not a secret). The env var wins if set; the
// built-in ID is only used in production builds so local dev never reports.
export const GA_ID =
  process.env.NEXT_PUBLIC_GA_ID ||
  (process.env.NODE_ENV === "production" ? "G-LRKPQ4CB2R" : "");

const CONSENT_KEY = "toybox-cookie-consent";

function consented() {
  try {
    return localStorage.getItem(CONSENT_KEY) === "all";
  } catch {
    return false;
  }
}

export function gaEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || !GA_ID) return;
  const w = window as W;
  if (w.__gaReady && w.gtag) {
    w.gtag("event", name, params);
  } else if (consented()) {
    (w.__gaq = w.__gaq || []).push(["event", name, params]);
  }
}

// Prices are stored in лв; GA gets euro, the currency the shop charges in.
export const eur = (bgn: number) => bgnToEur(bgn);

export function gaItem(p: {
  id?: string;
  name: string;
  category?: string;
  variant?: string;
  price?: number; // лв
  qty?: number;
}): GaItem {
  return {
    item_id: p.id,
    item_name: p.name,
    item_category: p.category,
    item_variant: p.variant,
    price: p.price != null ? eur(p.price) : undefined,
    quantity: p.qty ?? 1,
  };
}

// Items of the checkout are kept for the purchase event on the success page.
const PURCHASE_ITEMS = "lipko-purchase-items";

export function stashPurchaseItems(items: GaItem[]) {
  try {
    sessionStorage.setItem(PURCHASE_ITEMS, JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

export function takePurchaseItems(): GaItem[] | undefined {
  try {
    const v = sessionStorage.getItem(PURCHASE_ITEMS);
    if (!v) return undefined;
    sessionStorage.removeItem(PURCHASE_ITEMS);
    return JSON.parse(v);
  } catch {
    return undefined;
  }
}
