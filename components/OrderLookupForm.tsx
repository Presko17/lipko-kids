"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OrderLookupForm({
  defaultId = "",
  defaultEmail = "",
}: {
  defaultId?: string;
  defaultEmail?: string;
}) {
  const router = useRouter();
  const [id, setId] = useState(defaultId);
  const [email, setEmail] = useState(defaultEmail);

  return (
    <form
      className="lookup-form"
      onSubmit={(e) => {
        e.preventDefault();
        const params = new URLSearchParams({ id: id.trim(), email: email.trim() });
        router.push(`/orders?${params.toString()}`);
      }}
    >
      <label>
        <span>Номер на поръчка</span>
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="напр. cs_test_a1B2c3…"
          required
          aria-label="Номер на поръчка"
        />
      </label>
      <label>
        <span>Имейл</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="имейл@пример.bg"
          required
          aria-label="Имейл"
        />
      </label>
      <button className="btn btn-primary" type="submit">
        Намери поръчката ми
      </button>
    </form>
  );
}
