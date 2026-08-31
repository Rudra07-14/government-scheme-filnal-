"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Loader2, Search } from "lucide-react";

import {
  findSchemesDefaultValues,
  findSchemesSchema,
  STEP_FIELDS,
  type FindSchemesFormValues,
} from "@/lib/validations/find-schemes";
import { matchSchemes, type MatchSchemesResult } from "@/lib/actions/match-schemes";
import type { UserAnswers } from "@/lib/eligibility/types";

import { ProgressSteps } from "@/components/finder/progress-steps";
import { BasicInfoStep } from "@/components/finder/steps/basic-info-step";
import { OccupationIncomeStep } from "@/components/finder/steps/occupation-income-step";
import { CategoryStep } from "@/components/finder/steps/category-step";
import { SupportAreasStep } from "@/components/finder/steps/support-areas-step";
import { MatchResults } from "@/components/finder/match-results";

const TOTAL_STEPS = STEP_FIELDS.length;

export function FindSchemesWizard() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<MatchSchemesResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<FindSchemesFormValues>({
    resolver: zodResolver(findSchemesSchema),
    defaultValues: findSchemesDefaultValues,
    mode: "onSubmit",
  });

  const isLastStep = step === TOTAL_STEPS - 1;

  async function goNext() {
    const fields = STEP_FIELDS[step] as readonly (keyof FindSchemesFormValues)[];
    const valid = await form.trigger(fields);
    if (!valid) return;

    if (!isLastStep) {
      setStep((s) => s + 1);
      return;
    }

    // Final step: submit to the eligibility engine.
    setSubmitError(null);
    const values = form.getValues();
    const answers: UserAnswers = {
      ...values,
      district: values.district || undefined,
      categoryInfo: values.categoryInfo || undefined,
    };

    startTransition(async () => {
      try {
        const res = await matchSchemes(answers);
        setResult(res);
      } catch {
        setSubmitError(
          "Something went wrong while matching schemes. Please try again."
        );
      }
    });
  }

  function goBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  function handleEditAnswers() {
    setResult(null);
    setSubmitError(null);
    setStep(0);
  }

  if (result) {
    return (
      <MatchResults
        matches={result.matches}
        consideredCount={result.consideredCount}
        onEditAnswers={handleEditAnswers}
      />
    );
  }

  return (
    <div>
      <div className="mb-8">
        <ProgressSteps currentStep={step} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void goNext();
        }}
        className="bg-white border border-[var(--color-border)] rounded-lg p-6 sm:p-8"
      >
        {step === 0 && <BasicInfoStep form={form} />}
        {step === 1 && <OccupationIncomeStep form={form} />}
        {step === 2 && <CategoryStep form={form} />}
        {step === 3 && <SupportAreasStep form={form} />}

        {submitError && (
          <p className="text-sm text-red-600 mt-4" role="alert">
            {submitError}
          </p>
        )}

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--color-border)]">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0 || isPending}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-[var(--color-ink)] rounded-md hover:bg-black/5 transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Back
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-[var(--color-navy)] rounded-md hover:bg-[var(--color-navy-light)] transition-colors disabled:opacity-60"
          >
            {isPending ? (
              <>
                <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                Matching...
              </>
            ) : isLastStep ? (
              <>
                <Search size={15} aria-hidden="true" />
                Find My Schemes
              </>
            ) : (
              <>
                Next
                <ArrowRight size={15} aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
