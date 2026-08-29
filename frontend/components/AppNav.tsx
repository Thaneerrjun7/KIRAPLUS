"use client";

// App shell nav: /dashboard, /commitments, /simulator, /profile. Desktop (>=768px): top bar, logo
// left, links right. Mobile (<768px): fixed bottom tab bar. Both render always; Tailwind
// breakpoint classes (not matchMedia) pick which is visible, so there's no hydration mismatch.
// See docs/superpowers/specs/2026-08-29-mobile-shell-redesign-design.md section B.

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalculatorIcon,
  ChartBarIcon,
  ListBulletIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const LINKS: { href: string; label: string; Icon: ComponentType<{ className?: string }> }[] = [
  { href: "/dashboard", label: "Dashboard", Icon: ChartBarIcon },
  { href: "/commitments", label: "Commitments", Icon: ListBulletIcon },
  { href: "/simulator", label: "Simulator", Icon: CalculatorIcon },
  { href: "/profile", label: "Profile", Icon: UserCircleIcon },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <>
      <nav
        aria-label="Main"
        className="sticky top-0 z-10 hidden items-center justify-between border-b border-border bg-surface px-4 py-3 md:flex"
      >
        <Link href="/" className="font-display text-lg font-semibold text-navy">
          KIRA+
        </Link>
        <div className="flex items-center gap-6">
          {LINKS.map(({ href, label, Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 border-b-2 pb-1 text-sm ${
                  active ? "border-teal font-semibold text-navy" : "border-transparent text-slate"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>

      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-10 flex border-t border-border bg-surface md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {LINKS.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs ${
                active ? "text-navy" : "text-slate"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
