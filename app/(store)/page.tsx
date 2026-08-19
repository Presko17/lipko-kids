import Link from "next/link";
import Shop from "@/components/Shop";
import Newsletter from "@/components/Newsletter";
import QuickBuy from "@/components/QuickBuy";
import { getPromoProducts, getCatalogProducts } from "@/lib/products";
import { sortProducts } from "@/lib/types";

// Live storefront data (promos + popular products) — render on demand so the
// build never needs the database.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Hero highlights the most-searched (popular) products for quick buying.
  const [promos, catalog] = await Promise.all([getPromoProducts(), getCatalogProducts()]);
  const popular = sortProducts(catalog, "popular").slice(0, 4);

  return (
    <main>
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <h1>
              Игра, която <em>учи.</em>
            </h1>
            <p className="sub">
              От дървени кубчета и Монтесори игри до наука, роботика и география — играчки, които
              развиват истински умения, докато децата се забавляват.
            </p>
            <p className="microtrust">
              <b>Подходящи за Монтесори и STEM</b> · Нетоксично масивно дърво · Възраст 1–8
            </p>
            <div className="hero-cta">
              <Link href="/shop" className="btn btn-primary">
                Разгледай магазина
              </Link>
              <Link href="/shop/all" className="btn">
                Всички играчки
              </Link>
            </div>
          </div>

          {popular.length > 0 && (
            <aside className="hero-pop" aria-label="Най-търсени играчки">
              <div className="hero-pop-head">Най-търсени</div>
              <QuickBuy products={popular} />
              <Link href="/shop/all" className="hero-pop-all">
                Разгледай всички играчки →
              </Link>
            </aside>
          )}
        </div>
      </section>

      <Shop
        products={promos}
        title="Промоции"
        lede="Избрани оферти — само тук, докато траят."
        showCategories={false}
        variant="row"
        footerHref="/shop"
        footerText="Разгледай всички играчки →"
        emptyText="Скоро тук ще има избрани оферти. Разгледай всички играчки в магазина."
      />

      <section className="wrap craft" id="craft">
        <div className="craft-inner">
          <h2>
            Ние мислим за <em>вашите деца.</em>
          </h2>
          <div className="pillars">
            <div className="pillar">
              <span className="mk" />
              <div>
                <b>Масивно дърво, не пластмаса</b>
                <span>Бук, клен, дъб и брезов шперплат — създадени да преживеят детството.</span>
              </div>
            </div>
            <div className="pillar">
              <span className="mk" />
              <div>
                <b>Създадени да учат</b>
                <span>Разработени с педагози за ранно детство и Монтесори специалисти.</span>
              </div>
            </div>
            <div className="pillar">
              <span className="mk" />
              <div>
                <b>Грижа за планетата</b>
                <span>FSC дървесина, бои на водна основа, рециклирана опаковка.</span>
              </div>
            </div>
            <div className="pillar">
              <span className="mk" />
              <div>
                <b>Гаранция десет години</b>
                <span>Ремонт или замяна в продължение на десет години, без излишни въпроси.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Newsletter />
    </main>
  );
}
