"use client";

import { useState, useEffect } from "react";
import { BGN_PER_EUR } from "@/lib/money";

// Money entered in € (admin) but STORED/charged in лв, with a live "≈ X лв"
// preview. Used for both the selling price and the purchase (cost) price.
// When `profit` is set, it also shows the live profit = selling − purchase (€),
// reading the selling-price field from the form.
export default function PriceEuroInput({
  defaultEuro,
  name = "price",
  label = "Цена (€)",
  note = "клиентът вижда и двете",
  required = true,
  profit = false,
}: {
  defaultEuro?: number | string;
  name?: string;
  label?: string;
  note?: string;
  required?: boolean;
  profit?: boolean;
}) {
  const [v, setV] = useState(defaultEuro === undefined ? "" : String(defaultEuro));
  const e = parseFloat(v.replace(",", "."));
  const lv = Number.isFinite(e) ? (e * BGN_PER_EUR).toFixed(2).replace(".", ",") : null;

  // Track the selling price field so we can show profit under the cost.
  const [priceEuro, setPriceEuro] = useState<number>(NaN);
  useEffect(() => {
    if (!profit) return;
    const input = document.querySelector<HTMLInputElement>('input[name="price"]');
    if (!input) return;
    const read = () => setPriceEuro(parseFloat((input.value || "").replace(",", ".")));
    read();
    input.addEventListener("input", read);
    return () => input.removeEventListener("input", read);
  }, [profit]);

  const profitEur =
    profit && Number.isFinite(priceEuro) && Number.isFinite(e) ? priceEuro - e : null;

  return (
    <label>
      <span>{label}</span>
      <input
        name={name}
        type="number"
        step="0.01"
        min="0"
        value={v}
        onChange={(ev) => setV(ev.target.value)}
        required={required}
      />
      <small className="admin-hint">
        {lv ? `≈ ${lv} лв${note ? " — " + note : ""}` : " "}
      </small>
      {profitEur !== null && (
        <small className={`admin-profit${profitEur < 0 ? " neg" : ""}`}>
          Печалба: {profitEur.toFixed(2)} €
        </small>
      )}
    </label>
  );
}
