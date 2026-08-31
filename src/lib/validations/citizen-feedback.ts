import { z } from "zod";

/**
 * Validation for the citizen-facing "was this helpful" widget on the scheme
 * detail page. Mirrors the Feedback model — comment is optional, helpful
 * is a plain boolean (thumbs up/down).
 */
export const feedbackSchema = z.object({
  schemeId: z.string().min(1),
  helpful: z.boolean(),
  comment: z.string().trim().max(500, "Keep comments under 500 characters").optional(),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;

/**
 * Mirrors the `category` comment on the Report model in schema.prisma:
 * eligibility | benefit | broken_link | inactive | document | other
 */
export const reportCategoryValues = [
  "eligibility",
  "benefit",
  "broken_link",
  "inactive",
  "document",
  "other",
] as const;

export const reportCategoryLabels: Record<(typeof reportCategoryValues)[number], string> = {
  eligibility: "Eligibility criteria are wrong",
  benefit: "Benefit amount or details are wrong",
  broken_link: "Official link is broken",
  inactive: "Scheme is no longer active",
  document: "Required documents are wrong",
  other: "Something else",
};

export const reportSchema = z.object({
  schemeId: z.string().min(1),
  category: z.enum(reportCategoryValues, {
    error: "Please select what is wrong",
  }),
  detail: z.string().trim().max(1000, "Keep details under 1000 characters").optional(),
});

export type ReportInput = z.infer<typeof reportSchema>;
