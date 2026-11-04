"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { primaryImage } from "@/lib/types";
import { useWishlist } from "@/lib/wishlist";
import { Icon } from "./admin/icons";

// Profile card: a strip of the first saved toys with a link to the full list.
export default function AccountFavorites({ products }: { products: Product[] }) {
  const { ids, ready } = useWishlist();
  const byId = new Map(products.map((p) => [p.id, p]));
  const saved = ids.map((id) => byId.get(id)).filter((p): p is Product => !!p);

  return (
    <section className="acct-card">
      <div className="acct-card-head">
        <span className="acct-ico t-clay">
          <Icon name="heart" size={18} />
        </span>
        <h2>Любими</h2>
        {ready && <span className="acct-count">{saved.length}</span>}
        <Link href="/favorites" className="acct-more">
          Всички <Icon name="chevron" size={14} />
        </Link>
      </div>
      {!ready ? null : saved.length === 0 ? (
        <p className="acct-empty">
          Още нямате любими. Натиснете сърцето на играчка, която ви харесва.
        </p>
      ) : (
        <div className="acct-favs">
          {saved.slice(0, 6).map((p) => (
            <Link key={p.id} href={`/product/${p.id}`} className="acct-fav" title={p.name}>
              {primaryImage(p) ? <img src={primaryImage(p)!} alt={p.name} /> : <span>{p.emoji}</span>}
            </Link>
          ))}
          {saved.length > 6 && (
            <Link href="/favorites" className="acct-fav acct-fav-more">
              +{saved.length - 6}
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
