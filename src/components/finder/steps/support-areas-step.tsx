"use client";

import type { UseFormReturn } from "react-hook-form";
import { SUPPORT_AREA_OPTIONS } from "@/lib/constants";
import type { FindSchemesFormValues } from "@/lib/validations/find-schemes";

interface SupportAreasStepProps {
  form: UseFormReturn<FindSchemesFormValues>;
}

export function SupportAreasStep({ form }: SupportAreasStepProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-ink)]">
          What kind of support are you looking for?
        </h2>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          Select all that apply. This doesn&apos;t filter out other schemes — it just
          helps us highlight the ones most relevant to you.
        </p>
      </div>

      <fieldset>
        <legend className="sr-only">Support areas</legend>
        <div className="grid sm:grid-cols-2 gap-2">
          {SUPPORT_AREA_OPTIONS.map((a) => (
            <label
              key={a.value}
              className="flex items-start gap-2.5 text-sm border border-[var(--color-border)] rounded-md px-3 py-2.5 bg-white cursor-pointer has-[:checked]:border-[var(--color-navy)] has-[:checked]:bg-[var(--color-navy)]/5"
            >
              <input
                type="checkbox"
                value={a.value}
                className="mt-0.5"
                {...register("supportAreas")}
              />
              <span>
                <span className="block font-medium text-[var(--color-ink)]">
                  {a.label}
                </span>
                <span className="block text-xs text-[var(--color-muted)] mt-0.5">
                  {a.description}
                </span>
              </span>
            </label>
          ))}
        </div>
        {errors.supportAreas && (
          <p className="text-xs text-red-600 mt-2">{errors.supportAreas.message}</p>
        )}
      </fieldset>
    </div>
  );
}
