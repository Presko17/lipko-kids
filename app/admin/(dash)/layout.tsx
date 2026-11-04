import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import AdminChrome from "@/components/admin/AdminChrome";
import { AdminCrumbs, AdminFade } from "@/components/admin/AdminCrumbs";

export const dynamic = "force-dynamic";

// Applies a saved light/dark choice before first paint (no flash). Without a
// saved choice the shell follows the system appearance via CSS.
const themeScript = `try{var t=localStorage.getItem('lipko-admin-theme');if(t==='dark'||t==='light')document.currentScript.parentElement.setAttribute('data-theme',t)}catch(e){}`;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  // Counts for the tab badges and the status chip.
  const [toShip, lowStock] = await Promise.all([
    prisma.order.count({ where: { status: "Обработва се" } }),
    prisma.product.count({ where: { active: true, stock: { lte: 5 } } }),
  ]);

  return (
    <div className="admin-shell" suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <AdminChrome toShip={toShip} lowStock={lowStock} />
      <main className="admin-main">
        <AdminCrumbs toShip={toShip} lowStock={lowStock} />
        <AdminFade>{children}</AdminFade>
      </main>
    </div>
  );
}
