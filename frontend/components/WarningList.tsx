// Ordered warning list. Renders exactly what the backend sends (title, detail, level) with no
// per-code switch, so an unrecognized code (docs/API-CONTRACT.md §3) is handled generically for
// free rather than needing a special case.

import type { Warning } from "@/lib/api";
import { warningLevelToRisk } from "@/lib/theme";

type Props = {
  warnings: Warning[];
};

export function WarningList({ warnings }: Props) {
  if (warnings.length === 0) {
    return <p>No warnings -- nothing needs your attention right now.</p>;
  }

  return (
    <ul>
      {warnings.map((warning) => (
        <li key={warning.code} className={`border-l-4 border-risk-${warningLevelToRisk(warning.level)} pl-3`}>
          <p className="font-display font-semibold">{warning.title}</p>
          <p>{warning.detail}</p>
          {warning.lever && <p className="text-sm text-navy/70">{warning.lever}</p>}
        </li>
      ))}
    </ul>
  );
}
