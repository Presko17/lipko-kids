// Supplier product import: fetch a supplier product page, pull out the name,
// description, price and images, and translate the text to Bulgarian with Claude.
//
// Server-only. Do not import from client components.
import Anthropic from "@anthropic-ai/sdk";

export type ExtractedProduct = {
  name: string;
  desc: string;
  price: number | null; // supplier price as printed (currency below) — a hint, not final
  currency: string | null; // e.g. "EUR", "USD"
  images: string[]; // absolute image URLs on the supplier's site
  sourceUrl: string;
  translated: boolean; // false when no ANTHROPIC_API_KEY was configured
};

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/122.0 Safari/537.36";

// Resolve a possibly-relative image URL against the page, drop tiny/spacer/svg.
function absUrl(src: string, base: string): string | null {
  try {
    const u = new URL(src, base);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.toString();
  } catch {
    return null;
  }
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .trim();
}

function stripTags(s: string): string {
  return decodeEntities(s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " "));
}

// Strip a trailing " | Site" / " – Brand" / " - Faire" suffix from a page title.
function cleanTitle(t: string): string {
  return decodeEntities(t)
    .replace(/\s*[|»–—]\s*[^|»–—]{1,40}$/, "") // pipe / en / em dash tail
    .replace(/\s*-\s*Faire\s*$/i, "")
    .trim();
}

// True when text reads like a real description, not SPA/React internals or a
// price/rating rail (Faire's DOM "description" match yielded "$RS(…) €174 …").
function looksLikeProse(t: string): boolean {
  if (!t || t.length < 40) return false;
  if (/\$RS\(|\$L\d|self\.__next|window\.|function\s*\(|=>|":\s*[[{]|[{}]\s*$/.test(t)) return false;
  const letters = (t.match(/[A-Za-zА-Яа-я]/g) || []).length;
  return /\s/.test(t) && letters / t.length > 0.55;
}

function metaContent(html: string, key: string): string | null {
  // matches <meta property|name="key" content="...">  (either attribute order)
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${key}["'][^>]*content=["']([^"']*)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${key}["']`,
      "i",
    ),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m) return decodeEntities(m[1]);
  }
  return null;
}

// Pull every og:image (there can be several).
function allOgImages(html: string, base: string): string[] {
  const out: string[] = [];
  const re =
    /<meta[^>]+(?:property|name)=["']og:image(?::secure_url)?["'][^>]*content=["']([^"']+)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const u = absUrl(decodeEntities(m[1]), base);
    if (u) out.push(u);
  }
  return out;
}

// Junk we never want as a product photo (logos, icons, payment badges, spacers…).
const IMG_REJECT =
  /sprite|placeholder|\bblank\b|1x1|pixel|spacer|loading|lazy-?load|logo|icon|favicon|flag|badge|payment|visa|master(card)?|paypal|klarna|avatar|swatch|rating|stars?[-_.]/i;

// Looks enough like a product photo to offer for review. Generous on purpose —
// the admin unticks anything wrong before importing.
function looksLikeImage(url: string): boolean {
  if (IMG_REJECT.test(url)) return false;
  const path = url.split("?")[0].toLowerCase();
  if (/\.svg$/.test(path)) return false;
  if (/\.(jpe?g|png|webp|avif)$/.test(path)) return true;
  // CDN URLs often have no extension — accept common media paths.
  return /\/(image|images|media|product|products|catalog|cdn|uploads|photo|photos|assets)\//.test(
    path,
  );
}

// Pick the largest URL from a srcset value ("a.jpg 300w, b.jpg 1200w").
function largestFromSrcset(srcset: string): string | null {
  const cands = srcset
    .split(",")
    .map((part) => {
      const [u, size] = part.trim().split(/\s+/);
      const w = size ? parseInt(size, 10) : 0;
      return { u, w: Number.isFinite(w) ? w : 0 };
    })
    .filter((c) => c.u);
  if (cands.length === 0) return null;
  cands.sort((a, b) => a.w - b.w);
  return cands[cands.length - 1].u;
}

