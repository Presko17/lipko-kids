// Exports the whole SQLite dataset to prisma/data-export.json so it can be
// imported into Postgres after the provider switch. Safe, read-only.
import { PrismaClient } from "@prisma/client";
import { promises as fs } from "fs";
import path from "path";

const prisma = new PrismaClient();

const data = {
  exportedAt: new Date().toISOString(),
  products: await prisma.product.findMany(),
  settings: await prisma.setting.findMany(),
  orders: await prisma.order.findMany({ include: { items: true } }),
};

const out = path.join(process.cwd(), "prisma", "data-export.json");
await fs.writeFile(out, JSON.stringify(data, null, 2));
console.log(
  `Exported → ${out}\n  products: ${data.products.length}\n  settings: ${data.settings.length}\n  orders:   ${data.orders.length}`
);
await prisma.$disconnect();
