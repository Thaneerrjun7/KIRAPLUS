// Persistent on every page, never a dismissible modal. See docs/design.md ("UI rules") and
// docs/MASTER-PACKAGE.md R1/R5 (synthetic-data disclosure is a stated risk mitigation, not
// cosmetic copy). Exact wording is Aliff's to tune -- no frozen string is mandated here.

export function SyntheticDataNotice() {
  return (
    <footer className="border-t border-navy/10 bg-paper px-4 py-2 text-center text-sm text-navy/70">
      This demo runs on synthetic data. No real financial information is stored or analyzed.
    </footer>
  );
}
