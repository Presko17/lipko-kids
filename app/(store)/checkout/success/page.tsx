import Link from "next/link";
import type { Metadata } from "next";
import ClearCartOnMount from "@/components/ClearCartOnMount";

export const metadata: Metadata = { title: "Благодарим" };

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  return (
    <main className="wrap">
      <ClearCartOnMount />
      <div className="cart-empty">
        <div className="cart-empty-mark">
          <span className="mk-c" />
          <span className="mk-t" />
          <span className="mk-s" />
        </div>
        <h1>Благодарим за поръчката! 🎉</h1>
        <p>
          Плащането е успешно и потвърждение пътува към пощата ви. Играчките ви се опаковат
          внимателно.
        </p>
        <div className="order-actions" style={{ justifyContent: "center" }}>
          {session_id && (
            <Link href={`/order/${session_id}`}>
              <button className="btn btn-primary">Виж поръчката си</button>
            </Link>
          )}
          <Link href="/#shop" className="cart-continue">
            Продължи пазаруването →
          </Link>
        </div>
      </div>
    </main>
  );
}
