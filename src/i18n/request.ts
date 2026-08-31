import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

/**
 * Resolves the locale for the current request and loads its messages.
 *
 * On routes under src/app/[locale]/**, `requestLocale` comes from that
 * route segment. On routes with no [locale] segment (admin, api,
 * sign-in/sign-up), it resolves to `undefined` and falls back to the
 * default locale ("en") below — which is exactly what we want, since
 * those routes are deliberately English-only (see i18n wiring notes).
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
