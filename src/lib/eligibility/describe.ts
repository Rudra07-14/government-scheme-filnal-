import type { RuleField, RuleOperator } from "./types";

const FIELD_LABELS: Record<RuleField, string> = {
  age: "Age",
  income: "Annual family income",
  state: "State",
  gender: "Gender",
  occupation: "Occupation",
  category: "Category",
};

function formatValue(field: RuleField, value: string): string {
  if (field === "income") {
    const n = Number(value);
    return Number.isFinite(n) ? `₹${n.toLocaleString("en-IN")}` : value;
  }
  return value.replace(/_/g, " ");
}

/** Renders a rule as a plain-English sentence for the scheme detail page. */
export function describeRule(field: RuleField, operator: RuleOperator, value: string): string {
  const label = FIELD_LABELS[field] ?? field;
  switch (operator) {
    case "gte":
      return `${label} at least ${formatValue(field, value)}`;
    case "lte":
      return `${label} up to ${formatValue(field, value)}`;
    case "eq":
      return `${label}: ${formatValue(field, value)}`;
    case "in": {
      const options = value.split(",").map((v) => formatValue(field, v.trim()));
      return `${label}: ${options.join(" or ")}`;
    }
    case "between": {
      const [min, max] = value.split(",").map((v) => formatValue(field, v.trim()));
      return `${label} between ${min} and ${max}`;
    }
    default:
      return `${label}: ${value}`;
  }
}
