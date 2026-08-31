import Link from "next/link";
import { Heart } from "lucide-react";

interface SchemeCardProps {
  slug: string;
  name: string;
  description: string;
  category: string;
  govLevel: "central" | "state";
  state?: string | null;
}

export function SchemeCard({
  slug,
  name,
  description,
  category,
  govLevel,
  state,
}: SchemeCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-white p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--color-navy)]/10 text-[var(--color-navy)]">
            {category}
          </span>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-black/5 text-[var(--color-muted)]">
            {govLevel === "central" ? "Central" : state ?? "State"}
          </span>
        </div>
        <button
          type="button"
          aria-label={`Save ${name}`}
          className="text-[var(--color-muted)] hover:text-[var(--color-saffron)] transition-colors"
        >
          <Heart size={18} aria-hidden="true" />
        </button>
      </div>

      <Link href={`/schemes/${slug}`} className="group">
        <h3 className="font-[family-name:var(--font-display)] font-semibold text-[var(--color-ink)] group-hover:underline">
          {name}
        </h3>
        <p className="text-sm text-[var(--color-muted)] mt-1 line-clamp-2">
          {description}
        </p>
      </Link>

      <Link
        href={`/schemes/${slug}`}
        className="text-sm font-semibold text-[var(--color-navy)] hover:underline mt-auto"
      >
        View details →
      </Link>
    </div>
  );
}
