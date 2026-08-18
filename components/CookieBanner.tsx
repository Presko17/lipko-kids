"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "toybox-cookie-consent";

// GDPR cookie consent. Analytics stays off until the visitor accepts.
export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setShow(true);
  }, []);

  const decide = (value: "all" | "essential") => {
    localStorage.setItem(KEY, value);
    window.dispatchEvent(new Event("cookie-consent"));
    setShow(false);
  };

  if (!show) return null;
  return (
    <div className="cookie-banner" role="dialog" aria-label="Съгласие за бисквитки">
      <p className="cookie-text">
        Използваме бисквитки, за да работи количката и за анонимна статистика, с която подобряваме
        магазина. <Link href="/privacy">Научи повече</Link>.
      </p>
      <div className="cookie-actions">
        <button type="button" className="cookie-btn cookie-btn-ghost" onClick={() => decide("essential")}>
          Само основни
        </button>
        <button type="button" className="cookie-btn cookie-btn-primary" onClick={() => decide("all")}>
          Приемам всички
        </button>
      </div>
    </div>
  );
}
