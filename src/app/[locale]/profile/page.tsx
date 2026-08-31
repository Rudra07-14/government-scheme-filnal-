import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CalendarDays, Globe, ShieldCheck } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { getOrCreateAppUser } from "@/lib/auth";
import { getSavedSchemesForUser } from "@/lib/data/schemes";
import { SavedSchemesList } from "@/components/profile/saved-schemes-list";

export const metadata: Metadata = {
  title: "My Profile",
};

export default async function ProfilePage() {
  // proxy.ts already gates this route with authFn.protect(), but every
  // page/action that reads or writes user-specific data re-checks itself —
  // defense-in-depth, not reliance on a single layer.
  const appUser = await getOrCreateAppUser();
  if (!appUser) {
    redirect("/sign-in");
  }

  const [clerkUser, savedEntries, t, locale] = await Promise.all([
    currentUser(),
    getSavedSchemesForUser(appUser.id),
    getTranslations("Profile"),
    getLocale(),
  ]);

  const LANGUAGE_LABELS: Record<string, string> = {
    en: t("languageEnglish"),
    hi: t("languageHindi"),
    mr: t("languageMarathi"),
  };

  const displayName =
    clerkUser?.username ??
    clerkUser?.firstName ??
    clerkUser?.primaryEmailAddress?.emailAddress ??
    "Citizen";

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <div className="flex items-start gap-4 mb-10">
        {clerkUser?.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={clerkUser.imageUrl}
            alt=""
            className="h-16 w-16 rounded-full border border-[var(--color-border)]"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-[var(--color-navy)]/10 flex items-center justify-center text-[var(--color-navy)] font-[family-name:var(--font-display)] text-2xl font-bold">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}

        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-navy)]">
            {displayName}
          </h1>
          {clerkUser?.primaryEmailAddress && (
            <p className="text-sm text-[var(--color-muted)] mt-0.5">
              {clerkUser.primaryEmailAddress.emailAddress}
            </p>
          )}

          <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3">
            <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
              <ShieldCheck size={13} aria-hidden="true" />
              {appUser.role === "admin" ? t("administrator") : t("citizen")} {t("accountSuffix")}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
              <Globe size={13} aria-hidden="true" />
              {LANGUAGE_LABELS[appUser.language] ?? appUser.language}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
              <CalendarDays size={13} aria-hidden="true" />
              {t("memberSince", {
                date: new Date(appUser.createdAt).toLocaleDateString(locale, {
                  year: "numeric",
                  month: "long",
                }),
              })}
            </span>
          </div>
        </div>
      </div>

      <section>
        <div className="flex items-end justify-between mb-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-ink)]">
            {t("savedSchemes")}
          </h2>
          <span className="text-sm text-[var(--color-muted)]">
            {t("savedCount", { count: savedEntries.length })}
          </span>
        </div>
        <SavedSchemesList entries={savedEntries} />
      </section>
    </div>
  );
}
