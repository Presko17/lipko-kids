"use client";

import { useState } from "react";
import Link from "next/link";
import { CATEGORIES, TAGS } from "@/lib/types";
import { extractSupplier, importCreateProductAction } from "@/app/admin/actions";
import type { ExtractedProduct } from "@/lib/import";
import PriceEuroInput from "./PriceEuroInput";

export default function ImportForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ExtractedProduct | null>(null);

  async function extract(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setData(null);
    try {
      const res = await extractSupplier(url);
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Нещо се обърка.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-head">
        <div>
          <Link href="/admin/products" className="admin-back">
            ← Продукти
          </Link>
          <h1>Импортиране от доставчик</h1>
          <p>Постави линк към продукт — имената и описанията се превеждат на български, а снимките се свалят в магазина.</p>
        </div>
      </header>

      <div className="admin-card">
        <form onSubmit={extract} className="admin-import-bar">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://доставчик.com/продукт/..."
            required
          />
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Извличане…" : "Извлечи"}
          </button>
        </form>
        {loading && (
          <p className="admin-import-hint">Свалям страницата и превеждам… това може да отнеме няколко секунди.</p>
        )}
        {error && <p className="admin-import-error">{error}</p>}
      </div>

      {data && (
        <>
          {!data.translated && (
            <div className="admin-info">
              Преводът е пропуснат (липсва ANTHROPIC_API_KEY). Данните са на оригиналния език — редактирай ги ръчно.
            </div>
          )}
          {data.currency && data.price != null && (
            <div className="admin-info">
              Цена при доставчика: {data.price} {data.currency}. Постави своята продажна цена в € по-долу.
            </div>
          )}

          <div className="admin-card">
            <form action={importCreateProductAction} className="admin-form admin-form-grid">
              <label className="col-2">
                <span>Име</span>
                <input name="name" defaultValue={data.name} required />
              </label>

              <PriceEuroInput defaultEuro={data.price ?? ""} />
              <PriceEuroInput
                name="cost"
                label="Покупна цена (€)"
                note="за печалба/марж"
                required={false}
              />
              <label>
                <span>Наличност (бр.)</span>
                <input name="stock" type="number" defaultValue={0} required />
              </label>

              <label>
                <span>Категория</span>
                <select name="category" defaultValue={CATEGORIES[0]}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Етикет</span>
                <select name="tag" defaultValue="">
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
                <input name="material" defaultValue="" placeholder="напр. Букова дървесина" />
              </label>
              <label>
                <span>Възраст</span>
                <input name="age" defaultValue="" placeholder="напр. 3-6" />
              </label>

              <label className="col-2">
                <span>Описание</span>
                <textarea name="desc" rows={5} defaultValue={data.desc} />
              </label>

              {data.images.length > 0 && (
                <div className="col-2">
                  <span className="admin-import-label">
                    Снимки за сваляне ({data.images.length}) — първата избрана става основна
                  </span>
                  <div className="admin-import-grid">
                    {data.images.map((src, i) => (
                      <label key={src} className="admin-import-pick">
                        <input type="checkbox" name="imageUrl" value={src} defaultChecked />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="" loading="lazy" />
                        {i === 0 && <span className="admin-import-primary">Основна</span>}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="col-2 admin-form-actions">
                <button className="btn btn-primary" type="submit">
                  Създай като чернова
                </button>
                <Link href="/admin/products" className="admin-cancel">
                  Отказ
                </Link>
              </div>
              <p className="col-2 admin-import-hint">
                Продуктът се създава скрит (чернова). След преглед в редактора можеш да го активираш.
              </p>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
