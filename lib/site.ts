// Central site config used for SEO, schema, sitemap and social sharing.
// Update NEXT_PUBLIC_SITE_URL (and the values below) with your real domain/details.
export const SITE = {
  name: "Липко",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://lipko.bg").replace(/\/$/, ""),
  description:
    "Образователни, Монтесори и дървени играчки, които учат децата чрез игра — внимателно подбрани и доставени до вратата ви.",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@lipko.bg",
  locale: "bg_BG",
};

export const abs = (path = "/") => `${SITE.url}${path.startsWith("/") ? path : "/" + path}`;
