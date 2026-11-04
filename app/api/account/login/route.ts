import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normEmail, verifyPassword, startSession, mergeFavorites, favoriteIds } from "@/lib/account";

export const runtime = "nodejs";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Sign in with email + password; favourites saved in the browser are merged in.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = normEmail(body.email);
  const password = String(body.password ?? "").slice(0, 200);

  const account = email ? await prisma.account.findUnique({ where: { email } }) : null;
  if (!account || !verifyPassword(password, account.passwordHash)) {
    await wait(400); // slows down password guessing
    return NextResponse.json({ error: "Грешен имейл или парола." }, { status: 401 });
  }

  await mergeFavorites(account.id, body.favorites);
  await startSession(account);
  return NextResponse.json({
    user: { id: account.id, email: account.email, name: account.name },
    favorites: await favoriteIds(account.id),
  });
}
