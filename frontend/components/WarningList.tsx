// Ordered warning list. Renders exactly what the backend sends (title, detail, level) with no
// per-code switch, so an unrecognized code (docs/API-CONTRACT.md §3) is handled generically for
// free rather than needing a special case.

import { ExclamationCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
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
    <ul className="flex flex-col gap-4">
      {warnings.map((warning) => {
        const Icon = warning.level === "red" ? ExclamationTriangleIcon : ExclamationCircleIcon;
        return (
          <li
            key={warning.code}
            className={`flex gap-3 border-l-4 border-risk-${warningLevelToRisk(warning.level)} pl-3`}
          >
            <Icon
              className={`mt-0.5 h-5 w-5 shrink-0 text-risk-${warningLevelToRisk(warning.level)}`}
            />
            <div>
              <p className="font-display font-semibold">{warning.title}</p>
              <p>{warning.detail}</p>
              {warning.lever && <p className="text-sm text-slate">{warning.lever}</p>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
