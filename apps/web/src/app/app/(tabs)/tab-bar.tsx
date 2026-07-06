"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/app", label: "Today", icon: "M3 12l9-9 9 9M5 10v10h14V10" },
  {
    href: "/app/check-in",
    label: "Check-in",
    icon: "M9 12l2 2 4-4M12 3a9 9 0 100 18 9 9 0 000-18z",
  },
  {
    href: "/app/nutrition",
    label: "Nutrition",
    icon: "M12 3v18M5 8c0 4 3 5 3 5M19 8c0 4-3 5-3 5",
  },
  {
    href: "/app/progress",
    label: "Progress",
    icon: "M4 19V5M4 19h16M8 15l3-4 3 3 4-6",
  },
  {
    href: "/app/messages",
    label: "Coach",
    icon: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  },
];

export function ClientTabBar() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-ink/95 backdrop-blur">
      <ul className="mx-auto flex max-w-md">
        {tabs.map((tab) => {
          const active =
            tab.href === "/app"
              ? pathname === "/app"
              : pathname.startsWith(tab.href);
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                className={`flex flex-col items-center gap-1 py-2.5 text-[11px] transition-colors ${
                  active ? "text-accent" : "text-text-muted hover:text-text"
                }`}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={tab.icon} />
                </svg>
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
