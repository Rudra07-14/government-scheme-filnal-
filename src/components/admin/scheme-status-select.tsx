"use client";

import { useTransition } from "react";
import { updateSchemeStatus } from "@/lib/actions/admin-schemes";
import { schemeStatusValues } from "@/lib/validations/admin-scheme";

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  verification_required: "Verification Required",
  inactive: "Inactive",
  archived: "Archived",
};

interface SchemeStatusSelectProps {
  schemeId: string;
  status: string;
}

export function SchemeStatusSelect({ schemeId, status }: SchemeStatusSelectProps) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as (typeof schemeStatusValues)[number];
    startTransition(async () => {
      await updateSchemeStatus(schemeId, next);
    });
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={isPending}
      className="text-xs border border-[var(--color-border)] rounded-md px-2 py-1 bg-white disabled:opacity-60"
    >
      {schemeStatusValues.map((s) => (
        <option key={s} value={s}>
          {STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
