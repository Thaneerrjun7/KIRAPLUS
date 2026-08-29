// Persistent on every page, never a dismissible modal. See docs/design.md ("UI rules") and
// docs/MASTER-PACKAGE.md R1/R5 (synthetic-data disclosure is a stated risk mitigation, not
// cosmetic copy). Exact wording is Aliff's to tune -- no frozen string is mandated here.

import Link from "next/link";

export function SyntheticDataNotice() {
  return (
    <footer className="border-t border-border bg-surface px-4 py-2 text-center text-sm text-slate">
      This demo runs on{" "}
      <Link href="/about" className="underline hover:text-navy">
        synthetic data
      </Link>
      . No real financial information is stored or analyzed.
    </footer>
  );
}
