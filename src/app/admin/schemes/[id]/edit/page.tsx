import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories } from "@/lib/data/schemes";
import { getSchemeForEdit } from "@/lib/data/admin";
import type { AdminSchemeFormValues } from "@/lib/validations/admin-scheme";
import { SchemeForm } from "@/components/admin/scheme-form";

export const metadata: Metadata = {
  title: "Edit Scheme",
};

interface EditSchemePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSchemePage({ params }: EditSchemePageProps) {
  const { id } = await params;
  const [scheme, categories] = await Promise.all([
    getSchemeForEdit(id),
    getCategories(),
  ]);

  if (!scheme) {
    notFound();
  }

  const defaultValues: AdminSchemeFormValues = {
    name: scheme.name,
    slug: scheme.slug,
    description: scheme.description,
    overview: scheme.overview,
    benefits: scheme.benefits,
    govLevel: scheme.govLevel as "central" | "state",
    state: scheme.state ?? "",
    department: scheme.department,
    status: scheme.status as AdminSchemeFormValues["status"],
    officialSourceUrl: scheme.officialSourceUrl,
    applyUrl: scheme.applyUrl,
    categoryId: scheme.categoryId,
    eligibilityRules: scheme.eligibilityRules.map((r) => ({
      field: r.field as AdminSchemeFormValues["eligibilityRules"][number]["field"],
      operator: r.operator as AdminSchemeFormValues["eligibilityRules"][number]["operator"],
      value: r.value,
      required: r.required,
    })),
    documents: scheme.documents.map((d) => ({ name: d.name })),
    applicationSteps: scheme.applicationSteps.map((s) => ({
      title: s.title,
      detail: s.detail,
    })),
  };

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-navy)] mb-6">
        Edit Scheme
      </h1>
      <SchemeForm
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        defaultValues={defaultValues}
        schemeId={scheme.id}
      />
    </div>
  );
}
