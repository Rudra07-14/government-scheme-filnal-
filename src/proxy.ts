import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isCitizenRoute = createRouteMatcher(["/profile(.*)"]);

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
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/", "/(api|trpc)(.*)"],
};
