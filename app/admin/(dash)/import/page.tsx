import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-auth";
import ImportForm from "@/components/admin/ImportForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Импортиране — Липко админ" };

export default async function ImportPage() {
  await requireAdmin();
  return <ImportForm />;
}
