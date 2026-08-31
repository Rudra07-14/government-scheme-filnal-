import { defineRouting } from "next-intl/routing";

/**
 * English is the default and stays unprefixed ("/schemes"); Hindi and
 * Marathi get a URL prefix ("/hi/schemes", "/mr/schemes"). This keeps
 * every existing English URL working unchanged while adding the other
 * two languages.
 *
 * Admin (`/admin/**`), the API routes, and Clerk's sign-in/sign-up pages
 * intentionally stay outside this routing entirely — see proxy.ts.
 */
export const routing = defineRouting({
  locales: ["en", "hi", "mr"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export type AppLocale = (typeof routing.locales)[number];
