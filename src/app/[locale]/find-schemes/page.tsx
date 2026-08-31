import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { FindSchemesWizard } from "@/components/finder/find-schemes-wizard";

export const metadata: Metadata = {
  title: "Find Schemes For Me",
  description:
    "Answer a few questions about yourself and we'll match you against government schemes you may be eligible for.",
};

export default async function FindSchemesPage() {
  const t = await getTranslations("FindSchemes");

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--color-navy)]">
          {t("title")}
        </h1>
        <p className="text-[var(--color-muted)] mt-2">
          {t("subtitle")}
        </p>
      </div>

      <FindSchemesWizard />
    </div>
  );
}
