// Shared types + pure helpers. Safe to import from both server and client code
// (no database access here).

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
  supplierUrl: string | null; // линк към продукта при доставчика
  createdAt: string; // ISO дата на добавяне (за сортиране „Най-нови“)
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
};

export const CATEGORIES = [
  "Образователни",
  "Монтесори",
  "STEM",
  "Пъзели",
  "Музикални",
  "Ролеви игри",
  "Катерушки и меки игри",
  "Каталки и возила",
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
