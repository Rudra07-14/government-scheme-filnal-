import { z } from "zod";

/**
 * Validation for the admin "create/edit scheme" form. Mirrors the Prisma
 * `Scheme` model plus its three child tables (eligibilityRules, documents,
 * applicationSteps), which the form edits together as one unit.
 */

export const schemeStatusValues = [
  "active",
  "verification_required",
  "inactive",
  "archived",
] as const;

export const ruleFieldValues = [
  "age",
  "income",
  "state",
  "gender",
  "occupation",
  "category",
] as const;

export const ruleOperatorValues = ["gte", "lte", "eq", "in", "between"] as const;

const eligibilityRuleSchema = z.object({
  field: z.enum(ruleFieldValues, { error: "Select a field" }),
  operator: z.enum(ruleOperatorValues, { error: "Select an operator" }),
  value: z.string().min(1, "Enter a value"),
  required: z.boolean(),
});

const schemeDocumentSchema = z.object({
  name: z.string().min(1, "Document name is required"),
});

const applicationStepSchema = z.object({
  title: z.string().min(1, "Step title is required"),
  detail: z.string().min(1, "Step detail is required"),
});

export const adminSchemeSchema = z
  .object({
    name: z.string().min(1, "Scheme name is required"),
    slug: z
      .string()
      .min(1, "Slug is required")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Use lowercase letters, numbers, and hyphens only"
      ),
    description: z.string().min(1, "A short description is required"),
    overview: z.string().min(1, "Overview is required"),
    benefits: z.string().min(1, "Benefits text is required"),
    govLevel: z.enum(["central", "state"], { error: "Select a government level" }),
    state: z.string().optional(),
    department: z.string().min(1, "Department is required"),
    status: z.enum(schemeStatusValues, { error: "Select a status" }),
    officialSourceUrl: z.url("Enter a valid URL"),
    applyUrl: z.url("Enter a valid URL"),
    categoryId: z.string().min(1, "Select a category"),
    eligibilityRules: z.array(eligibilityRuleSchema),
    documents: z.array(schemeDocumentSchema),
    applicationSteps: z.array(applicationStepSchema),
  })
  .refine((data) => data.govLevel !== "state" || Boolean(data.state), {
    message: "State is required for state-level schemes",
    path: ["state"],
  });

export type AdminSchemeFormValues = z.infer<typeof adminSchemeSchema>;

export const adminSchemeDefaultValues: AdminSchemeFormValues = {
  name: "",
  slug: "",
  description: "",
  overview: "",
  benefits: "",
  govLevel: "central",
  state: "",
  department: "",
  status: "active",
  officialSourceUrl: "",
  applyUrl: "",
  categoryId: "",
  eligibilityRules: [],
  documents: [],
  applicationSteps: [],
};
