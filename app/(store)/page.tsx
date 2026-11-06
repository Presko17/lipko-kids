import type { Metadata } from "next";
import Link from "next/link";
import Shop from "@/components/Shop";
import Newsletter from "@/components/Newsletter";
import QuickBuy from "@/components/QuickBuy";
import { Icon } from "@/components/admin/icons";
import { getPromoProducts, getCatalogProducts, getFeaturedProducts } from "@/lib/products";
import { sortProducts } from "@/lib/types";

// Live storefront data (promos + popular products) — render on demand so the
// build never needs the database.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Липко — Образователни, Монтесори и дървени играчки онлайн" },
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  // Hero highlights the "most-searched" products for quick buying. The shop
  // owner picks these manually (the "Най-търсени" tick in the product editor);
  // if none are ticked yet, fall back to the most popular so it's never empty.
  const [promos, catalog, featured] = await Promise.all([
    getPromoProducts(),
    getCatalogProducts(),
    getFeaturedProducts(),
  ]);
  const popular = (featured.length > 0 ? featured : sortProducts(catalog, "popular")).slice(0, 4);

  return (
    <main>
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-card">
            <h1>
              Игра, която <em>учи.</em>
            </h1>
            <p className="sub">
              От дървени кубчета и Монтесори игри до наука, роботика и география — играчки, които
              развиват истински умения, докато децата се забавляват.
            </p>
            <div className="hero-cta">
              <Link href="/shop" className="btn btn-primary">
                Разгледай магазина <Icon name="arrow" size={16} />
              </Link>
              <Link href="/shop/all" className="btn">
                Всички играчки
              </Link>
            </div>
          </div>

          {popular.length > 0 && (
            <aside className="hero-pop" aria-label="Най-търсени играчки">
              <div className="hero-pop-head">
                <b>Най-търсени</b>
                <Link href="/shop/all" className="hero-pop-all">
                  Всички <Icon name="chevron" size={14} />
                </Link>
              </div>
              <QuickBuy products={popular} />
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
        <div className="craft-head">
          <h2>
            Ние мислим за <em>вашите деца.</em>
          </h2>
        </div>
        <div className="pillars">
          <div className="pillar feat">
            <b>Масивно дърво, не пластмаса</b>
            <span>Бук, клен, дъб и брезов шперплат — създадени да преживеят детството.</span>
          </div>
          <div className="pillar blue">
            <b>Създадени да учат</b>
            <span>Разработени с педагози за ранно детство и Монтесори специалисти.</span>
          </div>
          <div className="pillar">
            <b>Грижа за планетата</b>
            <span>FSC дървесина, бои на водна основа, рециклирана опаковка.</span>
          </div>
          <div className="pillar">
            <b>Гаранция една година</b>
            <span>Ремонт или замяна в рамките на една година, без излишни въпроси.</span>
          </div>
        </div>
      </section>

      <Newsletter />
    </main>
  );
}
