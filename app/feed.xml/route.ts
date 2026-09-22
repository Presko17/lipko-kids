import { getActiveProducts } from "@/lib/products";
import { bgnToEur } from "@/lib/money";
import { SITE, abs } from "@/lib/site";

// Google Merchant Center / Meta catalog product feed (RSS 2.0 + g: namespace).
// Prices are in EUR. Served at /feed.xml — submit this URL in Merchant Center
// or as a scheduled feed in the Meta commerce/catalog manager.
export const dynamic = "force-dynamic";

const esc = (s: string) =>
  (s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export async function GET() {
  const products = await getActiveProducts();

  const items = products
    .filter((p) => p.images.length > 0) // Google requires an image
    .map((p) => {
      const onSale = p.oldPrice != null && p.oldPrice > p.price;
      const priceEur = bgnToEur(p.price).toFixed(2);
      const regularEur = onSale ? bgnToEur(p.oldPrice as number).toFixed(2) : priceEur;
      const availability = p.stock > 0 ? "in_stock" : "out_of_stock";
      const desc = (p.desc || p.name).replace(/\s+/g, " ").trim().slice(0, 4500);
      const extraImages = p.images
        .slice(1, 11)
        .map((u) => `    <g:additional_image_link>${esc(u)}</g:additional_image_link>`)
        .join("\n");

      return `  <item>
    <g:id>${esc(p.id)}</g:id>
    <g:title>${esc(p.name)}</g:title>
    <g:description>${esc(desc)}</g:description>
    <g:link>${esc(abs(`/product/${p.id}`))}</g:link>
    <g:image_link>${esc(p.images[0])}</g:image_link>
${extraImages}
    <g:availability>${availability}</g:availability>
    <g:price>${regularEur} EUR</g:price>${onSale ? `\n    <g:sale_price>${priceEur} EUR</g:sale_price>` : ""}
    <g:condition>new</g:condition>
    <g:brand>${esc(SITE.name)}</g:brand>
    <g:identifier_exists>no</g:identifier_exists>
    <g:google_product_category>Toys &amp; Games &gt; Toys</g:google_product_category>
    <g:product_type>${esc(p.category)}</g:product_type>
  </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
  <title>${esc(SITE.name)}</title>
  <link>${SITE.url}</link>
  <description>${esc(SITE.description)}</description>
${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=1800",
    },
  });
}
