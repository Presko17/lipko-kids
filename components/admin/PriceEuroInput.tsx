"use client";

import { useState } from "react";
import { BGN_PER_EUR } from "@/lib/money";

// Money entered in € (admin) but STORED/charged in лв, with a live "≈ X лв"
// preview. Used for both the selling price and the purchase (cost) price.
export default function PriceEuroInput({
  defaultEuro,
  name = "price",
  label = "Цена (€)",
  note = "клиентът вижда и двете",
  required = true,
}: {
  defaultEuro?: number | string;
  name?: string;
  label?: string;
  note?: string;
  required?: boolean;
}) {
  const [v, setV] = useState(defaultEuro === undefined ? "" : String(defaultEuro));
  const e = parseFloat(v.replace(",", "."));
  const lv = Number.isFinite(e) ? (e * BGN_PER_EUR).toFixed(2).replace(".", ",") : null;

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
        {lv ? `≈ ${lv} лв${note ? " — " + note : ""}` : " "}
      </small>
    </label>
  );
}
