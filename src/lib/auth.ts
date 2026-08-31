import { auth } from "@clerk/nextjs/server";
import { db } from "./db";

export type AppRole = "citizen" | "admin";

/**
 * Resolves the current user's application role from OUR OWN `users` table,
 * not from client-supplied data. The row is created/kept in sync via the
 * Clerk webhook (see app/api/webhooks/clerk/route.ts).
 *
 * Every admin-only server action or route handler must call this (or
 * requireAdmin below) itself — never rely solely on middleware or on the
 * admin link being hidden in the UI.
 */
export async function getCurrentAppUser() {
  const { userId } = await auth();
  if (!userId) return null;

  return db.user.findUnique({ where: { id: userId } });
}

export async function requireAdmin() {
  const user = await getCurrentAppUser();
  if (!user || user.role !== "admin") {
    throw new Error("Forbidden: admin role required");
  }
  return user;
}

export async function requireCitizen() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized: sign-in required");
  }
  return userId;
}
