import Link from "next/link";
import { SITE } from "@/lib/site";
import { CATEGORIES, categoryToSlug } from "@/lib/types";
import { eurAmount } from "@/lib/money";
import LeafMark from "@/components/LeafMark";
import { Icon } from "@/components/admin/icons";

export default function Footer({ freeOver }: { freeOver: number }) {
  const topCats = CATEGORIES.slice(0, 4);
  return (
    <footer>
      <div className="wrap">
        <div className="foot-promise">
          <Icon name="truck" size={16} /> Доставка до 1 седмица · безплатна над {eurAmount(freeOver)} € · лесно връщане до 30 дни
        </div>
        <div className="foot-grid">
          <div>
            <Link href="/" className="logo">
              <span className="logo-tile">
                <LeafMark />
              </span>
              <span className="logo-text">Липко</span>
            </Link>
            <p style={{ color: "var(--muted)", maxWidth: "34ch", marginTop: 14, fontSize: 14 }}>
              Образователни играчки, които учат децата на нещо истинско — букви, числа, логика и
              фина моторика — чрез игра.
            </p>
          </div>
          <div>
            <h4>Магазин</h4>
            <Link href="/shop">Всички категории</Link>
            <Link href="/shop/all">Всички играчки</Link>
            {topCats.map((c) => (
              <Link key={c} href={`/category/${categoryToSlug(c)}`}>
                {c}
              </Link>
            ))}
          </div>
          <div>
            <h4>Помощ</h4>
            <Link href="/faq">Въпроси и отговори</Link>
            <Link href="/orders">Проследи поръчка</Link>
            <Link href="/faq">Доставка и връщане</Link>
            <a href={`mailto:${SITE.email}`}>Контакти</a>
          </div>
          <div>
            <h4>За нас</h4>
            <Link href="/#craft">Нашата мисия</Link>
            <Link href="/privacy">Поверителност</Link>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 Липко</span>
          <span>
            <Link href="/privacy">Поверителност</Link> ·{" "}
            <Link href="/faq">Въпроси</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
