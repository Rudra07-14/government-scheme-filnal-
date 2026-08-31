"use client";

import type { UseFormReturn } from "react-hook-form";
import { GENDER_OPTIONS, INDIAN_STATES } from "@/lib/constants";
import type { FindSchemesFormValues } from "@/lib/validations/find-schemes";

interface BasicInfoStepProps {
  form: UseFormReturn<FindSchemesFormValues>;
}

export function BasicInfoStep({ form }: BasicInfoStepProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-ink)]">
          Tell us about yourself
        </h2>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          This helps us match you against age and location-based eligibility rules.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="age" className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5">
            Age
          </label>
          <input
            id="age"
            type="number"
            inputMode="numeric"
            min={0}
            max={120}
            placeholder="e.g. 28"
            className="w-full px-3 py-2 text-sm border border-[var(--color-border)] rounded-md bg-white"
            {...register("age", { valueAsNumber: true })}
          />
          {errors.age && (
            <p className="text-xs text-red-600 mt-1">{errors.age.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5">
            Gender
          </label>
          <select
            id="gender"
            className="w-full px-3 py-2 text-sm border border-[var(--color-border)] rounded-md bg-white"
            defaultValue=""
            {...register("gender")}
          >
            <option value="" disabled>
              Select gender
            </option>
            {GENDER_OPTIONS.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
          {errors.gender && (
            <p className="text-xs text-red-600 mt-1">{errors.gender.message}</p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="state" className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5">
            State / Union Territory
          </label>
          <select
            id="state"
            className="w-full px-3 py-2 text-sm border border-[var(--color-border)] rounded-md bg-white"
            defaultValue=""
            {...register("state")}
          >
            <option value="" disabled>
              Select your state
            </option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="text-xs text-red-600 mt-1">{errors.state.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="district" className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5">
            District <span className="text-[var(--color-muted)] font-normal">(optional)</span>
          </label>
          <input
            id="district"
            type="text"
            placeholder="e.g. Pune"
            className="w-full px-3 py-2 text-sm border border-[var(--color-border)] rounded-md bg-white"
            {...register("district")}
          />
        </div>
      </div>
    </div>
  );
}
