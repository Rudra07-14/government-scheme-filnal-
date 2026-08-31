"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { routing } from "@/i18n/routing";

/**
 * Persists a citizen's chosen language to their `users.language` column so
 * it's remembered on their next visit/device. Silently does nothing when
 * signed out — anonymous visitors keep their language via next-intl's own
 * locale-prefixed URL / cookie handling instead, with no DB write needed.
 *
 * This never gates or blocks the locale switch on the client: it's called
 * fire-and-forget by LocaleSwitcher, since the switch itself must work
 * regardless of auth state or network hiccups.
 */
export async function setUserLanguage(locale: string): Promise<void> {
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    return;
  }

  const { userId } = await auth();
  if (!userId) return;

  // Upsert rather than update: local dev without the Clerk webhook wired up
  // (see getOrCreateAppUser in lib/auth.ts) can mean a signed-in citizen has
  // no `users` row yet — this must not fail just because the webhook hasn't
  // caught up.
  await db.user.upsert({
    where: { id: userId },
    update: { language: locale },
    create: { id: userId, language: locale },
  });
}
