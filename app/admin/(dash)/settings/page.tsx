import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { saveSettingsAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Настройки — Липко админ" };

export default async function AdminSettingsPage() {
  const s = await getSettings();

  return (
    <div className="admin-page">
      <header className="admin-head">
        <h1>Настройки</h1>
        <p>Основни настройки на магазина</p>
      </header>

      <div className="admin-card" style={{ maxWidth: 560 }}>
        <form action={saveSettingsAction} className="admin-form">
          <label>
            <span>Име на магазина</span>
            <input name="storeName" defaultValue={s.storeName} />
          </label>
          <label>
            <span>Праг за безплатна доставка (лв)</span>
            <input
              name="freeShippingThreshold"
              type="number"
              step="0.01"
              defaultValue={s.freeShippingThreshold}
            />
          </label>
          <label>
            <span>Цена на доставка (лв)</span>
            <input name="shippingRate" type="number" step="0.01" defaultValue={s.shippingRate} />
          </label>
          <button className="btn btn-primary" type="submit">
            Запази настройките
          </button>
        </form>
      </div>
    </div>
  );
}
