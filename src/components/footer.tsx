import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="font-[family-name:var(--font-display)] font-bold text-[var(--color-navy)]">
              Yojana Setu
            </p>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              A bridge to government schemes.
            </p>
          </div>
          <nav aria-label="Footer navigation">
            <p className="text-sm font-semibold text-[var(--color-ink)] mb-2">Explore</p>
            <ul className="space-y-1.5 text-sm text-[var(--color-muted)]">
              <li><Link href="/schemes" className="hover:underline">Browse Schemes</Link></li>
              <li><Link href="/find-schemes" className="hover:underline">Find Schemes For Me</Link></li>
              <li><Link href="/categories" className="hover:underline">Categories</Link></li>
              <li><Link href="/about" className="hover:underline">About</Link></li>
            </ul>
          </nav>
          <div>
            <p className="text-sm font-semibold text-[var(--color-ink)] mb-2">Official Resources</p>
            <ul className="space-y-1.5 text-sm text-[var(--color-muted)]">
              <li><a href="https://www.myscheme.gov.in" target="_blank" rel="noopener noreferrer" className="hover:underline">myScheme (official)</a></li>
              <li><a href="https://www.india.gov.in" target="_blank" rel="noopener noreferrer" className="hover:underline">India.gov.in</a></li>
            </ul>
          </div>
        </div>

        <p className="mt-8 pt-6 border-t border-[var(--color-border)] text-xs leading-relaxed text-[var(--color-muted)]">
          Yojana Setu is an educational/community project and is not an official
          Government of India or State Government portal. Scheme information is
          provided for guidance. Final eligibility, approval, and application
          decisions are determined by the concerned government authority.
        </p>
      </div>
    </footer>
  );
}
