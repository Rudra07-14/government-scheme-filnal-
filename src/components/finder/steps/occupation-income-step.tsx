"use client";

import type { UseFormReturn } from "react-hook-form";
import { OCCUPATION_OPTIONS } from "@/lib/constants";
import type { FindSchemesFormValues } from "@/lib/validations/find-schemes";

interface OccupationIncomeStepProps {
  form: UseFormReturn<FindSchemesFormValues>;
}

export function OccupationIncomeStep({ form }: OccupationIncomeStepProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-ink)]">
          Work &amp; income
        </h2>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          Many schemes set an income ceiling or target a specific occupation — this
          narrows results to what you actually qualify for.
        </p>
      </div>

      <fieldset>
        <legend className="text-sm font-semibold text-[var(--color-ink)] mb-2">
          What best describes your current occupation?
        </legend>
        <div className="grid sm:grid-cols-2 gap-2">
          {OCCUPATION_OPTIONS.map((o) => (
            <label
              key={o.value}
              className="flex items-center gap-2 text-sm text-[var(--color-ink)] border border-[var(--color-border)] rounded-md px-3 py-2 bg-white cursor-pointer has-[:checked]:border-[var(--color-navy)] has-[:checked]:bg-[var(--color-navy)]/5"
            >
              <input type="radio" value={o.value} {...register("occupation")} />
              {o.label}
            </label>
          ))}
        </div>
        {errors.occupation && (
          <p className="text-xs text-red-600 mt-1.5">{errors.occupation.message}</p>
        )}
      </fieldset>

      <div>
        <label
          htmlFor="annualFamilyIncome"
          className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5"
        >
          Annual family income (₹)
        </label>
        <input
          id="annualFamilyIncome"
          type="number"
          inputMode="numeric"
          min={0}
          placeholder="e.g. 250000"
          className="w-full sm:w-64 px-3 py-2 text-sm border border-[var(--color-border)] rounded-md bg-white"
          {...register("annualFamilyIncome", { valueAsNumber: true })}
        />
        <p className="text-xs text-[var(--color-muted)] mt-1">
          Total yearly income of your household, before tax.
        </p>
        {errors.annualFamilyIncome && (
          <p className="text-xs text-red-600 mt-1">
            {errors.annualFamilyIncome.message}
          </p>
        )}
      </div>
    </div>
  );
}
