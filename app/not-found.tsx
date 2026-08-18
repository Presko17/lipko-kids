import Link from "next/link";
import type { Metadata } from "next";
import { CATEGORIES, categoryToSlug } from "@/lib/types";
import LeafMark from "@/components/LeafMark";

export const metadata: Metadata = {
  title: "Страницата не е намерена (404)",
  description: "Тази страница не съществува. Разгледайте нашите категории играчки.",
};

export default function NotFound() {
  return (
    <main className="nf">
      <div className="nf-inner">
        <Link href="/" className="logo" style={{ fontSize: 22, justifyContent: "center" }}>
          <LeafMark />
          Липко
        </Link>
        <div className="nf-code">404</div>
        <h1>Опа! Тази играчка се е изгубила.</h1>
        <p>Страницата, която търсите, не съществува или е преместена.</p>
        <div className="nf-actions">
          <Link href="/" className="btn btn-primary">
            Към началото
          </Link>
          <Link href="/shop" className="btn">
            Разгледай магазина
          </Link>
        </div>
        <div className="nf-cats">
          <span>Или избери категория:</span>
          <div className="nf-cat-list">
            {CATEGORIES.map((c) => (
              <Link key={c} href={`/category/${categoryToSlug(c)}`}>
                {c}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
