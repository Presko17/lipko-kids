import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Плащането е отменено" };

export default function CancelPage() {
  return (
    <main className="wrap">
      <div className="cart-empty">
        <h1>Плащането е отменено</h1>
        <p>Не е направено плащане. Количката ви е запазена, когато сте готови.</p>
        <Link href="/cart">
          <button className="btn btn-primary">Обратно към количката</button>
        </Link>
      </div>
    </main>
  );
}
