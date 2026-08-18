import type { Metadata } from "next";
import "./globals.css";
import { SITE, abs } from "@/lib/site";
import Analytics from "@/components/Analytics";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Липко — Образователни дървени играчки",
    template: "%s — Липко",
  },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    url: SITE.url,
    title: "Липко — Образователни дървени играчки",
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Липко — Образователни дървени играчки",
    description: SITE.description,
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M12 2.2 C14.5 5 20 8.5 19.6 14 C19.2 18.8 15 20.6 12.7 21.6 C12.45 21.1 12.2 20.4 12 19.8 C11.8 20.4 11.55 21.1 11.3 21.6 C9 20.6 4.8 18.8 4.4 14 C4 8.5 9.5 5 12 2.2 Z' fill='%237ba35a'/><path d='M12 20 L12 5' stroke='%234e7538' stroke-width='1.5' stroke-linecap='round'/></svg>",
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
  email: SITE.email,
  image: abs("/opengraph-image"),
  logo: abs("/opengraph-image"),
  areaServed: "BG",
  currenciesAccepted: "BGN, EUR",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bg">
      <body>
        {children}
        <JsonLd data={orgSchema} />
        <Analytics />
      </body>
    </html>
  );
}
