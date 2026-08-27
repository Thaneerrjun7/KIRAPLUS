import type { Verdict } from "@/lib/verdict";
import { verdictLevelToRisk } from "@/lib/theme";

type Props = {
  verdict: Verdict;
};

export function VerdictBanner({ verdict }: Props) {
  const risk = verdictLevelToRisk(verdict.level);
  return (
    <div className={`border-l-4 border-risk-${risk} bg-risk-${risk}/10 p-4`}>
      <h3 className="font-display font-semibold">{verdict.headline}</h3>
      {verdict.detail !== verdict.headline && <p>{verdict.detail}</p>}
    </div>
  );
}
