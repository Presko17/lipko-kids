import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getByCategory } from "@/lib/products";
import { slugToCategory, sortProducts } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import SortSelect from "@/components/SortSelect";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = slugToCategory(slug);
  if (!category) return { title: "Категория" };
  const desc = INTROS[category] ?? `Играчки от категория „${category}“ в Липко.`;
  return {
    title: `${category} играчки`,
    description: desc,
    openGraph: { title: `${category} играчки — Липко`, description: desc },
  };
}

const INTROS: Record<string, string> = {
  "Катерушки и меки игри":
    "Катерушки, пързалки, баланс-арки и меки блокове — активна и безопасна игра на закрито.",
  Образователни: "Играчки, които учат на букви, числа и още — докато изглеждат като игра.",
  Монтесори: "Самостоятелна игра по метода Монтесори — развива фокус и фина моторика.",
  STEM: "Наука, технологии, инженерство и математика за малки откриватели.",
  Пъзели: "Редене и логика, които тренират търпение и пространствено мислене.",
  Музикални: "Първи ритми и звуци — слух, координация и много усмивки.",
  "Ролеви игри": "Въображение и социални умения чрез игра на роли.",
  "Каталки и возила": "Колички за яздене, баланс-колела и тротинетки за активна игра и координация.",
};

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const { slug } = await params;
  const { sort } = await searchParams;
  const category = slugToCategory(slug);
  if (!category) notFound();

  const products = await getByCategory(category);
  const sorted = sortProducts(products, sort);

  return (
    <main className="section">
      <div className="wrap">
        <nav className="crumbs" aria-label="Трохи">
          <Link href="/">Начало</Link>
          <span>/</span>
          <Link href="/shop">Магазин</Link>
          <span>/</span>
          <span className="here">{category}</span>
        </nav>
        <div className="cat-head">
          <div>
            <h1>{category}</h1>
            <p className="lede">{INTROS[category] ?? `Играчки от категория „${category}“.`}</p>
          </div>
          <div className="cat-tools">
            <SortSelect />
          </div>
        </div>
        {sorted.length === 0 ? (
          <p className="admin-empty">Все още няма играчки в тази категория.</p>
        ) : (
          <div className="grid">
            {sorted.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
