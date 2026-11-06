"use client";

import { useEffect } from "react";
import { fbTrack } from "./MetaPixel";
import { gaEvent, takePurchaseItems } from "@/lib/track";

// Fires the Meta Purchase and GA4 purchase events once on the success page.
// The value and items are stashed in sessionStorage when the shopper starts
// checkout, so they're reliable even if the order webhook hasn't landed yet.
// The Stripe session id is the GA transaction_id, so a reload of the success
// page is de-duplicated by GA.
export default function PurchaseTracking({ sessionId }: { sessionId?: string }) {
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
    const hasValue = value != null && Number.isFinite(value);
    const items = takePurchaseItems();
    fbTrack("Purchase", hasValue ? { value, currency: "EUR" } : { currency: "EUR" });
    // Only report a purchase that started from this browser's checkout —
    // revisiting the page later (no stashed value) must not count again.
    if (hasValue) {
      gaEvent("purchase", {
        transaction_id: sessionId,
        currency: "EUR",
        value,
        items: items || [],
      });
    }
  }, [sessionId]);
  return null;
}
