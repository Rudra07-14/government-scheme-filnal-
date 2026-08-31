"use client";

import { useTransition } from "react";
import { updateReportStatus, reportStatusValues, type ReportStatus } from "@/lib/actions/admin-reports";

const LABELS: Record<ReportStatus, string> = {
  open: "Open",
  reviewed: "Reviewed",
  resolved: "Resolved",
};

export function ReportStatusSelect({ id, status }: { id: string; status: string }) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as ReportStatus;
    startTransition(async () => {
      await updateReportStatus(id, next);
    });
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={isPending}
      className="text-xs border border-[var(--color-border)] rounded-md px-2 py-1 bg-white disabled:opacity-60"
    >
      {reportStatusValues.map((s) => (
        <option key={s} value={s}>
          {LABELS[s]}
        </option>
      ))}
    </select>
  );
}
