// Shared types + pure helpers. Safe to import from both server and client code
// (no database access here).

// A variant group, e.g. { label: "Цвят", options: ["Син", "Зелен", "Оранжев"] }.
export type VariantGroup = { label: string; options: string[] };

export type Product = {
  id: string;
  name: string;
  price: number; // продажна цена в лв
  oldPrice: number | null; // стара цена в лв (зачертана при промоция)
  cost: number | null; // покупна/доставна цена в лв (за печалба/марж)
  emoji: string;
  images: string[]; // ordered; images[0] is the primary/main photo
  video: string | null; // YouTube/Vimeo url or /uploads/*.mp4
  category: string;
  material: string;
  age: string;
  rating: number;
  reviews: number;
  tag: string | null;
  dim: string;
  desc: string;
  stock: number;
  active: boolean;
  promo: boolean; // на промоция — показва се на лендинг страницата
  featured: boolean; // ръчно избран за „Най-търсени“ в хероя на началната страница
  variants: VariantGroup[]; // опции за избор (цвят/размер и др.); празен масив = без варианти
  supplierUrl: string | null; // линк към продукта при доставчика
  shipsFrom: string | null; // държава, от която се доставя, напр. "Германия"
  supplierMinimum: number | null; // минимална поръчка при доставчика, в евро
  createdAt: string; // ISO дата на добавяне (за сортиране „Най-нови“)
  updatedAt?: string; // ISO дата на последна промяна (за sitemap)
  popularity: number; // ръчна популярност (резервно подреждане при липса на отзиви)
};

// The primary (first) image, shown in grids, cart and thumbnails.
export const primaryImage = (p: { images: string[] }): string | null => p.images[0] ?? null;

// The slice of a product we snapshot into the cart on the client.
export type CartProduct = {
  id: string;
  name: string;
  price: number;
  emoji: string;
  image: string | null; // primary image
  category: string;
  material: string;
  age: string;
  variant?: string; // human label of the chosen variant, e.g. "Цвят: Син"
};

// Cart line key: same product in different variants are separate lines.
export const cartKey = (p: { id: string; variant?: string }): string =>
  p.variant ? `${p.id}##${p.variant}` : p.id;

// Split a cart key back into the base product id + variant label.
export const splitCartKey = (key: string): { id: string; variant: string } => {
  const i = key.indexOf("##");
  return i === -1 ? { id: key, variant: "" } : { id: key.slice(0, i), variant: key.slice(i + 2) };
};

// Parse the JSON stored in Product.variants into typed groups (safe on junk).
export function parseVariants(json: string | null | undefined): VariantGroup[] {
  if (!json) return [];
  try {
    const arr = JSON.parse(json);
    if (!Array.isArray(arr)) return [];
    return arr
      .map((g) => ({
        label: String(g?.label ?? "").trim(),
        options: Array.isArray(g?.options)
          ? g.options.map((o: unknown) => String(o).trim()).filter(Boolean)
          : [],
      }))
      .filter((g) => g.label && g.options.length > 0);
  } catch {
    return [];
  }
}

// Admin textarea <-> variant groups. One group per line: "Цвят: Син, Зелен".
export function variantsToText(groups: VariantGroup[]): string {
  return groups.map((g) => `${g.label}: ${g.options.join(", ")}`).join("\n");
}
export function textToVariants(text: string): VariantGroup[] {
  return text
    .split("\n")
    .map((line) => {
      const i = line.indexOf(":");
      if (i === -1) return null;
      const label = line.slice(0, i).trim();
      const options = line
        .slice(i + 1)
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean);
      return label && options.length > 0 ? { label, options } : null;
    })
    .filter((g): g is VariantGroup => g !== null);
}

// Default selection label (first option of each group), used for quick-add
// from listings where the shopper hasn't opened the product page.
export function defaultVariantLabel(groups: VariantGroup[]): string | undefined {
  if (groups.length === 0) return undefined;
  return groups.map((g) => `${g.label}: ${g.options[0]}`).join(" · ");
}

