"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateAppUser } from "@/lib/auth";

export interface ToggleSavedSchemeResult {
  saved: boolean;
}

/**
 * Toggles whether the signed-in citizen has saved a given scheme.
 * Relies on the (userId, schemeId) unique constraint on SavedScheme rather
 * than a separate "exists" check + insert, to avoid a race between the two.
 */
export async function toggleSavedScheme(
  schemeId: string
): Promise<ToggleSavedSchemeResult> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized: sign-in required");
  }

  // Defensive: ensures the FK target exists even if the Clerk webhook
  // hasn't synced this user yet (see getOrCreateAppUser).
  await getOrCreateAppUser();

  const existing = await db.savedScheme.findUnique({
    where: { userId_schemeId: { userId, schemeId } },
  });

  if (existing) {
    await db.savedScheme.delete({ where: { id: existing.id } });
    return { saved: false };
  }

  await db.savedScheme.create({ data: { userId, schemeId } });
  return { saved: true };
}

/**
 * Whether the current citizen has saved a specific scheme. Used to
 * self-hydrate SaveSchemeButton on pages that are ISR-cached (like the
 * scheme detail page) — the cached HTML must stay identical for every
 * visitor, so per-user saved state can only be fetched client-side after
 * the shell loads, never baked into the server-rendered props there.
 */
export async function isSchemeSaved(schemeId: string): Promise<boolean> {
  const { userId } = await auth();
  if (!userId) return false;

  const existing = await db.savedScheme.findUnique({
    where: { userId_schemeId: { userId, schemeId } },
  });
  return Boolean(existing);
}

/**
 * Returns the set of scheme IDs the current citizen has saved, as a plain
 * array (safe to pass from Server to Client Components). Returns an empty
 * array when signed out — callers don't need to branch on auth state.
 *
 * Only safe to call from a page that renders fresh per request (no ISR/
 * `revalidate`) — otherwise this bakes one user's saved list into HTML
 * that gets served to every visitor from cache.
 */
export async function getSavedSchemeIds(): Promise<string[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const rows = await db.savedScheme.findMany({
    where: { userId },
    select: { schemeId: true },
  });

  return rows.map((r) => r.schemeId);
}
