import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getCategories } from "@/lib/data/schemes";
import { getCategoryIcon } from "@/lib/icon-map";
import { CategoryCard } from "@/components/scheme/category-card";

export const revalidate = 300; // ISR: categories change rarely, avoid a DB hit on every request

export const metadata: Metadata = {
  title: "Browse Categories",
  description:
    "Explore government welfare and development schemes by category — education, healthcare, housing, agriculture, and more.",
};

export default async function CategoriesPage() {
  const [categories, t] = await Promise.all([
    getCategories(),
    getTranslations("CategoriesPage"),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--color-navy)]">
          {t("title")}
        </h1>
        <p className="text-[var(--color-muted)] mt-2">
          {t("count", { count: categories.length })}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((c) => (
          <CategoryCard
            key={c.slug}
            slug={c.slug}
            name={c.name}
            description={c.description}
            icon={getCategoryIcon(c.icon)}
            schemeCount={c._count.schemes}
          />
        ))}
      </div>
    </div>
  );
}
