import { redirect } from "next/navigation";
import { getCurrentAppUser } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // proxy.ts already gates /admin at the middleware layer using Clerk's
  // session claims; this re-checks against our own `users` table before
  // rendering anything, per this project's defense-in-depth pattern for
  // admin routes (see lib/auth.ts). A layout redirect (rather than
  // throwing, as requireAdmin does for server actions) keeps a
  // non-admin's experience a plain redirect instead of an error page.
  const user = await getCurrentAppUser();
  if (!user || user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="grid lg:grid-cols-[220px_1fr] gap-8">
        <aside>
          <p className="font-[family-name:var(--font-display)] text-sm font-bold uppercase tracking-wide text-[var(--color-muted)] px-3 mb-2">
            Admin
          </p>
          <AdminSidebar />
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
