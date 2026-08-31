import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllSchemesAdmin } from "@/lib/data/admin";
import { schemeStatusValues } from "@/lib/validations/admin-scheme";
import { SchemeStatusSelect } from "@/components/admin/scheme-status-select";

export const metadata: Metadata = {
  title: "Manage Schemes",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  verification_required: "Verification Required",
  inactive: "Inactive",
  archived: "Archived",
};

interface AdminSchemesPageProps {
  searchParams: Promise<{ status?: string; q?: string }>;
}

export default async function AdminSchemesPage({ searchParams }: AdminSchemesPageProps) {
  const { status, q } = await searchParams;
  const schemes = await getAllSchemesAdmin({ status, query: q });

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-navy)]">
            Manage Schemes
          </h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            {schemes.length} scheme{schemes.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/admin/schemes/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-[var(--color-navy)] rounded-md hover:bg-[var(--color-navy-light)] transition-colors"
        >
          <Plus size={15} aria-hidden="true" />
          New Scheme
        </Link>
      </div>

      <form method="GET" className="flex flex-wrap gap-3 mb-6">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search by name or department..."
          className="flex-1 min-w-[200px] px-3 py-2 text-sm border border-[var(--color-border)] rounded-md bg-white"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="text-sm border border-[var(--color-border)] rounded-md px-3 py-2 bg-white"
        >
          <option value="">All statuses</option>
          {schemeStatusValues.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-semibold text-white bg-[var(--color-navy)] rounded-md hover:bg-[var(--color-navy-light)] transition-colors"
        >
          Filter
        </button>
      </form>

      <div className="border border-[var(--color-border)] rounded-lg bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-left text-xs text-[var(--color-muted)]">
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Level</th>
              <th className="px-4 py-3 font-semibold">Rules</th>
              <th className="px-4 py-3 font-semibold">Saved</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold sr-only">Edit</th>
            </tr>
          </thead>
          <tbody>
            {schemes.map((s) => (
              <tr key={s.id} className="border-b border-[var(--color-border)] last:border-0">
                <td className="px-4 py-3 font-medium text-[var(--color-ink)]">{s.name}</td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{s.category.name}</td>
                <td className="px-4 py-3 text-[var(--color-muted)]">
                  {s.govLevel === "central" ? "Central" : s.state ?? "State"}
                </td>
                <td className="px-4 py-3 text-[var(--color-muted)]">
                  {s._count.eligibilityRules}
                </td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{s._count.savedBy}</td>
                <td className="px-4 py-3">
                  <SchemeStatusSelect schemeId={s.id} status={s.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/schemes/${s.id}/edit`}
                    className="text-sm font-semibold text-[var(--color-navy)] hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {schemes.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-[var(--color-muted)]">
                  No schemes match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
