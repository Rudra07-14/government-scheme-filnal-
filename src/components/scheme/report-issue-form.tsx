"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Flag, CheckCircle2 } from "lucide-react";
import { submitReport } from "@/lib/actions/citizen-feedback";
import {
  reportCategoryValues,
  type ReportInput,
} from "@/lib/validations/citizen-feedback";

interface ReportIssueFormProps {
  schemeId: string;
}

// Maps each Report.category enum value to its message key in the "Report"
// namespace (categoryEligibility, categoryBenefit, ...).
const CATEGORY_LABEL_KEYS: Record<
  ReportInput["category"],
  "categoryEligibility" | "categoryBenefit" | "categoryBrokenLink" | "categoryInactive" | "categoryDocument" | "categoryOther"
> = {
  eligibility: "categoryEligibility",
  benefit: "categoryBenefit",
  broken_link: "categoryBrokenLink",
  inactive: "categoryInactive",
  document: "categoryDocument",
  other: "categoryOther",
};

export function ReportIssueForm({ schemeId }: ReportIssueFormProps) {
  const t = useTranslations("Report");
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<ReportInput["category"] | "">("");
  const [detail, setDetail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (!category) {
      setError(t("selectCategoryError"));
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await submitReport({ schemeId, category, detail });
      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error ?? t("genericError"));
      }
    });
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-2 text-sm text-[var(--color-green)]">
        <CheckCircle2 size={16} aria-hidden="true" />
        {t("thanks")}
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-navy)] transition-colors"
      >
        <Flag size={14} aria-hidden="true" />
        {t("trigger")}
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-white p-5">
      <p className="text-sm font-semibold text-[var(--color-ink)]">
        {t("heading")}
      </p>
      <div className="mt-3 space-y-2">
        {reportCategoryValues.map((value) => (
          <label
            key={value}
            className="flex items-center gap-2 text-sm text-[var(--color-ink)]"
          >
            <input
              type="radio"
              name="report-category"
              value={value}
              checked={category === value}
              onChange={() => setCategory(value)}
            />
            {t(CATEGORY_LABEL_KEYS[value])}
          </label>
        ))}
      </div>

      <label htmlFor="report-detail" className="sr-only">
        {t("detailPlaceholder")}
      </label>
      <textarea
        id="report-detail"
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
        placeholder={t("detailPlaceholder")}
        rows={3}
        maxLength={1000}
        className="w-full mt-3 text-sm border border-[var(--color-border)] rounded-md px-3 py-2 outline-none focus:border-[var(--color-navy)]"
      />

      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}

      <div className="flex gap-2 mt-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="px-4 py-1.5 text-sm font-semibold text-white bg-[var(--color-navy)] rounded-md hover:bg-[var(--color-navy-light)] transition-colors disabled:opacity-60"
        >
          {isPending ? t("submitting") : t("submit")}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          disabled={isPending}
          className="px-4 py-1.5 text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
        >
          {t("cancel")}
        </button>
      </div>
    </div>
  );
}
