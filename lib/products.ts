import { prisma } from "./prisma";
import type { Product } from "./types";
import { getCategoryImages, getPopularities, getPopularity } from "./settings";

// Server-side catalog access. The storefront and admin both read products from
// the database through these functions.

type Row = {
  id: string; name: string; price: number; oldPrice: number | null; cost: number | null; emoji: string; images: string | null;
  video: string | null; category: string; material: string; age: string;
  rating: number; reviews: number; tag: string | null; dim: string; desc: string;
  stock: number; active: boolean; promo: boolean; supplierUrl: string | null;
  createdAt: Date;
};

function parseImages(json: string | null): string[] {
  if (!json) return [];
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function toProduct(row: Row): Product {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    oldPrice: row.oldPrice ?? null,
    cost: row.cost ?? null,
    emoji: row.emoji,
    images: parseImages(row.images),
    video: row.video,
    category: row.category,
    material: row.material,
    age: row.age,
    rating: row.rating,
    reviews: row.reviews,
    tag: row.tag,
    dim: row.dim,
    desc: row.desc,
    stock: row.stock,
    active: row.active,
    promo: row.promo,
    supplierUrl: row.supplierUrl ?? null,
    createdAt: row.createdAt.toISOString(),
    popularity: 0, // real value attached from the Setting store where needed
  };
}

// Fills each product's manual popularity from the Setting store.
async function attachPopularity(list: Product[]): Promise<Product[]> {
  const pops = await getPopularities();
  return list.map((p) => ({ ...p, popularity: pops[p.id] ?? 0 }));
}

export async function getActiveProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return rows.map(toProduct);
}

export async function getAllProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return rows.map(toProduct);
}

// Promotional products — highlighted on the landing page (also stay in the
// catalog/categories below).
export async function getPromoProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { active: true, promo: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return rows.map(toProduct);
}

// The browsable catalog = ALL active products (promo ones included — they show
// both on the landing and here with everything else).
export async function getCatalogProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return attachPopularity(rows.map(toProduct));
}

export async function getByCategory(category: string): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { active: true, category },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return attachPopularity(rows.map(toProduct));
}

// Number of active products per category (includes promo products).
export async function getCategoryCounts(): Promise<Record<string, number>> {
  const rows = await prisma.product.groupBy({
    by: ["category"],
    where: { active: true },
    _count: { _all: true },
  });
  const out: Record<string, number> = {};
  for (const r of rows) out[r.category] = r._count._all;
  return out;
}

// One representative image per category (active products preferred, otherwise
// any product that has a photo) — used as thumbnails in the category chooser.
export async function getCategoryThumbs(): Promise<Record<string, string>> {
  // Admin-chosen images win; fall back to a representative product photo.
  const out: Record<string, string> = { ...(await getCategoryImages()) };
  const rows = await prisma.product.findMany({
    where: { NOT: { images: null } },
    orderBy: [{ active: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
    select: { category: true, images: true },
  });
  for (const r of rows) {
    if (out[r.category]) continue;
    const first = parseImages(r.images)[0];
    if (first) out[r.category] = first;
  }
  return out;
}

export async function getProduct(id: string): Promise<Product | null> {
  const row = await prisma.product.findUnique({ where: { id } });
  if (!row) return null;
  return { ...toProduct(row), popularity: await getPopularity(id) };
}

export async function getRelated(p: Product): Promise<Product[]> {
  const LIMIT = 12;
  const same = await prisma.product.findMany({
    where: { active: true, category: p.category, id: { not: p.id } },
    take: LIMIT,
  });
  if (same.length >= LIMIT) return same.map(toProduct);
  const fill = await prisma.product.findMany({
    where: { active: true, id: { notIn: [p.id, ...same.map((s) => s.id)] } },
    take: LIMIT - same.length,
  });
  return [...same, ...fill].map(toProduct);
}
