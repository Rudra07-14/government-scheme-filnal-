import type {
  EligibilityRuleInput,
  MatchResult,
  RuleCheck,
  UserAnswers,
} from "./types";

/**
 * Human-readable labels per field, used in "why this scheme matches you".
 */
const FIELD_LABELS: Record<string, string> = {
  age: "Age requirement",
  income: "Income requirement",
  state: "State requirement",
  gender: "Gender requirement",
  occupation: "Occupation requirement",
  category: "Category requirement",
};

/** Extracts the answer value relevant to a given rule field. */
function getAnswerValue(
  answers: UserAnswers,
  field: EligibilityRuleInput["field"]
): string | number | undefined {
  switch (field) {
    case "age":
      return answers.age;
    case "income":
      return answers.annualFamilyIncome;
    case "state":
      return answers.state;
    case "gender":
      return answers.gender;
    case "occupation":
      return answers.occupation;
    case "category":
      return answers.categoryInfo;
    default:
      return undefined;
  }
}

/** Evaluates a single rule against the user's answers. Pure, no side effects. */
function checkRule(
  rule: EligibilityRuleInput,
  answers: UserAnswers
): RuleCheck {
  const answerValue = getAnswerValue(answers, rule.field);
  let passed = false;

  if (answerValue !== undefined) {
    switch (rule.operator) {
      case "gte":
        passed = Number(answerValue) >= Number(rule.value);
        break;
      case "lte":
        passed = Number(answerValue) <= Number(rule.value);
        break;
      case "eq":
        passed =
          String(answerValue).toLowerCase() === rule.value.toLowerCase();
        break;
      case "in": {
        const options = rule.value.split(",").map((v) => v.trim().toLowerCase());
        passed = options.includes(String(answerValue).toLowerCase());
        break;
      }
      case "between": {
        const [min, max] = rule.value.split(",").map(Number);
        const num = Number(answerValue);
        passed = num >= min && num <= max;
        break;
      }
      default:
        passed = false;
    }
  }

  return {
    ruleId: rule.id,
    field: rule.field,
    label: FIELD_LABELS[rule.field] ?? rule.field,
    passed,
    required: rule.required,
  };
}

/**
 * Evaluates a scheme's eligibility rules against a citizen's answers.
 *
 * Deterministic and side-effect free by design: no AI/model calls, no DB
 * access, no randomness. This is what makes the "why this scheme matches
 * you" / "why you may not qualify" explanations trustworthy and testable.
 */
export function evaluateScheme(
  answers: UserAnswers,
  rules: EligibilityRuleInput[]
): MatchResult {
  const checks = rules.map((rule) => checkRule(rule, answers));

  const requiredChecks = checks.filter((c) => c.required);
  const softChecks = checks.filter((c) => !c.required);

  const passed = checks.filter((c) => c.passed);
  const failedRequired = requiredChecks.filter((c) => !c.passed);
  const softFlags = softChecks.filter((c) => !c.passed);

  let status: MatchResult["status"];
  if (failedRequired.length > 0) {
    status = "no_match";
  } else if (softFlags.length > 0) {
    status = "verification_required";
  } else {
    status = "likely_match";
  }

  // Score reflects proportion of ALL checks (required + soft) satisfied.
  // Purely a UX signal — never presented as an official eligibility figure.
  const matchScore =
    checks.length === 0
      ? 0
      : Math.round((passed.length / checks.length) * 100);

  return {
    status,
    matchScore,
    passed,
    failed: failedRequired,
    softFlags,
  };
}
