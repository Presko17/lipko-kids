import { promises as fs } from "fs";

// Point Prisma at the Postgres URL from .env.local (Prisma runtime otherwise
// loads .env = SQLite). Set BEFORE importing the client.
const raw = await fs.readFile(".env.local", "utf8");
const m = raw.match(/^DATABASE_URL="?([^"\n]+)"?/m);
if (!m) {
  console.error("DATABASE_URL липсва в .env.local");
  process.exit(1);
}
process.env.DATABASE_URL = m[1];

const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();

const data = JSON.parse(await fs.readFile("prisma/data-export.json", "utf8"));

let prod = 0;
for (const p of data.products) {
  const { createdAt, updatedAt, ...rest } = p; // eslint-disable-line no-unused-vars
  await prisma.product.upsert({
    where: { id: p.id },
    update: { ...rest },
    create: { ...rest, createdAt: new Date(createdAt) },
  });
  prod++;
}

let set = 0;
for (const s of data.settings) {
  await prisma.setting.upsert({
    where: { key: s.key },
    update: { value: s.value },
    create: { key: s.key, value: s.value },
  });
  set++;
}

const counts = {
  products: await prisma.product.count(),
  active: await prisma.product.count({ where: { active: true } }),
  settings: await prisma.setting.count(),
};
console.log(`Импортирани: ${prod} продукта, ${set} настройки`);
console.log(`В Postgres сега: ${counts.products} продукта (${counts.active} активни), ${counts.settings} настройки`);
await prisma.$disconnect();
