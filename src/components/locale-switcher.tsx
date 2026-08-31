"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { setUserLanguage } from "@/lib/actions/user-preferences";

/**
 * Switches the active locale for the current path (e.g. /schemes ->
 * /hi/schemes) using next-intl's locale-aware router, so navigation state
 * isn't lost. For signed-in citizens, also persists the choice to their
 * `users.language` column so it's remembered on their next visit — this is
 * best-effort (fire-and-forget) and never blocks the locale switch itself.
 */
export function LocaleSwitcher() {
  const t = useTranslations("Navbar");
  const tLang = useTranslations("Language");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const nextLocale = e.target.value as (typeof routing.locales)[number];
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
    // Best-effort persistence; failures (e.g. signed out) are expected and ignored.
    setUserLanguage(nextLocale).catch(() => {});
  }

  return (
    <>
      <label htmlFor="lang-select" className="sr-only">
        {t("selectLanguage")}
      </label>
      <select
        id="lang-select"
        value={locale}
        onChange={handleChange}
        disabled={isPending}
        className="text-sm border border-[var(--color-border)] rounded-md px-2 py-1.5 bg-white disabled:opacity-60"
      >
        {routing.locales.map((l) => (
          <option key={l} value={l}>
            {tLang(l)}
          </option>
        ))}
      </select>
    </>
  );
}
