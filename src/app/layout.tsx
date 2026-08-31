import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: {
    default: "Yojana Setu — Government Schemes, Made Simple",
    template: "%s | Yojana Setu",
  },
  description:
    "Discover government schemes, understand eligibility, prepare required documents, and reach the official application portal.",
  openGraph: {
    title: "Yojana Setu — Government Schemes, Made Simple",
    description:
      "Discover government schemes, understand eligibility, and apply through official portals.",
    type: "website",
  },
};

/**
 * This is the ONE true root layout (App Router only allows <html>/<body>
 * here). It stays outside the src/app/[locale] segment so it can wrap
 * admin/api/sign-in routes too, which are deliberately unlocalized.
 *
 * getLocale()/getMessages() resolve via src/i18n/request.ts: on routes
 * under [locale] they reflect the URL's language; on admin/api/sign-in
 * routes (no [locale] param) they fall back to the default locale ("en").
 * That fallback is exactly what makes it safe to provide translations
 * globally here rather than duplicating this provider per route group —
 * Navbar and Footer are shared chrome and read the same translation
 * context everywhere they render.
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang={locale} className="h-full antialiased">
        <body className="min-h-full flex flex-col">
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