export const CATEGORIES = [
  "Образователни",
  "Монтесори",
  "STEM",
  "Пъзели",
  "Музикални",
  "Ролеви игри",
  "Катерушки и меки игри",
  "Каталки и возила",
  "Плюшени играчки",
];

export const TAGS = ["Хит", "Ново"];

// Category ⇄ URL slug. Categories are Cyrillic; pages live at /category/<slug>.
export const CATEGORY_SLUGS: Record<string, string> = {
  Образователни: "obrazovatelni",
  Монтесори: "montesori",
  STEM: "stem",
  Пъзели: "pazeli",
  Музикални: "muzikalni",
  "Ролеви игри": "rolevi-igri",
  "Катерушки и меки игри": "katerushki",
  "Каталки и возила": "katalki-vozila",
  "Плюшени играчки": "plyusheni-igrachki",
};

// Fallback icon per category, used when a category has no product photo yet.
export const CATEGORY_EMOJI: Record<string, string> = {
  Образователни: "🔤",
  Монтесори: "🌱",
  STEM: "🔬",
  Пъзели: "🧩",
  Музикални: "🎵",
  "Ролеви игри": "🎭",
  "Катерушки и меки игри": "🛝",
  "Каталки и возила": "🛴",
  "Плюшени играчки": "🧸",
};

export const categoryToSlug = (name: string): string =>
  CATEGORY_SLUGS[name] ?? encodeURIComponent(name);

export const slugToCategory = (slug: string): string | null =>
  Object.entries(CATEGORY_SLUGS).find(([, s]) => s === slug)?.[0] ?? null;

// Deterministic pastel tint from the product id, so a product keeps the same
// colour everywhere without depending on its position in a list.
export function tintOf(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return "tint-" + (h % 4);
}

// Sort options offered in the storefront (default order when key is empty).
export const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Подредба" },
  { value: "popular", label: "Популярни" },
  { value: "new", label: "Най-нови" },
  { value: "price-asc", label: "Цена: ниска → висока" },
  { value: "price-desc", label: "Цена: висока → ниска" },
  { value: "name", label: "Име: А → Я" },
];

export function sortProducts<
  T extends {
    price: number;
    name: string;
    createdAt: string;
    reviews: number;
    rating: number;
    popularity: number;
  }
>(list: T[], key?: string): T[] {
  const arr = [...list];
  switch (key) {
    case "popular":
      // Reviews rank first; manual popularity is the fallback, then rating.
      return arr.sort(
        (a, b) => b.reviews - a.reviews || b.popularity - a.popularity || b.rating - a.rating
      );
    case "new":
      return arr.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "price-asc":
      return arr.sort((a, b) => a.price - b.price);
    case "price-desc":
      return arr.sort((a, b) => b.price - a.price);
    case "name":
      return arr.sort((a, b) => a.name.localeCompare(b.name, "bg"));
    default:
      return arr;
  }
}

export function stars(rating: number): string {
  const full = Math.round(rating);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

// Text search over the catalogue: every typed word must appear somewhere in
// the product. Used by the /search page and the header's live suggestions.
const norm = (s: string) => (s ?? "").toLowerCase();
export function searchProducts(all: Product[], term: string): Product[] {
  const words = norm(term).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return all.filter((p) => {
    const hay = norm(`${p.name} ${p.category} ${p.material} ${p.age} ${p.tag ?? ""} ${p.desc}`);
    return words.every((w) => hay.includes(w));
  });
}

// Suggestion order: name starts with the query, then a word in the name does,
// then the name contains it, then matches found only in other fields.
export function rankSuggestions(matches: Product[], term: string): Product[] {
  const q = norm(term.trim());
  const score = (p: Product) => {
    const n = norm(p.name);
    if (n.startsWith(q)) return 0;
    if (n.split(/[\s\-„“"(),.]+/).some((w) => w.startsWith(q))) return 1;
    if (n.includes(q)) return 2;
    return 3;
  };
  return [...matches].sort((a, b) => score(a) - score(b));
}
