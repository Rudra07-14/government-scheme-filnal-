import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const handleI18nRouting = createIntlMiddleware(routing);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

// Citizen routes that require sign-in, in both their unprefixed (English)
// and locale-prefixed (Hindi/Marathi) forms.
const isCitizenRoute = createRouteMatcher([
  "/profile(.*)",
  "/hi/profile(.*)",
  "/mr/profile(.*)",
]);

// Routes that intentionally stay outside locale routing entirely:
// admin and the API are unlocalized by design, and Clerk's sign-in/
// sign-up URLs are fixed via NEXT_PUBLIC_CLERK_SIGN_IN_URL/SIGN_UP_URL
// and must not be locale-prefixed.
const isUnlocalizedRoute = createRouteMatcher([
  "/admin(.*)",
  "/api(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (authFn, req) => {
  // Server-side gate. This is defense-in-depth, not the only check —
  // admin server actions/route handlers re-verify the role themselves
  // against our own `users` table (see lib/auth.ts), since role claims
  // must never be trusted from a single layer alone.
  if (isAdminRoute(req)) {
    const { userId, sessionClaims } = await authFn();
    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
    const role = (sessionClaims?.publicMetadata as { role?: string } | undefined)
      ?.role;
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (isCitizenRoute(req)) {
    await authFn.protect();
  }

  if (isUnlocalizedRoute(req)) {
    return NextResponse.next();
  }

  return handleI18nRouting(req);
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/", "/(api|trpc)(.*)"],
};
