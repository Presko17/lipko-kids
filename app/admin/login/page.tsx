import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/admin-auth";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Вход — Липко админ" };

export default async function LoginPage() {
  if (await isAuthed()) redirect("/admin");
  return (
    <main className="admin-login">
      <div className="admin-login-card">
        <div className="admin-login-mark">
          <span className="mk-c" />
          <span className="mk-t" />
          <span className="mk-s" />
        </div>
        <h1>Липко админ</h1>
        <p>Въведете администраторската парола, за да продължите.</p>
        <LoginForm />
      </div>
    </main>
  );
}
