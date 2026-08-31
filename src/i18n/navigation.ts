import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Drop-in replacements for next/link and next/navigation that
 * automatically add/remove the locale prefix. Every citizen-facing page
 * and component under src/app/[locale]/** must import Link/redirect/
 * useRouter from here instead of "next/link" or "next/navigation", or
 * links will lose the current language when clicked.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
