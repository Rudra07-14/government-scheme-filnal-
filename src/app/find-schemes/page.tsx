import type { Metadata } from "next";
import { FindSchemesWizard } from "@/components/finder/find-schemes-wizard";

export const metadata: Metadata = {
  title: "Find Schemes For Me",
  description:
    "Answer a few questions about yourself and we'll match you against government schemes you may be eligible for.",
};

export default function FindSchemesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--color-navy)]">
          Find Schemes For Me
        </h1>
        <p className="text-[var(--color-muted)] mt-2">
          Answer a few quick questions and we&apos;ll check your eligibility against
          every scheme in our database.
        </p>
      </div>

      <FindSchemesWizard />
    </div>
  );
}
