"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const reportStatusValues = ["open", "reviewed", "resolved"] as const;
export type ReportStatus = (typeof reportStatusValues)[number];

export async function updateReportStatus(
  id: string,
  status: ReportStatus
): Promise<void> {
  await requireAdmin();
  await db.report.update({ where: { id }, data: { status } });
  revalidatePath("/admin/reports");
}
