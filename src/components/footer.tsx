import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function Footer() {
  const t = await getTranslations("Footer");

  return (
    <footer className="border-t border-[var(--color-border)] bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="font-[family-name:var(--font-display)] font-bold text-[var(--color-navy)]">
              Yojana Setu
            </p>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              {t("tagline")}
            </p>
          </div>
          <nav aria-label="Footer navigation">
            <p className="text-sm font-semibold text-[var(--color-ink)] mb-2">{t("explore")}</p>
            <ul className="space-y-1.5 text-sm text-[var(--color-muted)]">
              <li><Link href="/schemes" className="hover:underline">{t("browseSchemes")}</Link></li>
              <li><Link href="/find-schemes" className="hover:underline">{t("findSchemes")}</Link></li>
              <li><Link href="/categories" className="hover:underline">{t("categories")}</Link></li>
              <li><Link href="/about" className="hover:underline">{t("about")}</Link></li>
            </ul>
          </nav>
          <div>
            <p className="text-sm font-semibold text-[var(--color-ink)] mb-2">{t("officialResources")}</p>
            <ul className="space-y-1.5 text-sm text-[var(--color-muted)]">
              <li><a href="https://www.myscheme.gov.in" target="_blank" rel="noopener noreferrer" className="hover:underline">myScheme (official)</a></li>
              <li><a href="https://www.india.gov.in" target="_blank" rel="noopener noreferrer" className="hover:underline">India.gov.in</a></li>
            </ul>
          </div>
        </div>

        <p className="mt-8 pt-6 border-t border-[var(--color-border)] text-xs leading-relaxed text-[var(--color-muted)]">
          {t("disclaimer")}
        </p>
      </div>
    </footer>
  );
}
