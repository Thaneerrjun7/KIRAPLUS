import { ExclamationCircleIcon, ExclamationTriangleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import type { Verdict } from "@/lib/verdict";
import { verdictLevelToRisk } from "@/lib/theme";

type Props = {
  verdict: Verdict;
};

const ICONS = {
  red: ExclamationTriangleIcon,
  amber: ExclamationCircleIcon,
  green: CheckCircleIcon,
} as const;

export function VerdictBanner({ verdict }: Props) {
  const risk = verdictLevelToRisk(verdict.level);
  const Icon = ICONS[verdict.level];
  return (
    <div className={`flex gap-3 border-l-4 border-risk-${risk} bg-risk-${risk}/10 p-4`}>
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 text-risk-${risk}`} />
      <div>
        <h3 className="font-display font-semibold">{verdict.headline}</h3>
        {verdict.detail !== verdict.headline && <p>{verdict.detail}</p>}
      </div>
    </div>
  );
}
