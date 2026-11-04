import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  normEmail,
  isEmail,
  PASSWORD_MIN,
  startSession,
  mergeFavorites,
  favoriteIds,
} from "@/lib/account";

export const runtime = "nodejs";

// Create a customer account, sign in, and keep any favourites saved before.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = normEmail(body.email);
  const password = String(body.password ?? "");
  const name = String(body.name ?? "").trim().slice(0, 80) || null;

  if (!isEmail(email)) return NextResponse.json({ error: "Въведете валиден имейл." }, { status: 400 });
  if (password.length < PASSWORD_MIN)
    return NextResponse.json({ error: `Паролата трябва да е поне ${PASSWORD_MIN} символа.` }, { status: 400 });
  if (password.length > 200) return NextResponse.json({ error: "Паролата е твърде дълга." }, { status: 400 });

  if (await prisma.account.findUnique({ where: { email } }))
    return NextResponse.json({ error: "Вече има профил с този имейл. Влезте в него." }, { status: 409 });

  const account = await prisma.account.create({ data: { email, name, passwordHash: hashPassword(password) } });
  await mergeFavorites(account.id, body.favorites);
  await startSession(account);
  return NextResponse.json({
    user: { id: account.id, email: account.email, name: account.name },
    favorites: await favoriteIds(account.id),
  });
}
