import { NextResponse } from "next/server";
import { currentAccount, favoriteIds } from "@/lib/account";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// The signed-in customer and their saved favourites (or nulls when signed out).
export async function GET() {
  const user = await currentAccount().catch(() => null);
  if (!user) return NextResponse.json({ user: null, favorites: null });
  return NextResponse.json({ user, favorites: await favoriteIds(user.id) });
}