// Harvest gallery images straight from <img>/<source> tags — this is where most
// shops keep the extra photos that never make it into og:image / JSON-LD.
function harvestImages(html: string, base: string): string[] {
  const out: string[] = [];
  const add = (raw: string | undefined | null) => {
    if (!raw) return;
    const dec = decodeEntities(raw.trim());
    if (dec.startsWith("data:")) return;
    const u = absUrl(dec, base);
    if (u && looksLikeImage(u)) out.push(u);
  };
  // <img src / data-src / data-original / data-lazy / data-image / srcset>
  const imgRe = /<img\b[^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = imgRe.exec(html))) {
    const tag = m[0];
    const attr = (name: string) =>
      tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, "i"))?.[1] ?? null;
    const srcset = attr("srcset") || attr("data-srcset");
    add(srcset ? largestFromSrcset(srcset) : null);
    add(attr("data-src"));
    add(attr("data-original"));
    add(attr("data-lazy") || attr("data-lazy-src"));
    add(attr("data-image") || attr("data-large_image") || attr("data-zoom-image"));
    add(attr("src"));
  }
  // <source srcset> inside <picture>
  const srcRe = /<source\b[^>]*srcset\s*=\s*["']([^"']+)["'][^>]*>/gi;
  while ((m = srcRe.exec(html))) add(largestFromSrcset(m[1]));
  return out;
}

