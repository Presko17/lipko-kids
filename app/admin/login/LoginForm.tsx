"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Грешна парола.");
      setLoading(false);
    }
  };

  return (
    <form className="admin-login-form" onSubmit={submit}>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Парола"
        aria-label="Парола"
        autoFocus
        required
      />
      {error && <div className="admin-login-error">{error}</div>}
      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? "Влизане…" : "Вход"}
      </button>
    </form>
  );
}
