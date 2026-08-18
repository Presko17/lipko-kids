import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Често задавани въпроси",
  description:
    "Отговори на често задавани въпроси за доставка, връщане, плащане и безопасност на играчките в Липко.",
};

// Едит тук: реалните ти условия за доставка/връщане/контакт.
const FAQ = [
  {
    q: "Колко струва доставката и кога ще получа поръчката си?",
    a: "Доставяме до 2–3 работни дни в цялата страна. Доставката е безплатна за поръчки над 75 лв, а под този праг се калкулира стандартна такса на финалната стъпка при поръчка.",
  },
  {
    q: "Мога ли да върна или заменя играчка?",
    a: "Да. Разполагаш с 30 дни за връщане на неизползван продукт в оригиналната опаковка. Пиши ни на " + SITE.email + " и ще уредим връщането или замяната бързо и без излишни въпроси.",
  },
  {
    q: "Безопасни ли са играчките за деца?",
    a: "Всички играчки отговарят на европейските стандарти за безопасност (EN71). Дървените играчки са с нетоксични бои на водна основа. За всеки продукт е посочена препоръчителна възраст — следвай я за безопасна игра.",
  },
  {
    q: "Как мога да платя?",
    a: "Плащането е онлайн с дебитна или кредитна карта чрез защитен доставчик. Цените се показват в лева и в евро, а таксуването е в лева (BGN).",
  },
  {
    q: "Как да проследя поръчката си?",
    a: "След поръчка получаваш имейл с потвърждение. Можеш да провериш статуса по всяко време от страницата „Проследи поръчка“ с номера на поръчката и имейла си.",
  },
];

export default function FaqPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main className="section">
      <div className="wrap" style={{ maxWidth: 800 }}>
        <nav className="crumbs">
          <Link href="/">Начало</Link>
          <span>/</span>
          <span className="here">Въпроси и отговори</span>
        </nav>
        <div className="cat-head">
          <div>
            <h1>Често задавани въпроси</h1>
            <p className="lede">Всичко важно за доставка, връщане, плащане и безопасност.</p>
          </div>
        </div>

        <div className="faq-list">
          {FAQ.map((f, i) => (
            <details className="faq-item" key={i} open={i === 0}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>

        <p className="faq-contact">
          Не намери отговор? Пиши ни на{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a> — отговаряме до 24 часа в работни дни.
        </p>
      </div>
      <JsonLd data={schema} />
    </main>
  );
}
