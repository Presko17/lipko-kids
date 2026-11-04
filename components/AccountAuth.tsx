"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";
import { useRouter } from "next/navigation";
import { useAccount } from "@/lib/wishlist";
import { Icon } from "./admin/icons";

// Sign in / create account, side by side as two tabs on one card.
export default function AccountAuth({ next }: { next?: string }) {
  const router = useRouter();
  const { signedIn, localFavorites } = useAccount();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const saved = localFavorites().length;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const r = await fetch(`/api/account/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, favorites: localFavorites() }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) {
        setError(d.error || "Нещо се обърка. Опитайте отново.");
        return;
      }
      signedIn(d.user, d.favorites ?? []);
      router.replace(next && next.startsWith("/") ? next : "/account");
      router.refresh();
    } catch {
      setError("Няма връзка. Опитайте отново.");
    } finally {
      setBusy(false);
    }
  };

  const switchTo = (m: "login" | "register") => {
    setMode(m);
    setError("");
  };

  return (
    <section className="auth-card">
      <span className="auth-mark">
        <Icon name="user" size={26} />
      </span>
      <h1>{mode === "login" ? "Вход в профила" : "Нов профил"}</h1>
      <div className="auth-tabs" role="tablist" aria-label="Вход или регистрация">
        <button type="button" role="tab" aria-selected={mode === "login"} className={mode === "login" ? "on" : ""} onClick={() => switchTo("login")}>
          Вход
        </button>
        <button type="button" role="tab" aria-selected={mode === "register"} className={mode === "register" ? "on" : ""} onClick={() => switchTo("register")}>
          Регистрация
        </button>
      </div>

      <form className="auth-form" onSubmit={submit}>
        {mode === "register" && (
          <label>
            <span>Име (по желание)</span>
            <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={80} />
          </label>
        )}
        <label>
          <span>Имейл</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            inputMode="email"
          />
        </label>
        <label>
          <span>Парола{mode === "register" ? " (поне 8 символа)" : ""}</span>
          <span className="auth-pw">
            <input
              type={showPw ? "text" : "password"}
              required
              minLength={mode === "register" ? 8 : undefined}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
            <button type="button" onClick={() => setShowPw((s) => !s)} aria-label={showPw ? "Скрий паролата" : "Покажи паролата"}>
              {showPw ? "Скрий" : "Покажи"}
            </button>
          </span>
        </label>

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="btn btn-primary auth-submit" disabled={busy}>
          {busy ? "Момент…" : mode === "login" ? "Влез" : "Създай профил"}
        </button>
      </form>

      {saved > 0 && (
        <p className="auth-note">
          <Icon name="heart" size={15} /> {saved === 1 ? "1 любима играчка" : `${saved} любими играчки`} от този браузър
          ще се запазят в профила ви.
        </p>
      )}
      {mode === "login" && (
        <p className="auth-foot">
          Забравена парола? Пишете ни от имейла на профила на{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a> и ще ви помогнем.
        </p>
      )}
    </section>
  );
}
