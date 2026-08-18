import type { Metadata } from "next";
import ProductForm from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "Нов продукт — Липко админ" };

export default function NewProductPage() {
  return <ProductForm />;
}
