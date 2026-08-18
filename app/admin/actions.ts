"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { updateOrder } from "@/lib/orders";
import { saveSettings, getCategoryImage, setCategoryImage, setPopularity } from "@/lib/settings";
import { eurToBgn } from "@/lib/money";
import { extractFromUrl, type ExtractedProduct } from "@/lib/import";
import { saveFile, deleteFile } from "@/lib/storage";

// Saves an uploaded file to storage (Vercel Blob in prod, /public/uploads locally).
async function saveUpload(id: string, file: File, fallbackExt = "bin"): Promise<string> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const ext =
    (file.name.split(".").pop() || fallbackExt).toLowerCase().replace(/[^a-z0-9]/g, "") ||
    fallbackExt;
  return saveFile(id, bytes, ext, file.type || undefined);
}

async function removeUploadFile(pathname: string | null) {
  await deleteFile(pathname);
}

async function getImages(id: string): Promise<string[]> {
  const p = await prisma.product.findUnique({ where: { id } });
  try {
    const arr = JSON.parse(p?.images || "[]");
    return Array.isArray(arr) ? arr.filter((x: unknown) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

async function setImages(id: string, images: string[]) {
  await prisma.product.update({
    where: { id },
    data: { images: images.length ? JSON.stringify(images) : null },
  });
}

function revalidateProduct(id: string) {
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath(`/product/${id}`);
}

function slugify(input: string): string {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ж: "zh", з: "z", и: "i", й: "y",
    к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
    ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sht", ъ: "a", ь: "y", ю: "yu", я: "ya",
  };
  const base = input
    .toLowerCase()
    .split("")
    .map((c) => map[c] ?? c)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return (base || "product") + "-" + Math.random().toString(36).slice(2, 7);
}

function num(v: FormDataEntryValue | null, fallback = 0): number {
  const n = Number(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : fallback;
}

// Optional € amount → лв, or null when the field was left blank.
function optionalEurToBgn(v: FormDataEntryValue | null): number | null {
  const s = String(v ?? "").trim();
  return s === "" ? null : eurToBgn(num(v));
}

// ---- Orders ----
export async function updateOrderAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  const tracking = String(formData.get("tracking") || "").trim() || null;
  await updateOrder(id, { status, tracking });
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}

// ---- Products ----
export async function saveProductAction(formData: FormData) {
  await requireAdmin();
  const existingId = String(formData.get("id") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const id = existingId || slugify(name);

  const data = {
    name,
    price: eurToBgn(num(formData.get("price"))), // entered in €, stored in лв
    oldPrice: optionalEurToBgn(formData.get("oldPrice")), // struck-through sale price (nullable)
    cost: optionalEurToBgn(formData.get("cost")), // purchase price, € → лв (nullable)
    stock: Math.round(num(formData.get("stock"))),
    category: String(formData.get("category") || "Монтесори"),
    material: String(formData.get("material") || "").trim(),
    age: String(formData.get("age") || "").trim(),
    emoji: String(formData.get("emoji") || "🧸").trim() || "🧸",
    tag: (String(formData.get("tag") || "") || null) as string | null,
    dim: String(formData.get("dim") || "").trim(),
    desc: String(formData.get("desc") || "").trim(),
    rating: num(formData.get("rating"), 4.8),
    reviews: Math.round(num(formData.get("reviews"))),
    active: formData.get("active") === "on",
    promo: formData.get("promo") === "on",
    supplierUrl: String(formData.get("supplierUrl") || "").trim() || null,
  };

  // Manual popularity is kept in the Setting store, not on the product row.
  const popularity = Math.max(0, Math.round(num(formData.get("popularity"))));

  // Images and video are managed separately (after the product exists).
  if (existingId) {
    await prisma.product.update({ where: { id: existingId }, data });
    await setPopularity(existingId, popularity);
    revalidateProduct(existingId);
    redirect("/admin/products");
  } else {
    await prisma.product.create({ data: { id, ...data } });
    await setPopularity(id, popularity);
    revalidatePath("/admin/products");
    revalidatePath("/");
    // Send new products straight to their editor so images/video can be added.
    redirect(`/admin/products/${id}`);
  }
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const images = await getImages(id);
  const prod = await prisma.product.findUnique({ where: { id } });
  await prisma.product.delete({ where: { id } });
  await Promise.all([...images.map(removeUploadFile), removeUploadFile(prod?.video ?? null)]);
  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products");
}

// ---- Product media (images gallery + video) ----
export async function addProductImagesAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const files = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) return;
  const saved = await Promise.all(files.map((f) => saveUpload(id, f, "jpg")));
  const images = await getImages(id);
  await setImages(id, [...images, ...saved]);
  revalidateProduct(id);
}

export async function removeProductImageAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const target = String(formData.get("path"));
  const images = await getImages(id);
  await setImages(id, images.filter((s) => s !== target));
  await removeUploadFile(target);
  revalidateProduct(id);
}

export async function setPrimaryImageAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const target = String(formData.get("path"));
  const images = await getImages(id);
  if (!images.includes(target)) return;
  await setImages(id, [target, ...images.filter((s) => s !== target)]);
  revalidateProduct(id);
}

