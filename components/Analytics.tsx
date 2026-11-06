"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { gaEvent, gaItem, eur, GA_ID } from "@/lib/track";
import type { CartAddedDetail } from "./CartAdded";

// Google Analytics 4 — loads ONLY after the visitor accepts analytics cookies
// (see CookieBanner). Add your Measurement ID to the env as NEXT_PUBLIC_GA_ID.
// E-commerce events (view_item, add_to_cart, begin_checkout, purchase) go
// through gaEvent() in lib/track.ts; anything fired before gtag.js is ready is
// queued in window.__gaq and flushed right after config below.
export default function Analytics() {
  const id = GA_ID;
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const check = () => setAllowed(localStorage.getItem("toybox-cookie-consent") === "all");
    check();
    window.addEventListener("cookie-consent", check);
    return () => window.removeEventListener("cookie-consent", check);
  }, []);

  // Central add_to_cart — every add-to-cart on the site dispatches this event.
  useEffect(() => {
    if (!allowed) return;
    const onAdd = (e: Event) => {
      const d = (e as CustomEvent<CartAddedDetail>).detail;
      if (!d) return;
      const qty = d.qty || 1;
      gaEvent("add_to_cart", {
        currency: "EUR",
        value: Math.round(eur(d.price) * qty * 100) / 100,
        items: [gaItem({ id: d.id, name: d.name, category: d.category, variant: d.variant, price: d.price, qty })],
      });
    };
    window.addEventListener("toybox-cart-added", onAdd);
    return () => window.removeEventListener("toybox-cart-added", onAdd);
  }, [allowed]);

  if (!id || !allowed) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${id}');window.__gaReady=true;(window.__gaq||[]).forEach(function(a){gtag.apply(null,a);});window.__gaq=null;`}
      </Script>
    </>
  );
}
