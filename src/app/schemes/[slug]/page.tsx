import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ExternalLink, FileText, ShieldAlert } from "lucide-react";
import { getSchemeBySlug } from "@/lib/data/schemes";
import { describeRule } from "@/lib/eligibility/describe";
import type { RuleField, RuleOperator } from "@/lib/eligibility/types";
import { SaveSchemeButton } from "@/components/scheme/save-scheme-button";
import { SchemeFeedbackWidget } from "@/components/scheme/scheme-feedback-widget";
import { ReportIssueForm } from "@/components/scheme/report-issue-form";

interface SchemeDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 300; // ISR: scheme details rarely change, cache for 5 minutes

export async function generateMetadata({
  params,
}: SchemeDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const scheme = await getSchemeBySlug(slug);
  if (!scheme) return {};
  return {
    title: scheme.name,
    description: scheme.description,
    openGraph: { title: scheme.name, description: scheme.description },
  };
}

export default async function SchemeDetailPage({ params }: SchemeDetailPageProps) {
  const { slug } = await params;
  const scheme = await getSchemeBySlug(slug);

  if (!scheme) {
    notFound();
  }

  const requiredRules = scheme.eligibilityRules.filter((r) => r.required);
  const softRules = scheme.eligibilityRules.filter((r) => !r.required);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--color-navy)]/10 text-[var(--color-navy)]">
          {scheme.category.name}
        </span>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-black/5 text-[var(--color-muted)]">
          {scheme.govLevel === "central" ? "Central Government" : scheme.state}
        </span>
        {scheme.status === "verification_required" && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
            Verification Required
          </span>
        )}
      </div>

      <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--color-navy)]">
        {scheme.name}
      </h1>
      <p className="text-[var(--color-muted)] mt-2">{scheme.description}</p>

      <div className="flex flex-wrap gap-3 mt-6">
        <a
          href={scheme.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[var(--color-saffron)] rounded-md hover:opacity-90 transition-opacity"
        >
          Visit Official Application Portal
          <ExternalLink size={16} aria-hidden="true" />
        </a>
        <SaveSchemeButton
          schemeId={scheme.id}
          schemeName={scheme.name}
          variant="button"
        />
      </div>

      {/* Overview */}
      <section className="mt-10">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-ink)] mb-3">
          Overview
        </h2>
        <p className="text-[var(--color-ink)] leading-relaxed">{scheme.overview}</p>
      </section>

      {/* Benefits */}
      <section className="mt-8">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-ink)] mb-3">
          Benefits
        </h2>
        <p className="text-[var(--color-ink)] leading-relaxed">{scheme.benefits}</p>
      </section>

      {/* Eligibility */}
      <section className="mt-8">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-ink)] mb-3">
          Eligibility
        </h2>
        {requiredRules.length === 0 && softRules.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)]">
            Detailed eligibility criteria for this scheme are being verified.
            Please check the official source below.
          </p>
        ) : (
          <ul className="space-y-2">
            {requiredRules.map((r) => (
              <li key={r.id} className="flex items-start gap-2 text-sm text-[var(--color-ink)]">
                <CheckCircle2
                  size={16}
                  className="text-[var(--color-green)] mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                {describeRule(r.field as RuleField, r.operator as RuleOperator, r.value)}
              </li>
            ))}
            {softRules.map((r) => (
              <li key={r.id} className="flex items-start gap-2 text-sm text-[var(--color-ink)]">
                <ShieldAlert
                  size={16}
                  className="text-[var(--color-saffron)] mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                {describeRule(r.field as RuleField, r.operator as RuleOperator, r.value)}
                <span className="text-[var(--color-muted)]">(subject to verification)</span>
              </li>
            ))}
          </ul>
        )}
        <p className="text-xs text-[var(--color-muted)] mt-3">
          Use{" "}
          <Link href="/find-schemes" className="underline hover:text-[var(--color-navy)]">
            Find Schemes For Me
          </Link>{" "}
          to check your personal match against these criteria.
        </p>
      </section>

      {/* Documents */}
      {scheme.documents.length > 0 && (
        <section className="mt-8">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-ink)] mb-3">
            Documents Required
          </h2>
          <ul className="space-y-2">
            {scheme.documents.map((d) => (
              <li key={d.id} className="flex items-start gap-2 text-sm text-[var(--color-ink)]">
                <FileText size={16} className="text-[var(--color-navy)] mt-0.5 shrink-0" aria-hidden="true" />
                {d.name}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* How to Apply */}
      {scheme.applicationSteps.length > 0 && (
        <section className="mt-8">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-ink)] mb-3">
            How to Apply
          </h2>
          <ol className="space-y-4">
            {scheme.applicationSteps.map((step, i) => (
              <li key={step.id} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-navy)] text-white text-xs font-semibold">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-[var(--color-ink)] text-sm">{step.title}</p>
                  <p className="text-sm text-[var(--color-muted)] mt-0.5">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Citizen Feedback */}
      <section className="mt-10">
        <SchemeFeedbackWidget schemeId={scheme.id} />
      </section>

      {/* Official Source + Verification */}
      <section className="mt-10 pt-6 border-t border-[var(--color-border)]">
        <p className="text-sm text-[var(--color-muted)]">
          Official source:{" "}
          <a
            href={scheme.officialSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-navy)] underline"
          >
            {new URL(scheme.officialSourceUrl).hostname}
          </a>
        </p>
        {scheme.lastVerifiedAt && (
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Last verified: {new Date(scheme.lastVerifiedAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
        <p className="text-xs text-[var(--color-muted)] mt-4 leading-relaxed">
          Yojana Setu is not an official Government of India or State
          Government portal. Final eligibility, approval, and application
          decisions are determined by the concerned government authority.
        </p>
        <div className="mt-4">
          <ReportIssueForm schemeId={scheme.id} />
        </div>
      </section>
    </div>
  );
}
