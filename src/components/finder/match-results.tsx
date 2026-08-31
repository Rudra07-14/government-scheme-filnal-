import { useTranslations } from "next-intl";
import { CheckCircle2, RotateCcw, ShieldAlert, Search } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { SchemeMatch } from "@/lib/actions/match-schemes";

interface MatchResultsProps {
  matches: SchemeMatch[];
  consideredCount: number;
  onEditAnswers: () => void;
}

function MatchBadge({ status }: { status: SchemeMatch["match"]["status"] }) {
  const t = useTranslations("MatchResults");
  if (status === "likely_match") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--color-green)]/10 text-[var(--color-green)]">
        <CheckCircle2 size={13} aria-hidden="true" />
        {t("likelyMatch")}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--color-saffron)]/10 text-[var(--color-saffron)]">
      <ShieldAlert size={13} aria-hidden="true" />
      {t("needsVerification")}
    </span>
  );
}

export function MatchResults({ matches, consideredCount, onEditAnswers }: MatchResultsProps) {
  const t = useTranslations("MatchResults");

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-navy)]">
            {matches.length === 0
              ? t("noneFound")
              : t("someFound", { count: matches.length })}
          </h2>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            {t("checkedAgainst", { count: consideredCount })}
          </p>
        </div>
        <button
          type="button"
          onClick={onEditAnswers}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[var(--color-navy)] border border-[var(--color-navy)] rounded-md hover:bg-[var(--color-navy)]/5 transition-colors shrink-0"
        >
          <RotateCcw size={15} aria-hidden="true" />
          {t("editAnswers")}
        </button>
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[var(--color-border)] rounded-lg mt-6">
          <Search size={28} className="mx-auto text-[var(--color-muted)]" aria-hidden="true" />
          <p className="font-semibold text-[var(--color-ink)] mt-3">
            {t("emptyTitle")}
          </p>
          <p className="text-sm text-[var(--color-muted)] mt-1 max-w-sm mx-auto">
            {t("emptyBody")}
          </p>
          <Link
            href="/schemes"
            className="inline-block mt-4 px-4 py-2 text-sm font-semibold text-white bg-[var(--color-navy)] rounded-md hover:bg-[var(--color-navy-light)] transition-colors"
          >
            {t("browseAll")}
          </Link>
        </div>
      ) : (
        <ul className="space-y-4 mt-6">
          {matches.map(({ scheme, match }) => (
            <li
              key={scheme.id}
              className="border border-[var(--color-border)] rounded-lg bg-white p-5"
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--color-navy)]/10 text-[var(--color-navy)]">
                    {scheme.category.name}
                  </span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-black/5 text-[var(--color-muted)]">
                    {scheme.govLevel === "central" ? t("central") : (scheme.state ?? t("state"))}
                  </span>
                </div>
                <MatchBadge status={match.status} />
              </div>

              <Link href={`/schemes/${scheme.slug}`} className="group block mt-3">
                <h3 className="font-[family-name:var(--font-display)] font-semibold text-[var(--color-ink)] group-hover:underline">
                  {scheme.name}
                </h3>
                <p className="text-sm text-[var(--color-muted)] mt-1 line-clamp-2">
                  {scheme.description}
                </p>
              </Link>

              {match.passed.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
                  <p className="text-xs font-semibold text-[var(--color-ink)] mb-1.5">
                    {t("whyMatches")}
                  </p>
                  <ul className="flex flex-wrap gap-x-4 gap-y-1">
                    {match.passed.map((c) => (
                      <li
                        key={c.ruleId}
                        className="flex items-center gap-1.5 text-xs text-[var(--color-muted)]"
                      >
                        <CheckCircle2
                          size={12}
                          className="text-[var(--color-green)]"
                          aria-hidden="true"
                        />
                        {c.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {match.softFlags.length > 0 && (
                <p className="text-xs text-[var(--color-saffron)] mt-2 flex items-center gap-1.5">
                  <ShieldAlert size={12} aria-hidden="true" />
                  {t("softFlags", { count: match.softFlags.length })}
                </p>
              )}

              <div className="flex items-center justify-between mt-3">
                <Link
                  href={`/schemes/${scheme.slug}`}
                  className="text-sm font-semibold text-[var(--color-navy)] hover:underline"
                >
                  {t("viewDetails")}
                </Link>
                <span className="text-xs text-[var(--color-muted)]">
                  {t("matchScore", { score: match.matchScore })}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-[var(--color-muted)] mt-8 leading-relaxed">
        {t("footnote")}
      </p>
    </div>
  );
}
