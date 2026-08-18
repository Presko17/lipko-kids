"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

// Google Analytics 4 — loads ONLY after the visitor accepts analytics cookies
// (see CookieBanner). Add your Measurement ID to .env as NEXT_PUBLIC_GA_ID.
export default function Analytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const check = () => setAllowed(localStorage.getItem("toybox-cookie-consent") === "all");
    check();
    window.addEventListener("cookie-consent", check);
    return () => window.removeEventListener("cookie-consent", check);
  }, []);

  if (!id || !allowed) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`}
      </Script>
    </>
  );
}
