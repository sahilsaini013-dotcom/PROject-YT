"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function ClientTabs({ clientId }: { clientId: string }) {
  const pathname = usePathname();
  const base = `/coach/clients/${clientId}`;
  const tabs = [
    { href: base, label: "Overview" },
    { href: `${base}/workouts`, label: "Workouts" },
    { href: `${base}/check-ins`, label: "Check-ins" },
    { href: `${base}/nutrition`, label: "Nutrition" },
    { href: `${base}/progress`, label: "Progress" },
  ];

  return (
    <nav className="mt-6 flex gap-1 overflow-x-auto border-b border-border">
      {tabs.map((tab) => {
        const active =
          tab.href === base
            ? pathname === base
            : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              active
                ? "border-accent text-text"
                : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
