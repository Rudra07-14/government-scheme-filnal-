import type { Occupation, SupportArea } from "@/lib/eligibility/types";

/** All Indian states and union territories, for the state selector. */
export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
] as const;

export const GENDER_OPTIONS: { value: string; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

export const OCCUPATION_OPTIONS: { value: Occupation; label: string }[] = [
  { value: "student", label: "Student" },
  { value: "farmer", label: "Farmer" },
  { value: "job_seeker", label: "Job seeker / Unemployed" },
  { value: "employee", label: "Salaried employee" },
  { value: "self_employed", label: "Self-employed / Freelancer" },
  { value: "business_owner", label: "Business owner" },
  { value: "homemaker", label: "Homemaker" },
  { value: "senior_citizen", label: "Senior citizen" },
  { value: "other", label: "Other" },
];

export const CATEGORY_INFO_OPTIONS: { value: string; label: string }[] = [
  { value: "General", label: "General" },
  { value: "OBC", label: "OBC" },
  { value: "SC", label: "SC" },
  { value: "ST", label: "ST" },
  { value: "EWS", label: "EWS" },
  { value: "PwD", label: "Person with Disability (PwD)" },
];

export const SUPPORT_AREA_OPTIONS: {
  value: SupportArea;
  label: string;
  description: string;
}[] = [
  {
    value: "education",
    label: "Education",
    description: "Scholarships, fee support, study loans",
  },
  {
    value: "employment",
    label: "Employment",
    description: "Skilling, job placement, self-employment support",
  },
  {
    value: "healthcare",
    label: "Healthcare",
    description: "Insurance, treatment cost support",
  },
  {
    value: "housing",
    label: "Housing",
    description: "Home construction or purchase assistance",
  },
  {
    value: "agriculture",
    label: "Agriculture",
    description: "Farmer income support, crop insurance, equipment",
  },
  {
    value: "business",
    label: "Business",
    description: "Loans and subsidies for starting or growing a business",
  },
  {
    value: "financial_assistance",
    label: "Financial Assistance",
    description: "Direct benefit transfers, pensions, welfare payouts",
  },
  {
    value: "other",
    label: "Other",
    description: "Not sure, or something else",
  },
];
