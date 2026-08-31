import type { Metadata } from "next";
import { getCategories } from "@/lib/data/schemes";
import { adminSchemeDefaultValues } from "@/lib/validations/admin-scheme";
import { SchemeForm } from "@/components/admin/scheme-form";

export const metadata: Metadata = {
  title: "New Scheme",
};

export default async function NewSchemePage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-navy)] mb-6">
        New Scheme
      </h1>
      <SchemeForm
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        defaultValues={adminSchemeDefaultValues}
      />
    </div>
  );
}
