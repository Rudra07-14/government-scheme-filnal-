"use server";

import { db } from "@/lib/db";
import { evaluateScheme } from "@/lib/eligibility/evaluate";
import type {
  EligibilityRuleInput,
  MatchResult,
  RuleField,
  RuleOperator,
  UserAnswers,
} from "@/lib/eligibility/types";
import { findSchemesSchema } from "@/lib/validations/find-schemes";

export interface SchemeMatchSummary {
  id: string;
  slug: string;
  name: string;
  description: string;
  govLevel: string;
  state: string | null;
  category: { name: string; slug: string };
}

export interface SchemeMatch {
  scheme: SchemeMatchSummary;
  match: MatchResult;
}

export interface MatchSchemesResult {
  matches: SchemeMatch[];
  consideredCount: number;
}

/**
 * Runs the deterministic eligibility engine (see `lib/eligibility/evaluate.ts`)
 * against every active/verification_required scheme, using the citizen's
 * questionnaire answers. Server Action: no rules or scores are ever computed
 * on the client, and no AI model is involved anywhere in this path.
 */
export async function matchSchemes(
  rawAnswers: UserAnswers
): Promise<MatchSchemesResult> {
  const parsed = findSchemesSchema.safeParse(rawAnswers);
  if (!parsed.success) {
    throw new Error("Invalid questionnaire answers");
  }
  const answers = parsed.data;

  const schemes = await db.scheme.findMany({
    where: { status: { in: ["active", "verification_required"] } },
    include: { category: true, eligibilityRules: true },
  });

  const evaluated: SchemeMatch[] = schemes.map((scheme) => {
    const rules: EligibilityRuleInput[] = scheme.eligibilityRules.map(
      (r) => ({
        id: r.id,
        field: r.field as RuleField,
        operator: r.operator as RuleOperator,
        value: r.value,
        required: r.required,
      })
    );

    const match = evaluateScheme(answers, rules);

    return {
      scheme: {
        id: scheme.id,
        slug: scheme.slug,
        name: scheme.name,
        description: scheme.description,
        govLevel: scheme.govLevel,
        state: scheme.state,
        category: { name: scheme.category.name, slug: scheme.category.slug },
      },
      match,
    };
  });

  const relevant = evaluated.filter((r) => r.match.status !== "no_match");

  const statusRank = (status: MatchResult["status"]) =>
    status === "likely_match" ? 0 : 1;

  relevant.sort((a, b) => {
    const rankDiff = statusRank(a.match.status) - statusRank(b.match.status);
    if (rankDiff !== 0) return rankDiff;
    return b.match.matchScore - a.match.matchScore;
  });

  return { matches: relevant, consideredCount: evaluated.length };
}
