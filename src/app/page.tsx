import Link from "next/link";
import {
  Search,
  Languages,
  ShieldCheck,
  FileCheck2,
} from "lucide-react";
import { BridgeSteps } from "@/components/bridge-steps";
import { CategoryCard } from "@/components/scheme/category-card";
import { getCategories } from "@/lib/data/schemes";
import { getCategoryIcon } from "@/lib/icon-map";

export const revalidate = 300; // ISR: schemes/categories change rarely, avoid a DB hit on every request

export default async function HomePage() {
  const allCategories = await getCategories();
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
            Not an official government portal — a guide to one
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl sm:text-5xl font-extrabold tracking-tight text-[var(--color-navy)] text-balance">
            Government Schemes, Made Simple.
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-base sm:text-lg text-[var(--color-muted)] text-balance">
            Discover government schemes, understand eligibility, prepare the
            required documents, and reach the official application portal.
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
              Search government schemes
            </label>
            <input
              id="scheme-search"
              name="q"
              type="search"
              placeholder="Search government schemes..."
              className="flex-1 bg-transparent px-1 py-2 text-sm outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-[var(--color-navy)] rounded-md hover:bg-[var(--color-navy-light)] transition-colors"
            >
              Search
            </button>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {[
              { label: "Education", slug: "education" },
              { label: "Employment", slug: "employment-skills" },
              { label: "Healthcare", slug: "healthcare" },
              { label: "Housing", slug: "housing" },
            ].map((tag) => (
              <Link
                key={tag.slug}
                href={`/schemes?category=${tag.slug}`}
                className="text-xs font-medium px-3 py-1.5 rounded-full border border-[var(--color-border)] bg-white hover:border-[var(--color-navy)] transition-colors"
              >
                {tag.label}
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/find-schemes"
              className="px-6 py-3 text-sm font-semibold text-white bg-[var(--color-saffron)] rounded-md hover:opacity-90 transition-opacity"
            >
              Find Schemes for Me
            </Link>
            <Link
              href="/schemes"
              className="px-6 py-3 text-sm font-semibold text-[var(--color-navy)] border border-[var(--color-navy)] rounded-md hover:bg-[var(--color-navy)]/5 transition-colors"
            >
              Browse Schemes
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="bg-[var(--color-paper)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
          <div className="flex items-end justify-between mb-6">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-navy)]">
              Popular Categories
            </h2>
            <Link href="/categories" className="text-sm font-semibold text-[var(--color-navy)] hover:underline">
              View all
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
            How Yojana Setu Works
          </h2>
          <BridgeSteps />
        </div>
      </section>

      {/* Why Yojana Setu */}
      <section className="bg-[var(--color-paper)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-navy)] mb-8">
            Why Use Yojana Setu?
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="flex gap-3">
              <ShieldCheck className="text-[var(--color-green)] shrink-0" size={22} aria-hidden="true" />
              <div>
                <p className="font-semibold text-[var(--color-ink)]">Clear, explainable matches</p>
                <p className="text-sm text-[var(--color-muted)] mt-1">
                  Every recommendation shows exactly why it matched — and why one didn&apos;t.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <FileCheck2 className="text-[var(--color-green)] shrink-0" size={22} aria-hidden="true" />
              <div>
                <p className="font-semibold text-[var(--color-ink)]">Verified information</p>
                <p className="text-sm text-[var(--color-muted)] mt-1">
                  Every scheme links back to its official government source.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Languages className="text-[var(--color-green)] shrink-0" size={22} aria-hidden="true" />
              <div>
                <p className="font-semibold text-[var(--color-ink)]">Available in your language</p>
                <p className="text-sm text-[var(--color-muted)] mt-1">
                  English, Hindi, and Marathi — built for accessibility from the start.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
