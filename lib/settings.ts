import { prisma } from "./prisma";

// Store settings, kept as key/value rows with sensible defaults.
export type StoreSettings = {
  freeShippingThreshold: number; // лв
  shippingRate: number; // лв
  storeName: string;
};

const DEFAULTS: StoreSettings = {
  freeShippingThreshold: 75,
  shippingRate: 6.95,
  storeName: "Липко",
};

export async function getSettings(): Promise<StoreSettings> {
  const rows = await prisma.setting.findMany();
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return {
    freeShippingThreshold: map.freeShippingThreshold
      ? Number(map.freeShippingThreshold)
      : DEFAULTS.freeShippingThreshold,
    shippingRate: map.shippingRate ? Number(map.shippingRate) : DEFAULTS.shippingRate,
    storeName: map.storeName || DEFAULTS.storeName,
  };
}

// ---- Per-category images (admin-chosen thumbnails for the category chooser) ----
// Stored as Setting rows keyed "catimg:<Category name>".
const CATIMG_PREFIX = "catimg:";

export async function getCategoryImages(): Promise<Record<string, string>> {
  const rows = await prisma.setting.findMany({ where: { key: { startsWith: CATIMG_PREFIX } } });
  const out: Record<string, string> = {};
  for (const r of rows) if (r.value) out[r.key.slice(CATIMG_PREFIX.length)] = r.value;
  return out;
}

export async function getCategoryImage(category: string): Promise<string | null> {
  const row = await prisma.setting.findUnique({ where: { key: CATIMG_PREFIX + category } });
  return row?.value || null;
}

export async function setCategoryImage(category: string, path: string | null): Promise<void> {
  const key = CATIMG_PREFIX + category;
  if (path) {
    await prisma.setting.upsert({ where: { key }, update: { value: path }, create: { key, value: path } });
  } else {
    await prisma.setting.deleteMany({ where: { key } });
  }
}

// ---- Manual popularity score per product ----
// Fallback ranking the admin sets by hand when a product has no reviews yet.
// Stored as Setting rows keyed "pop:<product id>".
const POP_PREFIX = "pop:";

export async function getPopularities(): Promise<Record<string, number>> {
  const rows = await prisma.setting.findMany({ where: { key: { startsWith: POP_PREFIX } } });
  const out: Record<string, number> = {};
  for (const r of rows) {
    const n = Number(r.value);
    if (Number.isFinite(n)) out[r.key.slice(POP_PREFIX.length)] = n;
  }
  return out;
}

export async function getPopularity(id: string): Promise<number> {
  const row = await prisma.setting.findUnique({ where: { key: POP_PREFIX + id } });
  const n = row ? Number(row.value) : 0;
  return Number.isFinite(n) ? n : 0;
}

export async function setPopularity(id: string, value: number): Promise<void> {
  const key = POP_PREFIX + id;
  if (value > 0) {
    await prisma.setting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    });
  } else {
    await prisma.setting.deleteMany({ where: { key } });
  }
}

export async function saveSettings(s: StoreSettings): Promise<void> {
  const entries: [string, string][] = [
    ["freeShippingThreshold", String(s.freeShippingThreshold)],
    ["shippingRate", String(s.shippingRate)],
    ["storeName", s.storeName],
  ];
  await Promise.all(
    entries.map(([key, value]) =>
      prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } })
    )
  );
}
