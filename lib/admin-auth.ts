import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";

// Simple but real admin auth: a password check that sets a signed, httpOnly
// session cookie. The cookie value is an HMAC, so it can't be forged without
// the secret, and the password itself is never stored in the cookie.
//
// Set ADMIN_PASSWORD (and ideally ADMIN_SESSION_SECRET) in .env.local.

export const ADMIN_COOKIE = "toybox_admin";

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "toybox-dev-secret";
}

export function sessionToken(): string {
  return crypto.createHmac("sha256", secret()).update("admin-session-v1").digest("hex");
}

export function checkPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function isAuthed(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(ADMIN_COOKIE)?.value === sessionToken();
}

// Use at the top of protected admin server components.
export async function requireAdmin(): Promise<void> {
  if (!(await isAuthed())) redirect("/admin/login");
}
