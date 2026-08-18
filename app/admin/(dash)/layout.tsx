import { requireAdmin } from "@/lib/admin-auth";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="admin-shell">
      <AdminNav />
      <div className="admin-main">{children}</div>
    </div>
  );
}
