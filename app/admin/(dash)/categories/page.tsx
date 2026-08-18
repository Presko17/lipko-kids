import type { Metadata } from "next";
import { CATEGORIES } from "@/lib/types";
import { getCategoryImages } from "@/lib/settings";
import { getCategoryThumbs } from "@/lib/products";
import { setCategoryImageAction, removeCategoryImageAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Категории — Липко админ" };

export default async function AdminCategoriesPage() {
  const [customImages, thumbs] = await Promise.all([getCategoryImages(), getCategoryThumbs()]);

  return (
    <div className="admin-page">
      <header className="admin-head">
        <h1>Категории</h1>
        <p>Задайте снимка за всяка категория — показва се в избора на категория в магазина.</p>
      </header>

      <div className="admin-cat-grid">
        {CATEGORIES.map((c) => {
          const custom = customImages[c];
          const shown = custom || thumbs[c] || null;
          return (
            <div className="admin-card admin-cat-item" key={c}>
              <div className="admin-cat-thumb">
                {shown ? (
                  <img src={shown} alt={c} />
                ) : (
                  <span className="admin-cat-empty">Няма снимка</span>
                )}
                {shown && !custom && <span className="admin-cat-auto">Автоматична</span>}
              </div>
              <div className="admin-cat-name">{c}</div>

              <form action={setCategoryImageAction} className="admin-cat-form">
                <input type="hidden" name="category" value={c} />
                <input type="file" name="image" accept="image/*" required />
                <button className="btn btn-primary" type="submit">
                  {custom ? "Смени снимката" : "Качи снимка"}
                </button>
              </form>

              {custom && (
                <form action={removeCategoryImageAction} className="admin-cat-remove-form">
                  <input type="hidden" name="category" value={c} />
                  <button className="admin-cat-remove" type="submit">
                    Премахни (върни автоматичната)
                  </button>
                </form>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
