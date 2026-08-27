import Link from "next/link";

const LINKS = [
  { href: "/profile", label: "Profile" },
  { href: "/commitments", label: "Commitments" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/simulator", label: "Simulator" },
  { href: "/about", label: "About" },
];

export function Nav() {
  return (
    <nav
      aria-label="Main"
      className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-navy/10 bg-paper px-4 py-3"
    >
      <Link href="/" className="font-display text-lg font-semibold text-navy">
        KIRA+
      </Link>
      {LINKS.map((link) => (
        <Link key={link.href} href={link.href} className="text-navy/80 hover:text-navy">
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
