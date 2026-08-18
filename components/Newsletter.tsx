"use client";

import { toast } from "./Toaster";

export default function Newsletter() {
  return (
    <section className="wrap" id="news">
      <div className="news">
        <div className="deco" />
        <div>
          <h2>10% отстъпка за първата поръчка</h2>
          <p>Абонирайте се за нови продукти, идеи за игра по възраст и насоки за подаръци.</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            (e.target as HTMLFormElement).reset();
            toast("Вече сте в списъка — 10% отстъпка пътува към вас");
          }}
        >
          <input type="email" placeholder="имейл@пример.bg" required aria-label="Имейл адрес" />
          <button className="btn btn-primary" type="submit">
            Вземи 10%
          </button>
        </form>
      </div>
    </section>
  );
}
