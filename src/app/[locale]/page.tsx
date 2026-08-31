import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import {
  Search,
  Languages,
  ShieldCheck,
  FileCheck2,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { BridgeSteps } from "@/components/bridge-steps";
import { CategoryCard } from "@/components/scheme/category-card";
import { getCategories } from "@/lib/data/schemes";
import { getCategoryIcon } from "@/lib/icon-map";

export const revalidate = 300; // ISR: schemes/categories change rarely, avoid a DB hit on every request

const CATEGORY_TAGS = [
  { key: "tagEducation", slug: "education" },
  { key: "tagEmployment", slug: "employment-skills" },
  { key: "tagHealthcare", slug: "healthcare" },
  { key: "tagHousing", slug: "housing" },
] as const;

export default async function HomePage() {
  const [allCategories, t] = await Promise.all([
    getCategories(),
    getTranslations("HomePage"),
  ]);
  // Show the 5 with the most schemes first, so real content leads.
  const categories = [...allCategories]
    .sort((a, b) => b._count.schemes - a._count.schemes)
    .slice(0, 5);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-[var(--color-border)] bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 text-center">
          <p className="text-xs font-semibold tracking-wide uppercase text-[var(--color-saffron)]">
            {t("badge")}
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl sm:text-5xl font-extrabold tracking-tight text-[var(--color-navy)] text-balance">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-base sm:text-lg text-[var(--color-muted)] text-balance">
            {t("subtitle")}
          </p>

          {/* Search */}
          <form
            role="search"
            action="/schemes"
            method="GET"
            className="mt-8 max-w-xl mx-auto flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-white p-1.5 shadow-sm"
          >
            <Search size={18} className="ml-2 text-[var(--color-muted)]" aria-hidden="true" />
            <label htmlFor="scheme-search" className="sr-only">
              {t("searchAriaLabel")}
            </label>
            <input
              id="scheme-search"
              name="q"
              type="search"
              placeholder={t("searchPlaceholder")}
              className="flex-1 bg-transparent px-1 py-2 text-sm outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-[var(--color-navy)] rounded-md hover:bg-[var(--color-navy-light)] transition-colors"
            >
              {t("searchButton")}
            </button>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {CATEGORY_TAGS.map((tag) => (
              <Link
                key={tag.slug}
                href={`/schemes?category=${tag.slug}`}
                className="text-xs font-medium px-3 py-1.5 rounded-full border border-[var(--color-border)] bg-white hover:border-[var(--color-navy)] transition-colors"
              >
                {t(tag.key)}
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/find-schemes"
              className="px-6 py-3 text-sm font-semibold text-white bg-[var(--color-saffron)] rounded-md hover:opacity-90 transition-opacity"
            >
              {t("ctaFindSchemes")}
            </Link>
            <Link
              href="/schemes"
              className="px-6 py-3 text-sm font-semibold text-[var(--color-navy)] border border-[var(--color-navy)] rounded-md hover:bg-[var(--color-navy)]/5 transition-colors"
            >
              {t("ctaBrowseSchemes")}
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="bg-[var(--color-paper)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
          <div className="flex items-end justify-between mb-6">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-navy)]">
              {t("popularCategories")}
            </h2>
            <Link href="/categories" className="text-sm font-semibold text-[var(--color-navy)] hover:underline">
              {t("viewAll")}
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
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
      </section>

      {/* How It Works */}
      <section className="border-y border-[var(--color-border)] bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-navy)] mb-8">
            {t("howItWorks")}
          </h2>
          <BridgeSteps />
        </div>
      </section>

      {/* Why Yojana Setu */}
      <WhyUsSection />
    </>
  );
}

function WhyUsSection() {
  const t = useTranslations("HomePage");
  return (
    <section className="bg-[var(--color-paper)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-navy)] mb-8">
          {t("whyUsTitle")}
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="flex gap-3">
            <ShieldCheck className="text-[var(--color-green)] shrink-0" size={22} aria-hidden="true" />
            <div>
              <p className="font-semibold text-[var(--color-ink)]">{t("why1Title")}</p>
              <p className="text-sm text-[var(--color-muted)] mt-1">{t("why1Body")}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <FileCheck2 className="text-[var(--color-green)] shrink-0" size={22} aria-hidden="true" />
            <div>
              <p className="font-semibold text-[var(--color-ink)]">{t("why2Title")}</p>
              <p className="text-sm text-[var(--color-muted)] mt-1">{t("why2Body")}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Languages className="text-[var(--color-green)] shrink-0" size={22} aria-hidden="true" />
            <div>
              <p className="font-semibold text-[var(--color-ink)]">{t("why3Title")}</p>
              <p className="text-sm text-[var(--color-muted)] mt-1">{t("why3Body")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
