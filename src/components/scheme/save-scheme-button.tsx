"use client";

import { useEffect, useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { toggleSavedScheme, isSchemeSaved } from "@/lib/actions/saved-schemes";

interface SaveSchemeButtonProps {
  schemeId: string;
  schemeName: string;
  /**
   * Pass this only on pages that render fresh per request. Omit it on
   * ISR/cached pages (e.g. the scheme detail page) — the component will
   * fetch the real status itself after mount instead, so the shared cached
   * HTML never contains one visitor's saved state.
   */
  initialSaved?: boolean;
  variant: "icon" | "button";
  /** Called after a successful toggle, with the new saved state. */
  onToggled?: (saved: boolean) => void;
}

export function SaveSchemeButton({
  schemeId,
  schemeName,
  initialSaved,
  variant,
  onToggled,
}: SaveSchemeButtonProps) {
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const t = useTranslations("SaveScheme");
  const [saved, setSaved] = useState(initialSaved ?? false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (initialSaved !== undefined) return; // caller already knows the real state
    if (!isSignedIn) return;

    let cancelled = false;
    isSchemeSaved(schemeId).then((result) => {
      if (!cancelled) setSaved(result);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schemeId, isSignedIn]);

  function handleClick() {
    if (!isSignedIn) {
      // Keep people in the same flow instead of bouncing them to a full
      // page — the navbar's own login button uses the same modal.
      openSignIn();
      return;
    }

    const next = !saved;
    setSaved(next); // optimistic
    startTransition(async () => {
      try {
        const result = await toggleSavedScheme(schemeId);
        setSaved(result.saved);
        onToggled?.(result.saved);
      } catch {
        setSaved(!next); // revert on failure
      }
    });
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        aria-pressed={saved}
        aria-label={
          saved
            ? t("unsaveAriaLabel", { name: schemeName })
            : t("saveAriaLabel", { name: schemeName })
        }
        className="text-[var(--color-muted)] hover:text-[var(--color-saffron)] transition-colors disabled:opacity-60"
      >
        <Heart
          size={18}
          aria-hidden="true"
          className={saved ? "fill-[var(--color-saffron)] text-[var(--color-saffron)]" : ""}
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={saved}
      className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-[var(--color-navy)] border border-[var(--color-navy)] rounded-md hover:bg-[var(--color-navy)]/5 transition-colors disabled:opacity-60"
    >
      <Heart
        size={16}
        aria-hidden="true"
        className={saved ? "fill-[var(--color-navy)] text-[var(--color-navy)]" : ""}
      />
      {saved ? t("saved") : t("save")}
    </button>
  );
}
