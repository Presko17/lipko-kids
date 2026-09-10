"use client";

import { toast } from "./Toaster";

export default function Newsletter() {
  return (
    <section className="wrap" id="news">
      <div className="news">
        <div className="deco" />
        <div>
          <h2>Специални предложения за нашите абонати</h2>
          <p>Абонирайте се за специални оферти, новите ни продукти и идеи за игра по възраст.</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            (e.target as HTMLFormElement).reset();
            toast("Вече сте в списъка — очаквайте специалните ни предложения");
          }}
        >
          <input type="email" placeholder="имейл@пример.bg" required aria-label="Имейл адрес" />
          <button className="btn btn-primary" type="submit">
            Абонирай се
          </button>
        </form>
      </div>
    </section>
  );
}