export async function setProductVideoAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const url = String(formData.get("videoUrl") || "").trim();
  const file = formData.get("videoFile");
  let video: string | null = null;
  if (file instanceof File && file.size > 0) {
    video = await saveUpload(id, file, "mp4");
  } else if (url) {
    video = url;
  }
  if (!video) return;
  const prev = await prisma.product.findUnique({ where: { id } });
  await removeUploadFile(prev?.video ?? null);
  await prisma.product.update({ where: { id }, data: { video } });
  revalidateProduct(id);
}

export async function removeProductVideoAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const prev = await prisma.product.findUnique({ where: { id } });
  await removeUploadFile(prev?.video ?? null);
  await prisma.product.update({ where: { id }, data: { video: null } });
  revalidateProduct(id);
}

// ---- Supplier import ----

// Downloads a remote image into /public/uploads. Returns the public path, or
// null on failure (so one bad image can't abort the whole import).
async function downloadImageToUploads(id: string, url: string): Promise<string | null> {
  try {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 15000);
    const res = await fetch(url, { signal: ctrl.signal, redirect: "follow" }).finally(() =>
      clearTimeout(timeout),
    );
    if (!res.ok) return null;
    const type = (res.headers.get("content-type") || "").toLowerCase();
    // Accept a real image type, or (for CDNs that mislabel) an image-looking URL.
    const urlLooksImage = /\.(jpe?g|png|webp|avif|gif)(\?|$)/i.test(url);
    if (!type.startsWith("image/") && !urlLooksImage) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 512 || buf.length > 12 * 1024 * 1024) return null; // skip empty/tiny / >12MB
    const extFromType = type.startsWith("image/") ? type.split("/")[1]?.split(";")[0] : "";
    const extFromUrl = url.split("?")[0].split(".").pop();
    const ext = (extFromType || extFromUrl || "jpg")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .replace("jpeg", "jpg") || "jpg";
    return saveFile(id, buf, ext, type.startsWith("image/") ? type : undefined);
  } catch {
    return null;
  }
}

// Called from the import UI: fetch a supplier URL, extract + translate.
export async function extractSupplier(url: string): Promise<ExtractedProduct> {
  await requireAdmin();
  const clean = url.trim();
  if (!/^https?:\/\//i.test(clean)) {
    throw new Error("Въведи пълен линк, започващ с http:// или https://");
  }
  return extractFromUrl(clean);
}

// Creates a draft (hidden) product from the reviewed import data and downloads
// its images, then sends the admin to the editor to finish it.
export async function importCreateProductAction(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") || "").trim();
  if (!name) redirect("/admin/import");
  const id = slugify(name);

  await prisma.product.create({
    data: {
      id,
      name,
      price: eurToBgn(num(formData.get("price"))), // entered in €, stored in лв
      cost: optionalEurToBgn(formData.get("cost")), // purchase price, € → лв (nullable)
      stock: Math.round(num(formData.get("stock"))),
      category: String(formData.get("category") || "Монтесори"),
      material: String(formData.get("material") || "").trim(),
      age: String(formData.get("age") || "").trim(),
      emoji: String(formData.get("emoji") || "🧸").trim() || "🧸",
      tag: (String(formData.get("tag") || "") || null) as string | null,
      dim: String(formData.get("dim") || "").trim(),
      desc: String(formData.get("desc") || "").trim(),
      rating: num(formData.get("rating"), 4.8),
      reviews: Math.round(num(formData.get("reviews"))),
      active: false, // import as a hidden draft — admin reviews, then publishes
    },
  });

  // Download the selected supplier images (order preserved; first = primary).
  const urls = formData.getAll("imageUrl").map(String).filter(Boolean).slice(0, 12);
  const saved: string[] = [];
  for (const u of urls) {
    const p = await downloadImageToUploads(id, u);
    if (p) saved.push(p);
  }
  if (saved.length) await setImages(id, saved);

  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect(`/admin/products/${id}`);
}

// ---- Category images ----
function revalidateCategoryImage() {
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  revalidatePath("/");
}

export async function setCategoryImageAction(formData: FormData) {
  await requireAdmin();
  const category = String(formData.get("category") || "").trim();
  const file = formData.get("image");
  if (!category || !(file instanceof File) || file.size === 0) return;
  const prev = await getCategoryImage(category);
  const path = await saveUpload("cat", file, "jpg");
  await setCategoryImage(category, path);
  await removeUploadFile(prev);
  revalidateCategoryImage();
}

export async function removeCategoryImageAction(formData: FormData) {
  await requireAdmin();
  const category = String(formData.get("category") || "").trim();
  if (!category) return;
  const prev = await getCategoryImage(category);
  await setCategoryImage(category, null);
  await removeUploadFile(prev);
  revalidateCategoryImage();
}

// ---- Settings ----
export async function saveSettingsAction(formData: FormData) {
  await requireAdmin();
  await saveSettings({
    storeName: String(formData.get("storeName") || "Липко"),
    freeShippingThreshold: num(formData.get("freeShippingThreshold"), 75),
    shippingRate: num(formData.get("shippingRate"), 6.95),
  });
  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
}
