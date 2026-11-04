import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "./prisma";

// Customer accounts: email + password, scrypt-hashed. The session is a signed,
// httpOnly cookie "<accountId>.<expiry>.<hmac>". The HMAC also covers a slice of
// the password hash, so changing the password signs out every other device.

export const ACCOUNT_COOKIE = "lipko_account";
const MAX_AGE = 60 * 60 * 24 * 60; // 60 days

export type AccountUser = { id: string; email: string; name: string | null };

function secret(): string {
  return (
    process.env.ACCOUNT_SESSION_SECRET ||
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "lipko-dev-secret"
  );
}

const sign = (payload: string) =>
  crypto.createHmac("sha256", secret()).update(`account-v1|${payload}`).digest("hex");

/* ---------- passwords ---------- */

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const a = Buffer.from(hash, "hex");
  const b = crypto.scryptSync(password, salt, 64);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/* ---------- validation ---------- */

export const normEmail = (e: unknown) => String(e ?? "").trim().toLowerCase();
export const isEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 200;
export const PASSWORD_MIN = 8;

/* ---------- session ---------- */

export async function startSession(account: { id: string; passwordHash: string }) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const token = `${account.id}.${exp}.${sign(`${account.id}|${exp}|${account.passwordHash.slice(-16)}`)}`;
  const jar = await cookies();
  jar.set(ACCOUNT_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession() {
  const jar = await cookies();
  jar.delete(ACCOUNT_COOKIE);
}

// The signed-in customer, or null. Verifies signature, expiry and that the
// account (and its password) is unchanged.
export async function currentAccount(): Promise<AccountUser | null> {
  const jar = await cookies();
  const raw = jar.get(ACCOUNT_COOKIE)?.value;
  if (!raw) return null;
  const [id, expStr, mac] = raw.split(".");
  const exp = Number(expStr);
  if (!id || !mac || !exp || exp < Date.now() / 1000) return null;

  const acc = await prisma.account.findUnique({ where: { id } });
  if (!acc) return null;
  const expected = sign(`${id}|${exp}|${acc.passwordHash.slice(-16)}`);
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return { id: acc.id, email: acc.email, name: acc.name };
}

/* ---------- favourites ---------- */

export async function favoriteIds(accountId: string): Promise<string[]> {
  const rows = await prisma.favorite.findMany({
    where: { accountId },
    orderBy: { createdAt: "desc" },
    select: { productId: true },
  });
  return rows.map((r) => r.productId);
}

// Adds ids saved in the browser before signing in (keeps existing ones).
export async function mergeFavorites(accountId: string, ids: unknown): Promise<void> {
  if (!Array.isArray(ids)) return;
  const clean = [...new Set(ids.filter((x): x is string => typeof x === "string" && x.length <= 200))].slice(0, 200);
  if (!clean.length) return;
  await prisma.favorite.createMany({
    data: clean.map((productId) => ({ accountId, productId })),
    skipDuplicates: true,
  });
}
