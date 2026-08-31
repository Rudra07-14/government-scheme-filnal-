import type { Metadata } from "next";
import Link from "next/link";
import { ScrollText, FolderKanban, Heart, Flag } from "lucide-react";
import { getAdminStats } from "@/lib/data/admin";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  verification_required: "Verification Required",
  inactive: "Inactive",
  archived: "Archived",
};

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  const cards = [
    {
      label: "Total Schemes",
      value: stats.totalSchemes,
      icon: ScrollText,
      href: "/admin/schemes",
    },
    {
      label: "Categories",
      value: stats.totalCategories,
      icon: FolderKanban,
      href: "/admin/schemes",
    },
    {
      label: "Saved by Citizens",
      value: stats.totalSavedSchemes,
      icon: Heart,
      href: "/admin/schemes",
    },
    {
      label: "Open Reports",
      value: stats.openReports,
      icon: Flag,
      href: "/admin/reports",
    },
  ];

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-navy)] mb-6">
        Dashboard
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              href={c.href}
              className="border border-[var(--color-border)] rounded-lg bg-white p-5 hover:border-[var(--color-navy)] transition-colors"
            >
              <Icon size={18} className="text-[var(--color-navy)]" aria-hidden="true" />
              <p className="text-2xl font-bold text-[var(--color-ink)] mt-3">{c.value}</p>
              <p className="text-sm text-[var(--color-muted)] mt-0.5">{c.label}</p>
            </Link>
          );
        })}
      </div>

      <section className="border border-[var(--color-border)] rounded-lg bg-white p-6">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-ink)] mb-4">
          Schemes by Status
        </h2>
        <ul className="space-y-2">
          {Object.entries(STATUS_LABELS).map(([key, label]) => (
            <li key={key} className="flex items-center justify-between text-sm">
              <span className="text-[var(--color-muted)]">{label}</span>
              <span className="font-semibold text-[var(--color-ink)]">
                {stats.schemesByStatus[key] ?? 0}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
