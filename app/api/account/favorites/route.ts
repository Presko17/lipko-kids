import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentAccount } from "@/lib/account";

export const runtime = "nodejs";

// Add or remove one favourite for the signed-in customer.
export async function POST(req: NextRequest) {
  const user = await currentAccount();
  if (!user) return NextResponse.json({ error: "Не сте влезли в профила си." }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const productId = typeof body.productId === "string" ? body.productId.slice(0, 200) : "";
  if (!productId) return NextResponse.json({ error: "Липсва продукт." }, { status: 400 });

  if (body.on) {
    await prisma.favorite.upsert({
      where: { accountId_productId: { accountId: user.id, productId } },
      create: { accountId: user.id, productId },
      update: {},
    });
  } else {
    await prisma.favorite.deleteMany({ where: { accountId: user.id, productId } });
  }
  return NextResponse.json({ ok: true });
}
