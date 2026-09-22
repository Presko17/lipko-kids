"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { bgnToEur } from "@/lib/money";

// Meta (Facebook/Instagram) Pixel — loads ONLY after the visitor accepts
// analytics cookies (see CookieBanner). Add your Pixel ID to the env as
// NEXT_PUBLIC_META_PIXEL_ID. Fires PageView on load and AddToCart centrally
// from the "added to cart" event; InitiateCheckout/Purchase are fired via
// fbTrack() from the checkout flow and the success page.

// Safe tracker usable anywhere — no-ops until the pixel is loaded.
export function fbTrack(event: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined") {
    const fbq = (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq;
    if (fbq) fbq("track", event, params || {});
  }
}

export default function MetaPixel() {
  const id = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const check = () => setAllowed(localStorage.getItem("toybox-cookie-consent") === "all");
    check();
    window.addEventListener("cookie-consent", check);
    return () => window.removeEventListener("cookie-consent", check);
  }, []);

  // Central AddToCart — every add-to-cart on the site dispatches this event.
  useEffect(() => {
    if (!allowed) return;
    const onAdd = (e: Event) => {
      const d = (e as CustomEvent<{ name?: string; price?: number; qty?: number }>).detail || {};
      const qty = d.qty || 1;
      fbTrack("AddToCart", {
        content_name: d.name,
        content_type: "product",
        value: d.price != null ? Math.round(bgnToEur(d.price) * qty * 100) / 100 : undefined,
        currency: "EUR",
      });
    };
    window.addEventListener("toybox-cart-added", onAdd);
    return () => window.removeEventListener("toybox-cart-added", onAdd);
  }, [allowed]);

  if (!id || !allowed) return null;
  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${id}');fbq('track','PageView');`}
    </Script>
  );
}
