// Seeds the catalog into the database. Idempotent: run it any time — it upserts
// the starter products. Run with:  node prisma/seed.mjs
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const PRODUCTS = [
  { id: "heirloom-blocks", name: "Дървени кубчета за строене", price: 68, emoji: "🧱", category: "Дървени", material: "Масивен бук", age: "1-4", rating: 4.9, reviews: 214, tag: "Хит", stock: 32, dim: "50 части · най-голямо кубче 6 см", desc: "Комплект от 50 гладки, едри кубчета в естествени и цветни покрития — класиката с отворен край, която расте от първите кули до цели градове от блокчета." },
  { id: "stacking-arch", name: "Дъгови арки за подреждане", price: 54, emoji: "🌈", category: "Монтесори", material: "Липово дърво", age: "1-6", rating: 4.9, reviews: 186, tag: null, stock: 18, dim: "6 арки · до 18 см ширина", desc: "Шест вложени арки, които се подреждат, балансират, търкалят и обрамчват игра с малки фигурки. Истинска Монтесори класика с отворен край, която никога не омръзва." },
  { id: "abacus", name: "Дървено сметало за броене", price: 42, emoji: "🧮", category: "Образователни", material: "Бук и стомана", age: "3-7", rating: 4.8, reviews: 143, tag: null, stock: 25, dim: "24 × 22 см", desc: "Десет реда гладки мъниста върху здрава рамка — достъпен първи инструмент за броене, групиране и ранна аритметика." },
  { id: "shape-sorter", name: "Монтесори сортер за форми", price: 38, emoji: "🔷", category: "Монтесори", material: "Масивен клен", age: "1-3", rating: 4.7, reviews: 98, tag: null, stock: 40, dim: "12 форми · куб 14 см", desc: "Тежък кленов куб с едри геометрични тела и съответстващи отвори за завъртане, пъхане и решаване на задачи." },
  { id: "heirloom-train", name: "Класически дървен влак за бутане", price: 72, emoji: "🚂", category: "Дървени", material: "Дъб и клен", age: "2-5", rating: 4.9, reviews: 176, tag: "Хит", stock: 12, dim: "3 вагона · 32 см дължина", desc: "Влак от три вагона с въртящи се колела и магнитни връзки, изработен от дъб и клен, за да преживее планините от възглавници на дивана." },
  { id: "alphabet-blocks", name: "Гравирани кубчета с азбука", price: 46, emoji: "🔤", category: "Образователни", material: "Ясеново дърво", age: "3-6", rating: 4.8, reviews: 120, tag: "Ново", stock: 27, dim: "28 кубчета · 4 см", desc: "Дълбоко гравирани букви и цифри върху масивен ясен — за строене на кули, изписване на първите имена и проследяване на форми с малки пръстчета." },
  { id: "xylophone", name: "Настроен дървен ксилофон", price: 44, emoji: "🎼", category: "Музикални", material: "Бреза и алуминий", age: "2-6", rating: 4.6, reviews: 87, tag: null, stock: 21, dim: "8 тона · 30 см", desc: "Точно настроен ксилофон с осем тона и дървена палка — истински ноти, а не шум, за първите мелодии." },
  { id: "animal-puzzle", name: "Пъзел с горски животни", price: 34, emoji: "🧩", category: "Пъзели", material: "Шперплат с мастила на водна основа", age: "2-4", rating: 4.7, reviews: 64, tag: null, stock: 8, dim: "9 части · 30 × 22 см", desc: "Пъзел с едри части с горски приятели, отпечатан с мастила на водна основа, оразмерен за малки ръчички да го хващат и подреждат." },
  { id: "number-set", name: "Комплект за броене и числа", price: 39, emoji: "🔢", category: "Образователни", material: "Каучуково дърво", age: "3-7", rating: 4.8, reviews: 102, tag: null, stock: 30, dim: "20 части", desc: "Числата от 1 до 10 със съответстващи пръчици за броене — за практическо усещане за числата, сортиране и прости пресмятания." },
  { id: "gear-lab", name: "Малкият инженер — зъбни колела", price: 58, emoji: "⚙️", category: "STEM", material: "Брезов шперплат", age: "4-8", rating: 4.7, reviews: 71, tag: "Ново", stock: 15, dim: "20 части · плот 30 см", desc: "Свързани зъбни колела върху перфорирана дъска, които се въртят заедно при завъртане на ръчката — първи, радостен урок за това как работят машините." },
  { id: "threading-beads", name: "Мъниста за нанизване", price: 28, emoji: "📿", category: "Монтесори", material: "Бук, памучен шнур", age: "2-5", rating: 4.5, reviews: 58, tag: null, stock: 44, dim: "30 мъниста + 2 връзки", desc: "Едри мъниста с различни форми и восъчен шнур — тиха, увлекателна практика за концентрация и фина моторика." },
  { id: "play-kitchen", name: "Дървена детска кухня", price: 149, emoji: "🍳", category: "Ролеви игри", material: "FSC брезов шперплат", age: "3-8", rating: 4.9, reviews: 231, tag: "Хит", stock: 6, dim: "В 90 × Ш 60 см", desc: "Свободностояща брезова кухня с въртящи се копчета, отваряща се фурна и черна дъска отзад — сърцето на години ролеви игри." },
];

for (let i = 0; i < PRODUCTS.length; i++) {
  const p = PRODUCTS[i];
  const { id, ...rest } = p;
  await prisma.product.upsert({
    where: { id },
    update: { ...rest, sortOrder: i, active: true },
    create: { id, ...rest, sortOrder: i, active: true },
  });
}
console.log(`seeded ${PRODUCTS.length} products`);
await prisma.$disconnect();
