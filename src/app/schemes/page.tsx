import type { Metadata } from "next";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { getAvailableStates, getCategories, getSchemes } from "@/lib/data/schemes";
import { getSavedSchemeIds } from "@/lib/actions/saved-schemes";
import { SchemeCard } from "@/components/scheme/scheme-card";

export const metadata: Metadata = {
  title: "Browse Government Schemes",
  description:
    "Search and filter central and state government schemes by category, state, and department.",
};

interface SchemesPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    state?: string;
    govLevel?: string;
  }>;
}

export default async function SchemesPage({ searchParams }: SchemesPageProps) {
  const params = await searchParams;
  const { q, category, state, govLevel } = params;

  const [schemes, categories, states, savedSchemeIds] = await Promise.all([
    getSchemes({
      query: q,
      category,
      state,
      govLevel: govLevel === "central" || govLevel === "state" ? govLevel : undefined,
    }),
    getCategories(),
    getAvailableStates(),
    getSavedSchemeIds(),
  ]);

  const savedSet = new Set(savedSchemeIds);

  const hasActiveFilters = Boolean(q || category || state || govLevel);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--color-navy)]">
          Browse Government Schemes
        </h1>
        <p className="text-[var(--color-muted)] mt-2">
          {schemes.length} scheme{schemes.length === 1 ? "" : "s"} available
        </p>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        {/* Filters */}
        <aside aria-label="Filters" className="space-y-6">
          <form method="GET" className="space-y-6">
            <div>
              <label htmlFor="q" className="sr-only">
                Search schemes
              </label>
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
                  aria-hidden="true"
                />
                <input
                  id="q"
                  name="q"
                  type="search"
                  defaultValue={q}
                  placeholder="Search schemes..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-[var(--color-border)] rounded-md bg-white"
                />
              </div>
            </div>

            <fieldset>
              <legend className="text-sm font-semibold text-[var(--color-ink)] mb-2 flex items-center gap-1.5">
                <SlidersHorizontal size={14} aria-hidden="true" /> Category
              </legend>
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
                  <input
                    type="radio"
                    name="category"
                    value=""
                    defaultChecked={!category}
                  />
                  All categories
                </label>
                {categories.map((c) => (
                  <label
                    key={c.slug}
                    className="flex items-center justify-between gap-2 text-sm text-[var(--color-ink)]"
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="category"
                        value={c.slug}
                        defaultChecked={category === c.slug}
                      />
                      {c.name}
                    </span>
                    <span className="text-xs text-[var(--color-muted)]">
                      {c._count.schemes}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {states.length > 0 && (
              <fieldset>
                <legend className="text-sm font-semibold text-[var(--color-ink)] mb-2">
                  State
                </legend>
                <select
                  name="state"
                  defaultValue={state ?? ""}
                  className="w-full text-sm border border-[var(--color-border)] rounded-md px-2 py-1.5 bg-white"
                >
                  <option value="">All states / Central</option>
                  {states.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </fieldset>
            )}

            <fieldset>
              <legend className="text-sm font-semibold text-[var(--color-ink)] mb-2">
                Government Level
              </legend>
              <select
                name="govLevel"
                defaultValue={govLevel ?? ""}
                className="w-full text-sm border border-[var(--color-border)] rounded-md px-2 py-1.5 bg-white"
              >
                <option value="">All</option>
                <option value="central">Central</option>
                <option value="state">State</option>
              </select>
            </fieldset>

            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-semibold text-white bg-[var(--color-navy)] rounded-md hover:bg-[var(--color-navy-light)] transition-colors"
            >
              Apply Filters
            </button>
            {hasActiveFilters && (
              <Link
                href="/schemes"
                className="block text-center text-sm text-[var(--color-muted)] hover:underline"
              >
                Clear all filters
              </Link>
            )}
          </form>
        </aside>

        {/* Results */}
        <div>
          {schemes.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-[var(--color-border)] rounded-lg">
              <p className="font-semibold text-[var(--color-ink)]">
                No schemes match your search.
              </p>
              <p className="text-sm text-[var(--color-muted)] mt-1">
                Try a different keyword or clear your filters.
              </p>
              <Link
                href="/schemes"
                className="inline-block mt-4 px-4 py-2 text-sm font-semibold text-white bg-[var(--color-navy)] rounded-md hover:bg-[var(--color-navy-light)] transition-colors"
              >
                Browse All Schemes
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {schemes.map((s) => (
                <SchemeCard
                  key={s.id}
                  id={s.id}
                  slug={s.slug}
                  name={s.name}
                  description={s.description}
                  category={s.category.name}
                  govLevel={s.govLevel as "central" | "state"}
                  state={s.state}
                  initialSaved={savedSet.has(s.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
