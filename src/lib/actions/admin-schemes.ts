"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import {
  adminSchemeSchema,
  schemeStatusValues,
  type AdminSchemeFormValues,
} from "@/lib/validations/admin-scheme";

function slugifyFallback(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Prisma throws a generic P2002 for any unique-constraint violation without
 * saying which field in plain language. The only unique column on Scheme is
 * `slug`, so this is unambiguous here - but we still check `meta.target` in
 * case that ever changes, rather than assuming.
 */
function rethrowAsFriendlyError(error: unknown, slug: string): never {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    const target = error.meta?.target;
    const targetsSlug =
      Array.isArray(target) && target.includes("slug");
    if (targetsSlug || !target) {
      throw new Error(
        `A scheme with the slug "${slug}" already exists. Choose a different slug (or check whether this scheme was already created).`
      );
    }
  }
  // Preserve the original error for anything unexpected so it still shows
  // up in server logs, but don't leak raw Prisma internals to the client.
  console.error("createScheme/updateScheme failed:", error);
  throw new Error("Something went wrong saving this scheme. Please try again.");
}

/** Shared shape for the nested creates used by both create and update. */
function toNestedCreates(values: AdminSchemeFormValues) {
  return {
    eligibilityRules: {
      create: values.eligibilityRules.map((r) => ({
        field: r.field,
        operator: r.operator,
        value: r.value,
        required: r.required,
      })),
    },
    documents: {
      create: values.documents.map((d, i) => ({ name: d.name, order: i })),
    },
    applicationSteps: {
      create: values.applicationSteps.map((s, i) => ({
        title: s.title,
        detail: s.detail,
        order: i,
      })),
    },
  };
}

export async function createScheme(
  rawValues: AdminSchemeFormValues
): Promise<{ id: string; slug: string }> {
  await requireAdmin();
  const values = adminSchemeSchema.parse(rawValues);
  const slug = values.slug || slugifyFallback(values.name);

  let scheme;
  try {
    scheme = await db.scheme.create({
      data: {
        name: values.name,
        slug,
        description: values.description,
        overview: values.overview,
        benefits: values.benefits,
        govLevel: values.govLevel,
        state: values.govLevel === "state" ? values.state : null,
        department: values.department,
        status: values.status,
        officialSourceUrl: values.officialSourceUrl,
        applyUrl: values.applyUrl,
        categoryId: values.categoryId,
        lastVerifiedAt: new Date(),
        ...toNestedCreates(values),
      },
    });
  } catch (error) {
    rethrowAsFriendlyError(error, slug);
  }

  revalidatePath("/admin/schemes");
  revalidatePath("/schemes");
  return { id: scheme.id, slug: scheme.slug };
}

export async function updateScheme(
  id: string,
  rawValues: AdminSchemeFormValues
): Promise<{ id: string; slug: string }> {
  await requireAdmin();
  const values = adminSchemeSchema.parse(rawValues);
  const slug = values.slug || slugifyFallback(values.name);

  // Child rows (rules/documents/steps) are edited as a whole set in the
  // form, so replacing them in a transaction is simpler and less
  // error-prone than diffing which individual rows changed.
  let scheme;
  try {
    scheme = await db.$transaction(async (tx) => {
      await tx.eligibilityRule.deleteMany({ where: { schemeId: id } });
      await tx.schemeDocument.deleteMany({ where: { schemeId: id } });
      await tx.applicationStep.deleteMany({ where: { schemeId: id } });

      return tx.scheme.update({
        where: { id },
        data: {
          name: values.name,
          slug,
          description: values.description,
          overview: values.overview,
          benefits: values.benefits,
          govLevel: values.govLevel,
          state: values.govLevel === "state" ? values.state : null,
          department: values.department,
          status: values.status,
          officialSourceUrl: values.officialSourceUrl,
          applyUrl: values.applyUrl,
          categoryId: values.categoryId,
          ...toNestedCreates(values),
        },
      });
    });
  } catch (error) {
    rethrowAsFriendlyError(error, slug);
  }

  revalidatePath("/admin/schemes");
  revalidatePath("/schemes");
  revalidatePath(`/schemes/${scheme.slug}`);
  return { id: scheme.id, slug: scheme.slug };
}

export async function updateSchemeStatus(
  id: string,
  status: (typeof schemeStatusValues)[number]
): Promise<void> {
  await requireAdmin();
  const scheme = await db.scheme.update({
    where: { id },
    data: {
      status,
      ...(status === "active" ? { lastVerifiedAt: new Date() } : {}),
    },
  });

  revalidatePath("/admin/schemes");
  revalidatePath("/schemes");
  revalidatePath(`/schemes/${scheme.slug}`);
}
