"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Loader2 } from "lucide-react";

import {
  adminSchemeSchema,
  ruleFieldValues,
  ruleOperatorValues,
  schemeStatusValues,
  type AdminSchemeFormValues,
} from "@/lib/validations/admin-scheme";
import { createScheme, updateScheme } from "@/lib/actions/admin-schemes";

interface CategoryOption {
  id: string;
  name: string;
}

interface SchemeFormProps {
  categories: CategoryOption[];
  defaultValues: AdminSchemeFormValues;
  schemeId?: string; // present when editing
}

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  verification_required: "Verification Required",
  inactive: "Inactive",
  archived: "Archived",
};

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full px-3 py-2 text-sm border border-[var(--color-border)] rounded-md bg-white";

export function SchemeForm({ categories, defaultValues, schemeId }: SchemeFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AdminSchemeFormValues>({
    resolver: zodResolver(adminSchemeSchema),
    defaultValues,
  });

  const govLevel = watch("govLevel");

  const rulesArray = useFieldArray({ control, name: "eligibilityRules" });
  const documentsArray = useFieldArray({ control, name: "documents" });
  const stepsArray = useFieldArray({ control, name: "applicationSteps" });

  function onSubmit(values: AdminSchemeFormValues) {
    setSubmitError(null);
    startTransition(async () => {
      try {
        const result = schemeId
          ? await updateScheme(schemeId, values)
          : await createScheme(values);
        router.push(`/admin/schemes`);
        router.refresh();
        void result;
      } catch (error) {
        console.error("Scheme save failed:", error);
        setSubmitError(
          error instanceof Error
            ? error.message
            : "Something went wrong saving this scheme. Please try again."
        );
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      {/* Basics */}
      <section className="border border-[var(--color-border)] rounded-lg bg-white p-6 space-y-4">
        <h2 className="font-[family-name:var(--font-display)] font-bold text-[var(--color-ink)]">
          Basics
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Scheme name" error={errors.name?.message}>
            <input className={inputClass} {...register("name")} />
          </Field>
          <Field
            label="Slug"
            error={errors.slug?.message}
          >
            <input
              className={inputClass}
              placeholder="e.g. pm-kisan"
              {...register("slug")}
            />
          </Field>
        </div>

        <Field label="Short description" error={errors.description?.message}>
          <textarea rows={2} className={inputClass} {...register("description")} />
        </Field>

        <Field label="Overview" error={errors.overview?.message}>
          <textarea rows={4} className={inputClass} {...register("overview")} />
        </Field>

        <Field label="Benefits" error={errors.benefits?.message}>
          <textarea rows={3} className={inputClass} {...register("benefits")} />
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Category" error={errors.categoryId?.message}>
            <select className={inputClass} {...register("categoryId")}>
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Department" error={errors.department?.message}>
            <input className={inputClass} {...register("department")} />
          </Field>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Government level" error={errors.govLevel?.message}>
            <select className={inputClass} {...register("govLevel")}>
              <option value="central">Central</option>
              <option value="state">State</option>
            </select>
          </Field>
          {govLevel === "state" && (
            <Field label="State" error={errors.state?.message}>
              <input className={inputClass} {...register("state")} />
            </Field>
          )}
          <Field label="Status" error={errors.status?.message}>
            <select className={inputClass} {...register("status")}>
              {schemeStatusValues.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Official source URL" error={errors.officialSourceUrl?.message}>
            <input className={inputClass} {...register("officialSourceUrl")} />
          </Field>
          <Field label="Apply URL" error={errors.applyUrl?.message}>
            <input className={inputClass} {...register("applyUrl")} />
          </Field>
        </div>
      </section>

      {/* Eligibility rules */}
      <section className="border border-[var(--color-border)] rounded-lg bg-white p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-display)] font-bold text-[var(--color-ink)]">
            Eligibility Rules
          </h2>
          <button
            type="button"
            onClick={() =>
              rulesArray.append({ field: "age", operator: "gte", value: "", required: true })
            }
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-navy)] hover:underline"
          >
            <Plus size={14} aria-hidden="true" />
            Add rule
          </button>
        </div>

        {rulesArray.fields.length === 0 && (
          <p className="text-sm text-[var(--color-muted)]">
            No rules yet. Without any, every citizen will be shown as a match.
          </p>
        )}

        <div className="space-y-3">
          {rulesArray.fields.map((field, i) => (
            <div
              key={field.id}
              className="grid sm:grid-cols-[1fr_1fr_1fr_auto_auto] gap-2 items-start border border-[var(--color-border)] rounded-md p-3"
            >
              <select className={inputClass} {...register(`eligibilityRules.${i}.field`)}>
                {ruleFieldValues.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
              <select className={inputClass} {...register(`eligibilityRules.${i}.operator`)}>
                {ruleOperatorValues.map((op) => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </select>
              <div>
                <input
                  className={inputClass}
                  placeholder="e.g. 18 or 18,60"
                  {...register(`eligibilityRules.${i}.value`)}
                />
                {errors.eligibilityRules?.[i]?.value && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.eligibilityRules[i]?.value?.message}
                  </p>
                )}
              </div>
              <label className="flex items-center gap-1.5 text-xs text-[var(--color-muted)] whitespace-nowrap px-1 py-2">
                <input type="checkbox" {...register(`eligibilityRules.${i}.required`)} />
                Required
              </label>
              <button
                type="button"
                onClick={() => rulesArray.remove(i)}
                aria-label="Remove rule"
                className="text-[var(--color-muted)] hover:text-red-600 p-2"
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Documents */}
      <section className="border border-[var(--color-border)] rounded-lg bg-white p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-display)] font-bold text-[var(--color-ink)]">
            Required Documents
          </h2>
          <button
            type="button"
            onClick={() => documentsArray.append({ name: "" })}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-navy)] hover:underline"
          >
            <Plus size={14} aria-hidden="true" />
            Add document
          </button>
        </div>

        <div className="space-y-2">
          {documentsArray.fields.map((field, i) => (
            <div key={field.id} className="flex gap-2 items-start">
              <div className="flex-1">
                <input
                  className={inputClass}
                  placeholder="e.g. Aadhaar Card"
                  {...register(`documents.${i}.name`)}
                />
                {errors.documents?.[i]?.name && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.documents[i]?.name?.message}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => documentsArray.remove(i)}
                aria-label="Remove document"
                className="text-[var(--color-muted)] hover:text-red-600 p-2"
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Application steps */}
      <section className="border border-[var(--color-border)] rounded-lg bg-white p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-display)] font-bold text-[var(--color-ink)]">
            How to Apply
          </h2>
          <button
            type="button"
            onClick={() => stepsArray.append({ title: "", detail: "" })}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-navy)] hover:underline"
          >
            <Plus size={14} aria-hidden="true" />
            Add step
          </button>
        </div>

        <div className="space-y-3">
          {stepsArray.fields.map((field, i) => (
            <div
              key={field.id}
              className="grid sm:grid-cols-[1fr_2fr_auto] gap-2 items-start border border-[var(--color-border)] rounded-md p-3"
            >
              <div>
                <input
                  className={inputClass}
                  placeholder="Step title"
                  {...register(`applicationSteps.${i}.title`)}
                />
                {errors.applicationSteps?.[i]?.title && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.applicationSteps[i]?.title?.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  className={inputClass}
                  placeholder="Step detail"
                  {...register(`applicationSteps.${i}.detail`)}
                />
                {errors.applicationSteps?.[i]?.detail && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.applicationSteps[i]?.detail?.message}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => stepsArray.remove(i)}
                aria-label="Remove step"
                className="text-[var(--color-muted)] hover:text-red-600 p-2"
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {submitError && (
        <p className="text-sm text-red-600" role="alert">
          {submitError}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-[var(--color-navy)] rounded-md hover:bg-[var(--color-navy-light)] transition-colors disabled:opacity-60"
        >
          {isPending && <Loader2 size={15} className="animate-spin" aria-hidden="true" />}
          {schemeId ? "Save Changes" : "Create Scheme"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/schemes")}
          className="px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)] rounded-md hover:bg-black/5 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
