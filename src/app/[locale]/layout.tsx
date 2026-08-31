import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

/**
 * The <html>/<body> shell already lives in the true root layout
 * (src/app/layout.tsx) so admin/api/sign-in can share it too. This layout
 * only needs to: reject an unsupported locale segment, and call
 * setRequestLocale so pages under here can use next-intl's APIs during
 * static rendering without triggering a dynamic-render fallback.
 */
export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return children;
}
