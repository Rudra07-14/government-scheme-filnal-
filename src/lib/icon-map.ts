import {
  GraduationCap,
  Briefcase,
  Sprout,
  HeartPulse,
  Home,
  Users,
  PersonStanding,
  Accessibility,
  Store,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  GraduationCap,
  Briefcase,
  Sprout,
  HeartPulse,
  Home,
  Users,
  PersonStanding,
  Accessibility,
  Store,
  Wallet,
};

export function getCategoryIcon(name: string): LucideIcon {
  return CATEGORY_ICONS[name] ?? Store;
}
