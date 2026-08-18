import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct } from "@/lib/products";
import ProductForm from "@/components/admin/ProductForm";
import ProductMedia from "@/components/admin/ProductMedia";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Продукт — Липко админ" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();
  return (
    <>
      <ProductForm product={product} />
      <div className="admin-page" style={{ paddingTop: 0 }}>
        <ProductMedia product={product} />
      </div>
    </>
  );
}
