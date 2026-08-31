import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { Landmark, Menu } from "lucide-react";

const navLinks = [
  { href: "/schemes", label: "Schemes" },
  { href: "/find-schemes", label: "Find Schemes" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
];

export function Navbar() {
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
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <label htmlFor="lang-select" className="sr-only">
            Select language
          </label>
          <select
            id="lang-select"
            className="text-sm border border-[var(--color-border)] rounded-md px-2 py-1.5 bg-white"
            defaultValue="en"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="mr">मराठी</option>
          </select>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 text-sm font-semibold text-white bg-[var(--color-navy)] rounded-md hover:bg-[var(--color-navy-light)] transition-colors">
                Login
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link
              href="/profile"
              className="text-sm font-medium text-[var(--color-ink)] hover:underline"
            >
              Profile
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
