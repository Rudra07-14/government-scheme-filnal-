import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SaveSchemeButton } from "@/components/scheme/save-scheme-button";

interface SchemeCardProps {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  govLevel: "central" | "state";
  state?: string | null;
  initialSaved?: boolean;
  onToggled?: (saved: boolean) => void;
}

export function SchemeCard({
  id,
  slug,
  name,
  description,
  category,
  govLevel,
  state,
  initialSaved = false,
  onToggled,
}: SchemeCardProps) {
  const t = useTranslations("SchemeCard");

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-white p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--color-navy)]/10 text-[var(--color-navy)]">
            {category}
          </span>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-black/5 text-[var(--color-muted)]">
            {govLevel === "central" ? t("central") : state ?? t("state")}
          </span>
        </div>
        <SaveSchemeButton
          schemeId={id}
          schemeName={name}
          initialSaved={initialSaved}
          variant="icon"
          onToggled={onToggled}
        />
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
        {t("viewDetails")}
      </Link>
    </div>
  );
}
