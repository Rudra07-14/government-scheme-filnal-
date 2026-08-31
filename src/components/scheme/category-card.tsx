import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
  schemeCount: number;
}

export function CategoryCard({
  slug,
  name,
  description,
  icon: Icon,
  schemeCount,
}: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${slug}`}
      className="group flex flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-white p-5 transition-all hover:border-[var(--color-navy)] hover:shadow-md"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--color-navy)]/10 text-[var(--color-navy)]">
        <Icon size={20} aria-hidden="true" />
      </span>
      <div>
        <h3 className="font-[family-name:var(--font-display)] font-semibold text-[var(--color-ink)]">
          {name}
        </h3>
        <p className="text-sm text-[var(--color-muted)] mt-1">{description}</p>
      </div>
      <span className="text-xs font-medium text-[var(--color-navy)] mt-auto">
        {schemeCount} scheme{schemeCount === 1 ? "" : "s"}
      </span>
    </Link>
  );
}
