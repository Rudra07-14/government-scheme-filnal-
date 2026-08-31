import { db } from "@/lib/db";

export interface SchemeFilters {
  query?: string;
  category?: string; // category slug
  state?: string;
  govLevel?: "central" | "state";
}

export interface CategorySummary {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
}

export interface CategoryWithCount extends CategorySummary {
  _count: { schemes: number };
}

export interface SchemeSummary {
  id: string;
  slug: string;
  name: string;
  description: string;
  overview: string;
  benefits: string;
  govLevel: string;
  state: string | null;
  department: string;
  status: string;
  officialSourceUrl: string;
  applyUrl: string;
  lastVerifiedAt: Date | null;
  categoryId: string;
  category: CategorySummary;
  createdAt: Date;
  updatedAt: Date;
}

export interface EligibilityRuleRow {
  id: string;
  schemeId: string;
  field: string;
  operator: string;
  value: string;
  required: boolean;
}

export interface SchemeDocumentRow {
  id: string;
  schemeId: string;
  name: string;
  order: number;
}

export interface ApplicationStepRow {
  id: string;
  schemeId: string;
  title: string;
  detail: string;
  order: number;
}

export interface SchemeDetail extends SchemeSummary {
  eligibilityRules: EligibilityRuleRow[];
  documents: SchemeDocumentRow[];
  applicationSteps: ApplicationStepRow[];
}

/**
 * Fetches active/verification_required schemes for the public browse page.
 * Inactive/archived schemes are never shown publicly, matching the RLS
 * policy already enforced at the database level for anon access.
 */
export async function getSchemes(
  filters: SchemeFilters = {}
): Promise<SchemeSummary[]> {
  const { query, category, state, govLevel } = filters;

  const schemes = await db.scheme.findMany({
    where: {
      status: { in: ["active", "verification_required"] },
      ...(category && { category: { slug: category } }),
      ...(state && { state }),
      ...(govLevel && { govLevel }),
      ...(query && {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { department: { contains: query, mode: "insensitive" } },
        ],
      }),
    },
    include: { category: true },
    orderBy: { name: "asc" },
  });

  return schemes as unknown as SchemeSummary[];
}

export async function getSchemeBySlug(
  slug: string
): Promise<SchemeDetail | null> {
  const scheme = await db.scheme.findFirst({
    where: {
      slug,
      status: { in: ["active", "verification_required"] },
    },
    include: {
      category: true,
      eligibilityRules: true,
      documents: { orderBy: { order: "asc" } },
      applicationSteps: { orderBy: { order: "asc" } },
    },
  });

  return scheme as unknown as SchemeDetail | null;
}

export async function getCategories(): Promise<CategoryWithCount[]> {
  const categories = await db.category.findMany({
    include: { _count: { select: { schemes: true } } },
    orderBy: { name: "asc" },
  });

  return categories as unknown as CategoryWithCount[];
}

export async function getCategoryBySlug(
  slug: string
): Promise<CategorySummary | null> {
  const category = await db.category.findUnique({ where: { slug } });
  return category as unknown as CategorySummary | null;
}

/** Distinct states currently represented among active schemes, for filters. */
export async function getAvailableStates(): Promise<string[]> {
  const rows = await db.scheme.findMany({
    where: {
      status: { in: ["active", "verification_required"] },
      state: { not: null },
    },
    select: { state: true },
    distinct: ["state"],
  });

  return (rows as unknown as { state: string | null }[])
    .map((r) => r.state)
    .filter((s): s is string => Boolean(s));
}

export interface SavedSchemeEntry {
  savedAt: Date;
  scheme: SchemeSummary;
}

/**
 * Schemes a citizen has saved, most recently saved first. Includes schemes
 * regardless of current status so a saved scheme doesn't just silently
 * vanish from the profile if it's later marked inactive — the UI can
 * decide how to label that case.
 */
export async function getSavedSchemesForUser(
  userId: string
): Promise<SavedSchemeEntry[]> {
  const rows = await db.savedScheme.findMany({
    where: { userId },
    include: { scheme: { include: { category: true } } },
    orderBy: { savedAt: "desc" },
  });

  return rows.map((r) => ({
    savedAt: r.savedAt,
    scheme: r.scheme as unknown as SchemeSummary,
  }));
}
