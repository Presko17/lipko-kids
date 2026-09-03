import { promises as fs } from "fs";
import path from "path";

// Load env from .env.local (DATABASE_URL + BLOB_READ_WRITE_TOKEN).
const raw = await fs.readFile(".env.local", "utf8");
const get = (k) => (raw.match(new RegExp("^" + k + '="?([^"\\n]+)"?', "m")) || [])[1];
process.env.DATABASE_URL = get("DATABASE_URL");
process.env.BLOB_READ_WRITE_TOKEN = get("BLOB_READ_WRITE_TOKEN");
if (!process.env.DATABASE_URL || !process.env.BLOB_READ_WRITE_TOKEN) {
  console.error("Липсва DATABASE_URL или BLOB_READ_WRITE_TOKEN в .env.local");
  process.exit(1);
}

const { PrismaClient } = await import("@prisma/client");
const { put } = await import("@vercel/blob");
const prisma = new PrismaClient();

const CT = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif" };

async function toBlob(ref) {
  if (!ref || !ref.startsWith("/uploads/")) return ref; // already a URL or nothing
  const abs = path.join(process.cwd(), "public", ref);
  let bytes;
  try {
    bytes = await fs.readFile(abs);
  } catch {
    console.log("  ⚠ липсва файл:", ref);
    return null;
  }
  const name = ref.replace("/uploads/", "");
  const ext = (name.split(".").pop() || "jpg").toLowerCase();
  const { url } = await put(`uploads/${name}`, bytes, {
    access: "public",
    addRandomSuffix: false,
    contentType: CT[ext] || "application/octet-stream",
  });
  return url;
}

const products = await prisma.product.findMany({ select: { id: true, images: true, video: true } });
let prods = 0,
  imgs = 0;
for (const p of products) {
  let arr = [];
  try {
    arr = p.images ? JSON.parse(p.images) : [];
  } catch {}
  const needsImg = arr.some((s) => s.startsWith("/uploads/"));
  const needsVid = p.video && p.video.startsWith("/uploads/");
  if (!needsImg && !needsVid) continue;

  const next = [];
  for (const im of arr) {
    if (im.startsWith("http")) {
      next.push(im);
      continue;
    }
    const url = await toBlob(im);
    if (url) {
      next.push(url);
      imgs++;
    }
  }
  let video = p.video;
  if (needsVid) {
    const v = await toBlob(p.video);
    if (v) video = v;
  }
  await prisma.product.update({
    where: { id: p.id },
    data: { images: next.length ? JSON.stringify(next) : null, video },
  });
  prods++;
}

// Category images stored in settings (catimg:<category>)
const cats = await prisma.setting.findMany({ where: { key: { startsWith: "catimg:" } } });
let catN = 0;
for (const s of cats) {
  if (s.value && s.value.startsWith("/uploads/")) {
    const u = await toBlob(s.value);
    if (u) {
      await prisma.setting.update({ where: { key: s.key }, data: { value: u } });
      catN++;
    }
  }
}

console.log(`\n✅ Готово. Продукти обновени: ${prods}, снимки в Blob: ${imgs}, категорийни снимки: ${catN}`);
const still = await prisma.product.findMany({ select: { images: true } });
const remaining = still.filter((p) => (p.images || "").includes("/uploads/")).length;
console.log(`Продукти с още локални пътища: ${remaining}`);
await prisma.$disconnect();
