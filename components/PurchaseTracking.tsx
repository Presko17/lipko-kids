"use client";

import { useEffect } from "react";
import { fbTrack } from "./MetaPixel";

// Fires the Meta Purchase event once on the success page. The value is stashed
// in sessionStorage when the shopper starts checkout, so it's reliable even if
// the order webhook hasn't landed yet.
export default function PurchaseTracking() {
  useEffect(() => {
    let value: number | undefined;
    try {
      const v = sessionStorage.getItem("lipko-purchase-value");
      if (v) {
        value = parseFloat(v);
        sessionStorage.removeItem("lipko-purchase-value");
      }
    } catch {
      /* ignore */
    }
    fbTrack("Purchase", value != null && Number.isFinite(value) ? { value, currency: "EUR" } : { currency: "EUR" });
  }, []);
  return null;
}
