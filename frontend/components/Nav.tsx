"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalculatorIcon,
  ChartBarIcon,
  InformationCircleIcon,
  ListBulletIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import type { ComponentType } from "react";

const LINKS: { href: string; label: string; Icon: ComponentType<{ className?: string }> }[] = [
  { href: "/profile", label: "Profile", Icon: UserCircleIcon },
  { href: "/commitments", label: "Commitments", Icon: ListBulletIcon },
  { href: "/dashboard", label: "Dashboard", Icon: ChartBarIcon },
  { href: "/simulator", label: "Simulator", Icon: CalculatorIcon },
  { href: "/about", label: "About", Icon: InformationCircleIcon },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="sticky top-0 z-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-navy/10 bg-paper px-4 py-3"
    >
      <Link href="/" className="font-display text-lg font-semibold text-navy">
        KIRA+
      </Link>
      {LINKS.map(({ href, label, Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-1.5 border-b-2 pb-1 text-sm ${
              active ? "border-teal font-semibold text-navy" : "border-transparent text-navy/70"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
