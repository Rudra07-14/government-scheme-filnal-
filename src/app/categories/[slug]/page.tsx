import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getCategoryBySlug, getSchemes } from "@/lib/data/schemes";
import { getSavedSchemeIds } from "@/lib/actions/saved-schemes";
import { getCategoryIcon } from "@/lib/icon-map";
import { SchemeCard } from "@/components/scheme/scheme-card";

/**
 * Renders the icon received as a prop rather than computing it inline in
 * the page's render body — the same pattern CategoryCard uses. Assigning a
 * function-call result to a capitalized local variable and rendering it as
 * a JSX tag in the same scope trips the React Compiler's
 * "component created during render" check.
 */
function CategoryIconBadge({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[var(--color-navy)]/10 text-[var(--color-navy)]">
      <Icon size={24} aria-hidden="true" />
    </span>
  );
}

interface CategoryDetailPageProps {
  params: Promise<{ slug: string }>;
}

// No `revalidate` export here deliberately: this page passes per-user saved
// state server-side via getSavedSchemeIds(), which is only safe on routes
// that render fresh per request. See the ISR caching note on /schemes.

export async function generateMetadata({
  params,
}: CategoryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description,
    openGraph: { title: category.name, description: category.description },
  };
}

export default async function CategoryDetailPage({
  params,
}: CategoryDetailPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const [schemes, savedSchemeIds] = await Promise.all([
    getSchemes({ category: slug }),
    getSavedSchemeIds(),
  ]);

  const savedSet = new Set(savedSchemeIds);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <Link
        href="/categories"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-navy)] transition-colors"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        All Categories
      </Link>

      <div className="flex items-start gap-4 mt-4 mb-8">
        <CategoryIconBadge icon={getCategoryIcon(category.icon)} />
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--color-navy)]">
            {category.name}
          </h1>
          <p className="text-[var(--color-muted)] mt-1">{category.description}</p>
        </div>
      </div>

      <p className="text-sm text-[var(--color-muted)] mb-6">
        {schemes.length} scheme{schemes.length === 1 ? "" : "s"} in this category
      </p>

      {schemes.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[var(--color-border)] rounded-lg">
          <p className="font-semibold text-[var(--color-ink)]">
            No schemes in this category yet.
          </p>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Check back soon, or browse all schemes instead.
          </p>
          <Link
            href="/schemes"
            className="inline-block mt-4 px-4 py-2 text-sm font-semibold text-white bg-[var(--color-navy)] rounded-md hover:bg-[var(--color-navy-light)] transition-colors"
          >
            Browse All Schemes
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
  );
}
