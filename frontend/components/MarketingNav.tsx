"use client";

// Marketing shell nav: /, /about. Collapsible on mobile. The single "Dashboard" button stands in
// for the login slot rise-design.md reserves for auth -- there's no auth yet, and a returning
// user's most useful nav-level action is jumping straight to their data. /dashboard already
// renders "Save a profile first..." gracefully with no saved profile, so this is always a safe
// link. See docs/superpowers/specs/2026-08-29-mobile-shell-redesign-design.md section B.

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export function MarketingNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const aboutActive = pathname === "/about";
  const aboutClasses = aboutActive ? "font-semibold text-navy" : "text-slate";

  return (
    <nav
      aria-label="Main"
      className="sticky top-0 z-10 border-b border-border bg-surface px-4 py-3"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link href="/" className="font-display text-lg font-semibold text-navy">
          KIRA+
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link href="/about" className={`text-sm ${aboutClasses}`}>
            About
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-surface"
          >
            Dashboard
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="-m-2.5 p-2.5 md:hidden"
        >
          {open ? (
            <XMarkIcon className="h-6 w-6 text-navy" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-navy" />
          )}
        </button>
      </div>

      {open && (
        <div className="mt-3 flex flex-col gap-3 border-t border-border pt-3 md:hidden">
          <Link href="/about" onClick={() => setOpen(false)} className={`text-sm ${aboutClasses}`}>
            About
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="rounded-xl bg-navy px-4 py-2 text-center text-sm font-semibold text-surface"
          >
            Dashboard
          </Link>
        </div>
      )}
    </nav>
  );
}
