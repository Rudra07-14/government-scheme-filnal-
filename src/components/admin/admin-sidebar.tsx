import Link from "next/link";
import { LayoutDashboard, ScrollText, Flag, MessageSquare } from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/schemes", label: "Schemes", icon: ScrollText },
  { href: "/admin/reports", label: "Reports", icon: Flag },
  { href: "/admin/feedback", label: "Feedback", icon: MessageSquare },
];

export function AdminSidebar() {
  return (
    <nav aria-label="Admin navigation" className="space-y-1">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-[var(--color-ink)] rounded-md hover:bg-black/5 transition-colors"
          >
            <Icon size={16} aria-hidden="true" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
