import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { getTranslations } from "next-intl/server";
import { Landmark, Menu } from "lucide-react";
import NextLink from "next/link";
import { Link } from "@/i18n/navigation";
import { getCurrentAppUser } from "@/lib/auth";
import { LocaleSwitcher } from "@/components/locale-switcher";

export async function Navbar() {
  const [appUser, t] = await Promise.all([
    getCurrentAppUser(),
    getTranslations("Navbar"),
  ]);
  const isAdmin = appUser?.role === "admin";

  const navLinks = [
    { href: "/schemes", label: t("schemes") },
    { href: "/find-schemes", label: t("findSchemes") },
    { href: "/categories", label: t("categories") },
    { href: "/about", label: t("about") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-paper)]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-navy)] text-white">
            <Landmark size={18} strokeWidth={2} aria-hidden="true" />
          </span>
          <span className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-navy)]">
            Yojana Setu
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-[var(--color-ink)] rounded-md hover:bg-black/5 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            // Plain next/link, deliberately not the locale-aware Link: /admin
            // lives outside the [locale] segment (see proxy.ts), so it must
            // never get a locale prefix like /hi/admin.
            <NextLink
              href="/admin"
              className="px-3 py-2 text-sm font-medium text-[var(--color-saffron)] rounded-md hover:bg-black/5 transition-colors"
            >
              {t("admin")}
            </NextLink>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <LocaleSwitcher />

          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 text-sm font-semibold text-white bg-[var(--color-navy)] rounded-md hover:bg-[var(--color-navy-light)] transition-colors">
                {t("login")}
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link
              href="/profile"
              className="text-sm font-medium text-[var(--color-ink)] hover:underline"
            >
              {t("profile")}
            </Link>
            <UserButton />
          </SignedIn>
        </div>

        <button
          type="button"
          aria-label="Open menu"
          className="md:hidden p-2 rounded-md hover:bg-black/5"
        >
          <Menu size={22} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
