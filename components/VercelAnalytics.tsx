"use client";

import { Analytics } from "@vercel/analytics/next";

// Vercel Web Analytics — cookieless, anonymous visitor/page counts, so it runs
// for every visitor (no consent needed). Admin pages are left out so the
// shop owner's own visits don't skew the numbers. Enable it in Vercel →
// project → Analytics.
export default function VercelAnalytics() {
  return (
    <Analytics
      beforeSend={(event) => (new URL(event.url).pathname.startsWith("/admin") ? null : event)}
    />
  );
}
