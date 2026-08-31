"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Heart } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SchemeCard } from "@/components/scheme/scheme-card";
import type { SavedSchemeEntry } from "@/lib/data/schemes";

interface SavedSchemesListProps {
  entries: SavedSchemeEntry[];
}

export function SavedSchemesList({ entries }: SavedSchemesListProps) {
  const t = useTranslations("Profile");
  const [items, setItems] = useState(entries);

  function handleUnsave(schemeId: string) {
    setItems((prev) => prev.filter((e) => e.scheme.id !== schemeId));
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-[var(--color-border)] rounded-lg">
        <Heart size={28} className="mx-auto text-[var(--color-muted)]" aria-hidden="true" />
        <p className="font-semibold text-[var(--color-ink)] mt-3">
          {t("emptyTitle")}
        </p>
        <p className="text-sm text-[var(--color-muted)] mt-1 max-w-sm mx-auto">
          {t("emptyBody")}
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          <Link
            href="/find-schemes"
            className="px-4 py-2 text-sm font-semibold text-white bg-[var(--color-navy)] rounded-md hover:bg-[var(--color-navy-light)] transition-colors"
          >
            {t("findSchemes")}
          </Link>
          <Link
            href="/schemes"
            className="px-4 py-2 text-sm font-semibold text-[var(--color-navy)] border border-[var(--color-navy)] rounded-md hover:bg-[var(--color-navy)]/5 transition-colors"
          >
            {t("browseAll")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {items.map(({ scheme }) => (
        <SchemeCard
          key={scheme.id}
          id={scheme.id}
          slug={scheme.slug}
          name={scheme.name}
          description={scheme.description}
          category={scheme.category.name}
          govLevel={scheme.govLevel as "central" | "state"}
          state={scheme.state}
          initialSaved={true}
          onToggled={(saved) => {
            if (!saved) handleUnsave(scheme.id);
          }}
        />
      ))}
    </div>
  );
}
