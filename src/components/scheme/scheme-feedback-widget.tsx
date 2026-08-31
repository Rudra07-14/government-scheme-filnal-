"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { ThumbsUp, ThumbsDown, CheckCircle2 } from "lucide-react";
import { submitFeedback } from "@/lib/actions/citizen-feedback";

interface SchemeFeedbackWidgetProps {
  schemeId: string;
}

export function SchemeFeedbackWidget({ schemeId }: SchemeFeedbackWidgetProps) {
  const t = useTranslations("Feedback");
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (helpful === null) return;
    setError(null);
    startTransition(async () => {
      const result = await submitFeedback({ schemeId, helpful, comment });
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

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-white p-5">
      <p className="text-sm font-semibold text-[var(--color-ink)]">
        {t("prompt")}
      </p>
      <div className="flex gap-2 mt-3">
        <button
          type="button"
          onClick={() => setHelpful(true)}
          aria-pressed={helpful === true}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md border transition-colors ${
            helpful === true
              ? "border-[var(--color-green)] bg-[var(--color-green)]/10 text-[var(--color-green)]"
              : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-navy)]"
          }`}
        >
          <ThumbsUp size={14} aria-hidden="true" />
          {t("yes")}
        </button>
        <button
          type="button"
          onClick={() => setHelpful(false)}
          aria-pressed={helpful === false}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md border transition-colors ${
            helpful === false
              ? "border-[var(--color-navy)] bg-[var(--color-navy)]/10 text-[var(--color-navy)]"
              : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-navy)]"
          }`}
        >
          <ThumbsDown size={14} aria-hidden="true" />
          {t("no")}
        </button>
      </div>

      {helpful !== null && (
        <div className="mt-4">
          <label htmlFor="feedback-comment" className="sr-only">
            {t("commentPlaceholder")}
          </label>
          <textarea
            id="feedback-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t("commentPlaceholder")}
            rows={2}
            maxLength={500}
            className="w-full text-sm border border-[var(--color-border)] rounded-md px-3 py-2 outline-none focus:border-[var(--color-navy)]"
          />
          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="mt-2 px-4 py-1.5 text-sm font-semibold text-white bg-[var(--color-navy)] rounded-md hover:bg-[var(--color-navy-light)] transition-colors disabled:opacity-60"
          >
            {isPending ? t("submitting") : t("submit")}
          </button>
        </div>
      )}
    </div>
  );
}
