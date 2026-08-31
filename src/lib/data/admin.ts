import { db } from "@/lib/db";

export interface AdminStats {
  totalSchemes: number;
  schemesByStatus: Record<string, number>;
  totalCategories: number;
  totalSavedSchemes: number;
  openReports: number;
  totalFeedback: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  const [statusCounts, totalCategories, totalSavedSchemes, openReports, totalFeedback] =
    await Promise.all([
      db.scheme.groupBy({ by: ["status"], _count: { _all: true } }),
      db.category.count(),
      db.savedScheme.count(),
      db.report.count({ where: { status: "open" } }),
      db.feedback.count(),
    ]);

  const schemesByStatus: Record<string, number> = {};
  let totalSchemes = 0;
  for (const row of statusCounts) {
    schemesByStatus[row.status] = row._count._all;
    totalSchemes += row._count._all;
  }

  return {
    totalSchemes,
    schemesByStatus,
    totalCategories,
    totalSavedSchemes,
    openReports,
    totalFeedback,
  };
}

export interface AdminSchemeRow {
  id: string;
  slug: string;
  name: string;
  status: string;
  govLevel: string;
  state: string | null;
  department: string;
  lastVerifiedAt: Date | null;
  updatedAt: Date;
  category: { name: string };
  _count: { eligibilityRules: number; savedBy: number };
}

export interface AdminSchemeFilters {
  status?: string;
  query?: string;
}

/** All schemes regardless of status — this is the admin view, unlike the public data layer. */
export async function getAllSchemesAdmin(
  filters: AdminSchemeFilters = {}
): Promise<AdminSchemeRow[]> {
  const { status, query } = filters;

  const schemes = await db.scheme.findMany({
    where: {
      ...(status && { status }),
      ...(query && {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { department: { contains: query, mode: "insensitive" } },
        ],
      }),
    },
    include: {
      category: { select: { name: true } },
      _count: { select: { eligibilityRules: true, savedBy: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return schemes as unknown as AdminSchemeRow[];
}

export async function getSchemeForEdit(id: string) {
  return db.scheme.findUnique({
    where: { id },
    include: {
      eligibilityRules: true,
      documents: { orderBy: { order: "asc" } },
      applicationSteps: { orderBy: { order: "asc" } },
    },
  });
}

export interface AdminReportRow {
  id: string;
  category: string;
  detail: string | null;
  status: string;
  createdAt: Date;
  scheme: { id: string; slug: string; name: string };
}

export async function getReports(filters: { status?: string } = {}): Promise<AdminReportRow[]> {
  const { status } = filters;
  const reports = await db.report.findMany({
    where: { ...(status && { status }) },
    include: { scheme: { select: { id: true, slug: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return reports as unknown as AdminReportRow[];
}

export interface AdminFeedbackRow {
  id: string;
  helpful: boolean;
  comment: string | null;
  createdAt: Date;
  schemeName: string | null;
}

/**
 * Feedback.schemeId is a plain field (no Prisma relation defined on that
 * model), so scheme names are resolved with a separate lookup rather than
 * an `include`.
 */
export async function getFeedbackList(): Promise<AdminFeedbackRow[]> {
  const feedback = await db.feedback.findMany({ orderBy: { createdAt: "desc" } });

  const schemeIds = [...new Set(feedback.map((f) => f.schemeId).filter(Boolean))] as string[];
  const schemes = schemeIds.length
    ? await db.scheme.findMany({
        where: { id: { in: schemeIds } },
        select: { id: true, name: true },
      })
    : [];
  const nameById = new Map(schemes.map((s) => [s.id, s.name]));

  return feedback.map((f) => ({
    id: f.id,
    helpful: f.helpful,
    comment: f.comment,
    createdAt: f.createdAt,
    schemeName: f.schemeId ? nameById.get(f.schemeId) ?? "Unknown scheme" : null,
  }));
}
