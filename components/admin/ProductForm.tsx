import Link from "next/link";
import type { Product } from "@/lib/types";
import { CATEGORIES, TAGS } from "@/lib/types";
import { bgnToEur } from "@/lib/money";
import { saveProductAction, deleteProductAction } from "@/app/admin/actions";
import PriceEuroInput from "./PriceEuroInput";

// Server component that renders the create/edit form. Submits to server actions.
export default function ProductForm({ product }: { product?: Product }) {
  const p = product;
  return (
    <div className="admin-page">
      <header className="admin-head">
        <div>
          <Link href="/admin/products" className="admin-back">
            ← Продукти
          </Link>
          <h1>{p ? "Редактиране на продукт" : "Нов продукт"}</h1>
        </div>
      </header>

      {!p && (
        <div className="admin-info">
          След създаване на продукта ще можете да добавите снимки и видео.
        </div>
      )}

      <div className="admin-card">
        <form action={saveProductAction} className="admin-form admin-form-grid">
          {p && <input type="hidden" name="id" value={p.id} />}

          <label className="col-2">
            <span>Име</span>
            <input name="name" defaultValue={p?.name || ""} required />
          </label>

          <PriceEuroInput defaultEuro={p ? bgnToEur(p.price) : ""} />
          <PriceEuroInput
            name="cost"
            label="Покупна цена (€)"
            note="за печалба/марж"
            required={false}
            defaultEuro={p?.cost != null ? bgnToEur(p.cost) : ""}
          />
          <PriceEuroInput
            name="oldPrice"
            label="Стара цена (€)"
            note="зачертана при промоция"
            required={false}
            defaultEuro={p?.oldPrice != null ? bgnToEur(p.oldPrice) : ""}
          />

          <label>
            <span>Наличност (бр.)</span>
            <input name="stock" type="number" defaultValue={p?.stock ?? 0} required />
          </label>

          <label>
            <span>Категория</span>
            <select name="category" defaultValue={p?.category || CATEGORIES[0]}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Етикет</span>
            <select name="tag" defaultValue={p?.tag || ""}>
              <option value="">Без</option>
              {TAGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Материал</span>
            <input name="material" defaultValue={p?.material || ""} />
          </label>
          <label>
            <span>Възраст</span>
            <input name="age" defaultValue={p?.age || ""} placeholder="напр. 3-6" />
          </label>

          <label>
            <span>Емоджи (изображение-заместител)</span>
            <input name="emoji" defaultValue={p?.emoji || "🧸"} maxLength={4} />
          </label>
          <label>
            <span>Съдържание и размер</span>
            <input name="dim" defaultValue={p?.dim || ""} />
          </label>

          <label>
            <span>Рейтинг</span>
            <input name="rating" type="number" step="0.1" min="0" max="5" defaultValue={p?.rating ?? 4.8} />
          </label>
          <label>
            <span>Брой отзиви</span>
            <input name="reviews" type="number" defaultValue={p?.reviews ?? 0} />
          </label>

          <label>
            <span>
              Популярност <span className="admin-note">(ръчно, при липса на отзиви)</span>
            </span>
            <input
              name="popularity"
              type="number"
              min="0"
              defaultValue={p?.popularity ?? 0}
              placeholder="0"
            />
          </label>

          <label className="col-2">
            <span>Описание</span>
            <textarea name="desc" rows={4} defaultValue={p?.desc || ""} />
          </label>

          <label className="col-2">
            <span>
              Линк към доставчика
              {p?.supplierUrl && (
                <>
                  {" "}
                  <a href={p.supplierUrl} target="_blank" rel="noopener noreferrer" className="admin-ext-link">
                    (отвори ↗)
                  </a>
                </>
              )}
            </span>
            <input
              name="supplierUrl"
              type="url"
              defaultValue={p?.supplierUrl || ""}
              placeholder="https://www.faire.com/product/..."
            />
          </label>

          <label className="col-2 admin-check">
            <input type="checkbox" name="active" defaultChecked={p ? p.active : true} />
            <span>Активен (видим в магазина)</span>
          </label>

          <label className="col-2 admin-check">
            <input type="checkbox" name="promo" defaultChecked={p ? p.promo : false} />
            <span>На промоция (показва се на началната страница вместо в категориите)</span>
          </label>

          <div className="col-2 admin-form-actions">
            <button className="btn btn-primary" type="submit">
              {p ? "Запази промените" : "Създай продукт"}
            </button>
            <Link href="/admin/products" className="admin-cancel">
              Отказ
            </Link>
          </div>
        </form>
      </div>

      {p && (
        <div className="admin-card admin-danger">
          <div>
            <h2>Изтриване</h2>
            <p>Премахва продукта завинаги. Това действие е необратимо.</p>
          </div>
          <form action={deleteProductAction}>
            <input type="hidden" name="id" value={p.id} />
            <button className="btn admin-btn-danger" type="submit">
              Изтрий продукта
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
