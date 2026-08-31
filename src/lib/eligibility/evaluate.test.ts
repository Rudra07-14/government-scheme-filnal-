import { describe, expect, it } from "vitest";
import { evaluateScheme } from "./evaluate";
import type { EligibilityRuleInput, UserAnswers } from "./types";

const baseAnswers: UserAnswers = {
  age: 20,
  gender: "female",
  state: "Maharashtra",
  occupation: "student",
  annualFamilyIncome: 200000,
  supportAreas: ["education"],
};

describe("evaluateScheme", () => {
  it("returns likely_match when all required rules pass", () => {
    const rules: EligibilityRuleInput[] = [
      { id: "1", field: "age", operator: "gte", value: "18", required: true },
      {
        id: "2",
        field: "income",
        operator: "lte",
        value: "250000",
        required: true,
      },
      {
        id: "3",
        field: "state",
        operator: "eq",
        value: "Maharashtra",
        required: true,
      },
    ];
    const result = evaluateScheme(baseAnswers, rules);
    expect(result.status).toBe("likely_match");
    expect(result.failed).toHaveLength(0);
    expect(result.matchScore).toBe(100);
  });

  it("returns no_match when a required rule fails", () => {
    const rules: EligibilityRuleInput[] = [
      { id: "1", field: "age", operator: "gte", value: "25", required: true },
    ];
    const result = evaluateScheme(baseAnswers, rules);
    expect(result.status).toBe("no_match");
    expect(result.failed[0].field).toBe("age");
  });

  it("returns verification_required when only soft (non-required) rules fail", () => {
    const rules: EligibilityRuleInput[] = [
      { id: "1", field: "age", operator: "gte", value: "18", required: true },
      {
        id: "2",
        field: "category",
        operator: "eq",
        value: "SC",
        required: false,
      },
    ];
    const result = evaluateScheme(baseAnswers, rules);
    expect(result.status).toBe("verification_required");
    expect(result.softFlags).toHaveLength(1);
  });

  it("handles the 'in' operator for occupation lists", () => {
    const rules: EligibilityRuleInput[] = [
      {
        id: "1",
        field: "occupation",
        operator: "in",
        value: "student,job_seeker",
        required: true,
      },
    ];
    const result = evaluateScheme(baseAnswers, rules);
    expect(result.status).toBe("likely_match");
  });

  it("handles the 'between' operator for age ranges", () => {
    const rules: EligibilityRuleInput[] = [
      {
        id: "1",
        field: "age",
        operator: "between",
        value: "18,35",
        required: true,
      },
    ];
    const result = evaluateScheme(baseAnswers, rules);
    expect(result.status).toBe("likely_match");
  });

  it("never returns likely_match with zero rules evaluated as trivially true score", () => {
    const result = evaluateScheme(baseAnswers, []);
    // No rules = no evidence; treat conservatively rather than "match everything"
    expect(result.matchScore).toBe(0);
  });
});
