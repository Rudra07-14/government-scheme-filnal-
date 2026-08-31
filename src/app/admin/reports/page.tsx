import type { Metadata } from "next";
import Link from "next/link";
import { getReports } from "@/lib/data/admin";
import { ReportStatusSelect } from "@/components/admin/report-status-select";

export const metadata: Metadata = {
  title: "Reports",
};

interface ReportsPageProps {
  searchParams: Promise<{ status?: string }>;
}

const CATEGORY_LABELS: Record<string, string> = {
  eligibility: "Eligibility criteria",
  benefit: "Benefit details",
  broken_link: "Broken link",
  inactive: "Scheme inactive",
  document: "Document requirements",
  other: "Other",
};

export default async function AdminReportsPage({ searchParams }: ReportsPageProps) {
  const { status } = await searchParams;
  const reports = await getReports({ status });

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-navy)]">
          Reports
        </h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          Incorrect-information reports submitted by citizens.
        </p>
      </div>

      <form method="GET" className="flex flex-wrap gap-3 mb-6">
        <select
          name="status"
          defaultValue={status ?? ""}
          className="text-sm border border-[var(--color-border)] rounded-md px-3 py-2 bg-white"
        >
          <option value="">All statuses</option>
          <option value="open">Open</option>
          <option value="reviewed">Reviewed</option>
          <option value="resolved">Resolved</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-semibold text-white bg-[var(--color-navy)] rounded-md hover:bg-[var(--color-navy-light)] transition-colors"
        >
          Filter
        </button>
      </form>

      <div className="space-y-3">
        {reports.map((r) => (
          <div key={r.id} className="border border-[var(--color-border)] rounded-lg bg-white p-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <Link
                  href={`/schemes/${r.scheme.slug}`}
                  target="_blank"
                  className="font-semibold text-[var(--color-ink)] hover:underline"
                >
                  {r.scheme.name}
                </Link>
                <p className="text-xs text-[var(--color-muted)] mt-0.5">
                  {CATEGORY_LABELS[r.category] ?? r.category} ·{" "}
                  {new Date(r.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>
              <ReportStatusSelect id={r.id} status={r.status} />
            </div>
            {r.detail && (
              <p className="text-sm text-[var(--color-ink)] mt-3 leading-relaxed">{r.detail}</p>
            )}
          </div>
        ))}

        {reports.length === 0 && (
          <div className="text-center py-16 border border-dashed border-[var(--color-border)] rounded-lg">
            <p className="text-[var(--color-muted)]">No reports match this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
