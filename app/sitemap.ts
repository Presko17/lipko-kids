import type { MetadataRoute } from "next";
import { abs } from "@/lib/site";
import { getCatalogProducts } from "@/lib/products";
import { CATEGORIES, categoryToSlug } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticPages = ["/", "/shop", "/shop/all", "/faq", "/privacy", "/orders"].map((p) => ({
    url: abs(p),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "/" ? 1 : 0.7,
  }));

  const categories = CATEGORIES.map((c) => ({
    url: abs(`/category/${categoryToSlug(c)}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  let products: MetadataRoute.Sitemap = [];
  try {
    const list = await getCatalogProducts();
    products = list.map((p) => ({
      url: abs(`/product/${p.id}`),
      lastModified: new Date(p.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    /* db unavailable at build — static entries still ship */
  }

  return [...staticPages, ...categories, ...products];
}
