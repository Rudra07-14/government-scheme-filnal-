/**
 * Types for the deterministic, rule-based eligibility engine.
 *
 * IMPORTANT: This engine never calls an AI model. Every match/no-match
 * decision must be traceable to an explicit rule comparison so it can be
 * explained to the citizen ("why this scheme matches you").
 */

export type Occupation =
  | "student"
  | "farmer"
  | "job_seeker"
  | "employee"
  | "self_employed"
  | "business_owner"
  | "homemaker"
  | "senior_citizen"
  | "other";

export type SupportArea =
  | "education"
  | "employment"
  | "healthcare"
  | "housing"
  | "agriculture"
  | "business"
  | "financial_assistance"
  | "other";

/** Answers collected by the "Find Schemes For Me" questionnaire. */
export interface UserAnswers {
  age: number;
  gender: string;
  state: string;
  district?: string;
  occupation: Occupation;
  annualFamilyIncome: number;
  categoryInfo?: string; // e.g. SC/ST/OBC/General/PwD - only if user chooses to share
  supportAreas: SupportArea[];
}

export type RuleField =
  | "age"
  | "income"
  | "state"
  | "gender"
  | "occupation"
  | "category";

export type RuleOperator = "gte" | "lte" | "eq" | "in" | "between";

/** A single eligibility rule attached to a scheme (mirrors the DB row). */
export interface EligibilityRuleInput {
  id: string;
  field: RuleField;
  operator: RuleOperator;
  value: string; // raw value, parsed per field type below
  required: boolean; // false => soft flag, "additional verification required"
}

export interface RuleCheck {
  ruleId: string;
  field: RuleField;
  label: string; // human-readable, e.g. "Age requirement"
  passed: boolean;
  required: boolean;
}

export type MatchStatus =
  | "likely_match"
  | "verification_required"
  | "no_match";

export interface MatchResult {
  status: MatchStatus;
  /** 0-100. Explicitly a "Yojana Setu matching score", never an official figure. */
  matchScore: number;
  passed: RuleCheck[];
  failed: RuleCheck[];
  softFlags: RuleCheck[]; // required:false rules that didn't pass
}