// Class/id markers that identify the product's own image gallery container.
const GALLERY_MARKERS =
  /(?:class|id)\s*=\s*["'][^"']*(product[-_]?gallery|product__media|product[-_]?media|product[-_]?images?|product[-_]?photos?|product[-_]?slider|product[-_]?carousel|woocommerce-product-gallery|pdp[-_]?gallery|pdp__media|image[-_]?gallery|product-single__photos?|product__photo|gallery__viewport|main[-_]?image)[^"']*["']/i;

// Markers for OTHER sections we must never harvest (related/similar products,
// reviews, footer, nav…) — the usual source of "wrong product" images.
const SECTION_STOP =
  /(?:class|id)\s*=\s*["'][^"']*(related|similar|upsell|cross[-_]?sell|recommend|suggest|also[-_ ]?(?:like|bought|viewed)|you[-_ ]?may|recently|viewed|bought|frequently|other[-_ ]?products|more[-_ ]?products|reviews?|footer|newsletter|breadcrumb|sponsored|promo|banner)[^"']*["']/i;

// Narrow the HTML to just the product-gallery region, if we can find one — so
// harvesting doesn't pull in related/recommended product thumbnails. Returns
// null when no recognizable gallery container exists (we then trust structured
// data only, rather than risk harvesting other products off the page).
function galleryWindow(html: string): string | null {
  const m = GALLERY_MARKERS.exec(html);
  if (!m || m.index == null) return null;
  const rest = html.slice(m.index + 1);
  const stop = rest.search(SECTION_STOP);
  const end = stop === -1 ? rest.length : stop;
  return rest.slice(0, Math.min(end, 20000));
}

// (No whole-page image fallback: we only harvest a positively-identified
// gallery container, otherwise we trust structured data alone.)

// Class/id markers for the product's own description section/tab.
const DESC_MARKERS =
  /(?:class|id)\s*=\s*["'][^"']*(product[-_]?description|product__description|product[-_]?details?|product[-_]?info|tab[-_]?description|short[-_]?description|description[-_]?content|\bdescription\b|opisanie)[^"']*["']/i;

// Read the on-page product description block (not reviews/shipping boilerplate).
function domDescription(html: string): string {
  const m = DESC_MARKERS.exec(html);
  if (!m || m.index == null) return "";
  const rest = html.slice(m.index);
  const gt = rest.indexOf(">");
  if (gt === -1) return "";
  let slice = rest.slice(gt + 1, gt + 1 + 5000);
  const stop = slice.search(SECTION_STOP);
  if (stop !== -1) slice = slice.slice(0, stop);
  slice = slice.replace(/<[^>]*$/, ""); // drop a dangling opening tag at the cut
  const text = stripTags(slice)
    .replace(/^(описание|описание на продукта|description|детайли|характеристики|product\s+details?)\s*[:\-–]?\s*/i, "")
    .trim();
  return text.length >= 40 ? text.slice(0, 1500) : "";
}

type JsonLdProduct = {
  name?: string;
  description?: string;
  image?: unknown;
  offers?: unknown;
};

function collectLdProducts(node: unknown, acc: JsonLdProduct[]) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    node.forEach((n) => collectLdProducts(n, acc));
    return;
  }
  const obj = node as Record<string, unknown>;
  if (obj["@graph"]) collectLdProducts(obj["@graph"], acc);
  const type = obj["@type"];
  const isProduct =
    type === "Product" || (Array.isArray(type) && type.includes("Product"));
  if (isProduct) acc.push(obj as JsonLdProduct);
}

function ldImages(image: unknown, base: string): string[] {
  const out: string[] = [];
  const push = (v: unknown) => {
    if (typeof v === "string") {
      const u = absUrl(v, base);
      if (u) out.push(u);
    } else if (v && typeof v === "object") {
      const url = (v as Record<string, unknown>).url;
      if (typeof url === "string") {
        const u = absUrl(url, base);
        if (u) out.push(u);
      }
    }
  };
  if (Array.isArray(image)) image.forEach(push);
  else push(image);
  return out;
}

function ldPrice(offers: unknown): { price: number | null; currency: string | null } {
  const first = Array.isArray(offers) ? offers[0] : offers;
  if (first && typeof first === "object") {
    const o = first as Record<string, unknown>;
    const raw = o.price ?? o.lowPrice ?? (o.priceSpecification as Record<string, unknown> | undefined)?.price;
    const n = Number(String(raw ?? "").replace(/[^0-9.,]/g, "").replace(",", "."));
    const cur = o.priceCurrency ?? (o.priceSpecification as Record<string, unknown> | undefined)?.priceCurrency;
    return {
      price: Number.isFinite(n) && n > 0 ? n : null,
      currency: typeof cur === "string" ? cur : null,
    };
  }
  return { price: null, currency: null };
}

// Parse a fetched supplier page into a raw (untranslated) product.
function parseHtml(html: string, url: string): Omit<ExtractedProduct, "translated"> {
  let name = "";
  let desc = "";
  let price: number | null = null;
  let currency: string | null = null;
  let ldImgs: string[] = [];

  // 1) JSON-LD structured data (most reliable across shops).
  const ldBlocks = html.match(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  );
  if (ldBlocks) {
    const products: JsonLdProduct[] = [];
    for (const block of ldBlocks) {
      const json = block.replace(/^[\s\S]*?>/, "").replace(/<\/script>$/i, "").trim();
      try {
        collectLdProducts(JSON.parse(json), products);
      } catch {
        /* skip malformed JSON-LD */
      }
    }
    const p = products[0];
    if (p) {
      if (typeof p.name === "string") name = decodeEntities(p.name);
      if (typeof p.description === "string") desc = stripTags(p.description);
      ldImgs = ldImages(p.image, url);
      const pr = ldPrice(p.offers);
      price = pr.price;
      currency = pr.currency;
    }
  }

  // 2) Name fallback + strip trailing site/brand suffix ("… - Faire", "… | Shop").
  if (!name) name = metaContent(html, "og:title") || "";
  name = cleanTitle(name);

  // 3) Description: prefer the product's own on-page description block, but only
  // if it reads like real prose (guards against SPA/React internals leaking in).
  // Then JSON-LD, then og/meta (often just a generic site tagline).
  const dom = domDescription(html);
  if (looksLikeProse(dom) && dom.length > desc.length) desc = dom;
  if (!desc) desc = metaContent(html, "og:description") || metaContent(html, "description") || "";

  // 4) Images — STRUCTURED-FIRST. JSON-LD image[] + og:image are authoritatively
  // THIS product, so when they exist we trust ONLY them. DOM harvesting a
  // JS-heavy page (React/SPA) reliably pulls in other products' thumbnails and
  // icons, so we fall back to a scoped gallery harvest ONLY when structured data
  // gives nothing. Fewer-but-correct beats many-but-wrong; the admin can add
  // extra photos in the editor.
  const structured = [...new Set([...ldImgs, ...allOgImages(html, url)])];
  let images: string[];
  if (structured.length > 0) {
    images = structured;
  } else {
    const win = galleryWindow(html);
    images = win ? harvestImages(win, url) : [];
  }

  if (price == null) {
    const amt =
      metaContent(html, "product:price:amount") ||
      metaContent(html, "og:price:amount") ||
      "";
    const n = Number(amt.replace(",", "."));
    if (Number.isFinite(n) && n > 0) price = n;
  }
  if (!currency) currency = metaContent(html, "product:price:currency") || metaContent(html, "og:price:currency");

  // 3) Last-resort name from <title>.
  if (!name) {
    const t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (t) name = decodeEntities(t[1]).split(/[|–—»]/)[0].trim();
  }

  // De-dupe (preserving order → primary stays first) + cap.
  const uniqueImages = [...new Set(images)].slice(0, 12);

  return { name, desc, price, currency, images: uniqueImages, sourceUrl: url };
}

async function translate(name: string, desc: string): Promise<{ name: string; desc: string } | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  const client = new Anthropic();
  const payload = JSON.stringify({ name, desc });
  const message = await client.messages.create({
    model: "claude-opus-5",
    max_tokens: 4000,
    system:
      "Ти си преводач за онлайн магазин за детски дървени и образователни играчки. " +
      "Превеждаш имена и описания на продукти на естествен, продаващ български език. " +
      "Запазвай смисъла, но звучи като магазин, не като машинен превод. " +
      "Отговаряй САМО с валиден JSON обект с ключове \"name\" и \"desc\" — без коментари, без код блокове.",
    messages: [
      {
        role: "user",
        content:
          "Преведи това на български. Върни JSON {\"name\":\"...\",\"desc\":\"...\"}:\n" +
          payload,
      },
    ],
  });
  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
  const jsonStr = text.replace(/```json|```/g, "").trim();
  const start = jsonStr.indexOf("{");
  const end = jsonStr.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    const parsed = JSON.parse(jsonStr.slice(start, end + 1));
    return {
      name: typeof parsed.name === "string" ? parsed.name.trim() : name,
      desc: typeof parsed.desc === "string" ? parsed.desc.trim() : desc,
    };
  } catch {
    return null;
  }
}

// Fetch a supplier product URL, extract fields, and translate name+desc to Bulgarian.
export async function extractFromUrl(url: string): Promise<ExtractedProduct> {
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 15000);
  let html: string;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml" },
      signal: ctrl.signal,
      redirect: "follow",
    });
    if (!res.ok) throw new Error(`Доставчикът върна ${res.status}`);
    html = await res.text();
  } finally {
    clearTimeout(timeout);
  }

  const raw = parseHtml(html, url);
  if (!raw.name && raw.images.length === 0) {
    throw new Error(
      "Не успях да разчета продукта от тази страница. Възможно е сайтът да зарежда съдържанието с JavaScript. Опитай друг линк или въведи данните ръчно.",
    );
  }

  const t = await translate(raw.name, raw.desc);
  return {
    ...raw,
    name: t?.name || raw.name,
    desc: t?.desc || raw.desc,
    translated: t != null,
  };
}
