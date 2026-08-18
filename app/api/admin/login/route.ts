import { NextRequest, NextResponse } from "next/server";
import { checkPassword, sessionToken, ADMIN_COOKIE } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Задайте ADMIN_PASSWORD в .env.local, за да активирате входа." },
      { status: 400 }
    );
  }

  let password = "";
  try {
    password = (await req.json()).password || "";
  } catch {
    return NextResponse.json({ error: "Невалидна заявка." }, { status: 400 });
  }

  if (!checkPassword(password)) {
    return NextResponse.json({ error: "Грешна парола." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 дни
  });
  return res;
}
