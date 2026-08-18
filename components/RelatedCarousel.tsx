"use client";

import { useRef } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { tintOf, primaryImage } from "@/lib/types";
import { price } from "@/lib/money";

// Horizontal, scrollable "you may also like" carousel with prev/next arrows.
export default function RelatedCarousel({ products }: { products: Product[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.85), behavior: "smooth" });
  };

  return (
    <section className="related">
      <div className="related-head">
        <h2>Може да харесате и</h2>
        <div className="rel-arrows">
          <button type="button" className="rel-arrow" aria-label="Предишни" onClick={() => scroll(-1)}>
            ‹
          </button>
          <button type="button" className="rel-arrow" aria-label="Следващи" onClick={() => scroll(1)}>
            ›
          </button>
        </div>
      </div>

      <div className="rel-track" ref={trackRef}>
        {products.map((r) => (
          <Link className={`rcard ${tintOf(r.id)}`} href={`/product/${r.id}`} key={r.id}>
            <span className="rpanel">
              {primaryImage(r) ? (
                <img className="pimg" src={primaryImage(r)!} alt={r.name} />
              ) : (
                r.emoji
              )}
            </span>
            <div className="rinfo">
              <span className="rname">{r.name}</span>
              <span className="rprice">{price(r.price)}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
