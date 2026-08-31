"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import {
  feedbackSchema,
  reportSchema,
  type FeedbackInput,
  type ReportInput,
} from "@/lib/validations/citizen-feedback";

/**
 * Both Feedback and Report can be submitted signed-out (userId is optional
 * on both models), so unlike saved-schemes.ts there is no requireCitizen()
 * gate here — we just attach the userId when one is available.
 */

export interface SubmitFeedbackResult {
  success: boolean;
  error?: string;
}

export async function submitFeedback(
  input: FeedbackInput
): Promise<SubmitFeedbackResult> {
  const parsed = feedbackSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid feedback submission." };
  }

  const { userId } = await auth();

  try {
    await db.feedback.create({
      data: {
        userId: userId ?? null,
        schemeId: parsed.data.schemeId,
        helpful: parsed.data.helpful,
        comment: parsed.data.comment || null,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("submitFeedback failed:", error);
    return { success: false, error: "Could not submit feedback. Please try again." };
  }
}

export interface SubmitReportResult {
  success: boolean;
  error?: string;
}

export async function submitReport(
  input: ReportInput
): Promise<SubmitReportResult> {
  const parsed = reportSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Please select what is wrong before submitting." };
  }

  const { userId } = await auth();

  try {
    await db.report.create({
      data: {
        userId: userId ?? null,
        schemeId: parsed.data.schemeId,
        category: parsed.data.category,
        detail: parsed.data.detail || null,
      },
    });
    return { success: true };
  } catch (error) {
    // Report.schemeId has a real FK constraint (unlike Feedback.schemeId),
    // so an invalid/stale schemeId will throw here rather than insert silently.
    console.error("submitReport failed:", error);
    return { success: false, error: "Could not submit report. Please try again." };
  }
}
