import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct, getRelated } from "@/lib/products";
import { stars, tintOf, categoryToSlug, primaryImage } from "@/lib/types";
import { price } from "@/lib/money";
import { abs } from "@/lib/site";
import ProductActions from "@/components/ProductActions";
import ProductGallery from "@/components/ProductGallery";
import RelatedCarousel from "@/components/RelatedCarousel";
import CollapsibleDesc from "@/components/CollapsibleDesc";
import StickyBuyBar from "@/components/StickyBuyBar";
import JsonLd from "@/components/JsonLd";

export const dynamic = "force-dynamic";

function shortDesc(desc: string) {
  return desc.replace(/\s+/g, " ").trim().slice(0, 155);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const p = await getProduct(id);
  if (!p) return { title: "Продукт" };
  const desc = shortDesc(p.desc);
  const img = primaryImage(p);
  return {
    title: p.name,
    description: desc,
    alternates: { canonical: abs(`/product/${p.id}`) },
    openGraph: {
      type: "website",
      title: p.name,
      description: desc,
      url: abs(`/product/${p.id}`),
      images: img ? [{ url: abs(img) }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await getProduct(id);
  if (!p || !p.active) notFound();

  const related = await getRelated(p);
  const catSlug = categoryToSlug(p.category);
  const hasReviews = p.reviews > 0;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: shortDesc(p.desc),
    image: (p.images.length ? p.images : []).map((i) => abs(i)),
    category: p.category,
    brand: { "@type": "Brand", name: "Липко" },
    offers: {
      "@type": "Offer",
      price: p.price.toFixed(2),
      priceCurrency: "BGN",
      availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: abs(`/product/${p.id}`),
    },
    ...(hasReviews
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: p.rating,
            reviewCount: p.reviews,
          },
        }
      : {}),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Начало", item: abs("/") },
      { "@type": "ListItem", position: 2, name: p.category, item: abs(`/category/${catSlug}`) },
      { "@type": "ListItem", position: 3, name: p.name, item: abs(`/product/${p.id}`) },
    ],
  };

  return (
    <main className="wrap" id="pdp">
      <nav className="crumbs" aria-label="Трохи">
        <Link href="/">Начало</Link>
        <span>/</span>
        <Link href={`/category/${catSlug}`}>{p.category}</Link>
        <span>/</span>
        <span className="here">{p.name}</span>
      </nav>

      <div className="pdp">
        <ProductGallery
          images={p.images}
          video={p.video}
          emoji={p.emoji}
          name={p.name}
          tintClass={tintOf(p.id)}
          badge={p.stock <= 0 ? "Изчерпан" : p.tag}
        />

        <div className="pdp-info">
          <div className="pdp-cat">{p.category}</div>
          <h1 className="pdp-name">{p.name}</h1>
          {hasReviews && (
            <div className="pdp-rating">
              <span className="rstars">{stars(p.rating)}</span> {p.rating.toFixed(1)} · {p.reviews}{" "}
              отзива
            </div>
          )}
          <div className="pdp-buy">
            <div className="pdp-price">{price(p.price)}</div>
            <ProductActions product={p} />
          </div>
          <CollapsibleDesc text={p.desc} />

          <ul className="assure">
            <li>
              <span className="mk m-circ" /> Безплатна доставка над 75 лв
            </li>
            <li>
              <span className="mk m-tri" /> Лесно връщане до 30 дни
            </li>
            <li>
              <span className="mk m-sq" /> Доставка до 2–3 работни дни
            </li>
          </ul>

          <dl className="pdp-specs">
            <div>
              <dt>Материал</dt>
              <dd>{p.material}</dd>
            </div>
            <div>
              <dt>Препоръчителна възраст</dt>
              <dd>Възраст {p.age}</dd>
            </div>
            <div>
              <dt>Съдържание и размер</dt>
              <dd>{p.dim}</dd>
            </div>
          </dl>
        </div>
      </div>

      <section className="pdp-reviews" aria-label="Отзиви">
        <h2>Отзиви</h2>
        {hasReviews ? (
          <p className="pdp-reviews-summary">
            <span className="rstars">{stars(p.rating)}</span> {p.rating.toFixed(1)} от 5 · базирано
            на {p.reviews} отзива
          </p>
        ) : (
          <p className="pdp-reviews-empty">
            Все още няма отзиви за този продукт. Купи го и бъди първият, който ще сподели мнение!
          </p>
        )}
      </section>

      {related.length > 0 && <RelatedCarousel products={related} />}

      <StickyBuyBar product={p} />
      <JsonLd data={productSchema} />
      <JsonLd data={breadcrumbSchema} />
    </main>
  );
}
