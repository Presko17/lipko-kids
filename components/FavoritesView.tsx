"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { primaryImage, defaultVariantLabel } from "@/lib/types";
import { useWishlist, useAccount } from "@/lib/wishlist";
import { useCart } from "@/lib/cart";
import { price } from "@/lib/money";
import ProductCard from "./ProductCard";
import { Icon } from "./admin/icons";

// The visitor's saved products, newest first, rendered from the live catalogue.
export default function FavoritesView({ products }: { products: Product[] }) {
  const { ids, ready } = useWishlist();
  const { user } = useAccount();
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const byId = new Map(products.map((p) => [p.id, p]));
  const saved = ids.map((id) => byId.get(id)).filter((p): p is Product => !!p);
  const available = saved.filter((p) => p.stock > 0);
  const sum = available.reduce((a, p) => a + p.price, 0);

  const addAll = () => {
    available.forEach((p) =>
      add({
        id: p.id,
        name: p.name,
        price: p.price,
        emoji: p.emoji,
        image: primaryImage(p),
        category: p.category,
        material: p.material,
        age: p.age,
        variant: defaultVariantLabel(p.variants),
      })
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  // Wait for the saved list to load from the browser before deciding it's empty.
  if (!ready) return <div className="fav-loading" aria-busy="true" />;

  if (saved.length === 0) {
    return (
      <section className="fav-empty">
        <span className="fav-empty-mark">
          <Icon name="heart" size={34} />
        </span>
        <h1>Все още нямате любими</h1>
        <p>
          Натиснете сърцето на играчка, която ви харесва — ще я пазим тук, за да я намерите лесно
          по‑късно.
        </p>
        <Link href="/shop/all" className="btn btn-primary">
          Разгледай играчките <Icon name="arrow" size={18} />
        </Link>
        {!user && (
          <p className="fav-empty-signin">
            Имате профил? <Link href="/account?next=/favorites">Влезте</Link>, за да видите запазените си играчки.
          </p>
        )}
      </section>
    );
  }

  return (
    <>
      <div className="cat-head fav-head">
        <div>
          <h1>
            Любими <span className="fav-head-count">{saved.length}</span>
          </h1>
          <p className="lede">
            {saved.length === 1 ? "Една запазена играчка." : `${saved.length} запазени играчки.`}{" "}
            {user ? "Пазим ги в профила ви." : "Пазим ги в този браузър."}
          </p>
        </div>
        {available.length > 0 && (
          <button type="button" className={`btn btn-primary fav-addall${added ? " added" : ""}`} onClick={addAll}>
            <Icon name={added ? "check" : "bag"} size={18} />
            {added
              ? "Добавени в количката"
              : `Добави ${available.length === saved.length ? "всички" : `наличните (${available.length})`} · ${price(sum)}`}
          </button>
        )}
      </div>
      {!user && (
        <Link href="/account?next=/favorites" className="fav-signin">
          <span className="acct-ico t-sage">
            <Icon name="user" size={17} />
          </span>
          <span>
            <b>Влезте или създайте профил</b>
            <small>и любимите ви ще се пазят на телефона и компютъра.</small>
          </span>
          <Icon name="chevron" size={16} />
        </Link>
      )}
      <div className="grid">
        {saved.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </>
  );
}
