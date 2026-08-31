import { z } from "zod";

/**
 * Validation schema for the "Find Schemes For Me" questionnaire.
 * Mirrors `UserAnswers` in `src/lib/eligibility/types.ts` — keep both in
 * sync if the eligibility engine's input shape ever changes.
 */

export const occupationValues = [
  "student",
  "farmer",
  "job_seeker",
  "employee",
  "self_employed",
  "business_owner",
  "homemaker",
  "senior_citizen",
  "other",
] as const;

export const supportAreaValues = [
  "education",
  "employment",
  "healthcare",
  "housing",
  "agriculture",
  "business",
  "financial_assistance",
  "other",
] as const;

/** Step 1: who you are. */
export const basicInfoSchema = z.object({
  age: z
    .number({ error: "Enter your age" })
    .int("Age must be a whole number")
    .min(1, "Enter a valid age")
    .max(120, "Enter a valid age"),
  gender: z.string().min(1, "Please select a gender"),
  state: z.string().min(1, "Please select your state"),
  district: z.string().optional(),
});

/** Step 2: occupation and household income. */
export const occupationIncomeSchema = z.object({
  occupation: z.enum(occupationValues, { error: "Please select an occupation" }),
  annualFamilyIncome: z
    .number({ error: "Enter your annual family income" })
    .min(0, "Enter a valid income"),
});

/** Step 3: optional social category (used by some reservation-based schemes). */
export const categoryInfoSchema = z.object({
  categoryInfo: z.string().optional(),
});

/** Step 4: what kind of support the citizen is looking for. */
export const supportAreasSchema = z.object({
  supportAreas: z
    .array(z.enum(supportAreaValues))
    .min(1, "Select at least one area"),
});

export const findSchemesSchema = basicInfoSchema
  .extend(occupationIncomeSchema.shape)
  .extend(categoryInfoSchema.shape)
  .extend(supportAreasSchema.shape);

export type FindSchemesFormValues = z.infer<typeof findSchemesSchema>;

export const findSchemesDefaultValues: FindSchemesFormValues = {
  age: undefined as unknown as number,
  gender: "",
  state: "",
  district: "",
  occupation: undefined as unknown as FindSchemesFormValues["occupation"],
  annualFamilyIncome: undefined as unknown as number,
  categoryInfo: "",
  supportAreas: [],
};

/** Field names validated at each wizard step, used with RHF's `trigger()`. */
export const STEP_FIELDS = [
  ["age", "gender", "state", "district"],
  ["occupation", "annualFamilyIncome"],
  ["categoryInfo"],
  ["supportAreas"],
] as const;
