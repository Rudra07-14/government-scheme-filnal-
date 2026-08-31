"use client";

import type { UseFormReturn } from "react-hook-form";
import { CATEGORY_INFO_OPTIONS } from "@/lib/constants";
import type { FindSchemesFormValues } from "@/lib/validations/find-schemes";

interface CategoryStepProps {
  form: UseFormReturn<FindSchemesFormValues>;
}

export function CategoryStep({ form }: CategoryStepProps) {
  const { register } = form;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-ink)]">
          Social category
        </h2>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          Some schemes reserve benefits for specific categories. This step is entirely
          optional — skip it if you&apos;d rather not share.
        </p>
      </div>

      <fieldset>
        <legend className="text-sm font-semibold text-[var(--color-ink)] mb-2">
          Category <span className="text-[var(--color-muted)] font-normal">(optional)</span>
        </legend>
        <div className="grid sm:grid-cols-2 gap-2">
          <label className="flex items-center gap-2 text-sm text-[var(--color-ink)] border border-[var(--color-border)] rounded-md px-3 py-2 bg-white cursor-pointer has-[:checked]:border-[var(--color-navy)] has-[:checked]:bg-[var(--color-navy)]/5">
            <input type="radio" value="" {...register("categoryInfo")} defaultChecked />
            Prefer not to say
          </label>
          {CATEGORY_INFO_OPTIONS.map((c) => (
            <label
              key={c.value}
              className="flex items-center gap-2 text-sm text-[var(--color-ink)] border border-[var(--color-border)] rounded-md px-3 py-2 bg-white cursor-pointer has-[:checked]:border-[var(--color-navy)] has-[:checked]:bg-[var(--color-navy)]/5"
            >
              <input type="radio" value={c.value} {...register("categoryInfo")} />
              {c.label}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
