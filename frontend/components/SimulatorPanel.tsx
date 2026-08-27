// Purely presentational: receives the already-fetched 36-entry grid and reads grid[tenure - 1]
// locally -- no backend call happens here, which is what makes "no further requests while
// dragging the tenure slider" (architecture.md) true regardless of how often onTenureChange fires.

import type { GridEntry } from "@/lib/api";
import type { Band } from "@/lib/fixtures";
import { fmtRm } from "@/lib/format";
import { computeVerdict } from "@/lib/verdict";
import { Card } from "./ui/Card";
import { StatTile } from "./ui/StatTile";
import { VerdictBanner } from "./VerdictBanner";

const ALTERNATIVE_TENURES = [6, 12, 18, 24];

type Props = {
  grid: GridEntry[];
  tenure: number;
  onTenureChange: (tenure: number) => void;
  bandBefore: Band;
  scoreBefore: number;
  bufferBeforeSen: number;
};

export function SimulatorPanel({
  grid,
  tenure,
  onTenureChange,
  bandBefore,
  scoreBefore,
  bufferBeforeSen,
}: Props) {
  const current = grid[tenure - 1];
  const bufferAfterSen = bufferBeforeSen - current.monthly_sen;
  const verdict = computeVerdict({
    bandBefore,
    bandAfter: current.band,
    deltaScore: current.delta,
    bufferBeforeSen,
    monthlySen: current.monthly_sen,
  });

  const alternatives = ALTERNATIVE_TENURES.filter((t) => t !== tenure).map((t) => grid[t - 1]);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <label htmlFor="tenure-slider" className="text-sm font-medium text-navy/80">
          Tenure: {tenure} months
        </label>
        <input
          id="tenure-slider"
          role="slider"
          type="range"
          min={1}
          max={36}
          value={tenure}
          onChange={(e) => onTenureChange(Number(e.target.value))}
          className="mt-2 w-full"
        />

        <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-3">
          <div>
            <p className="font-mono text-[11px] uppercase text-navy/40">Before</p>
            <div className="mt-2 flex flex-col gap-2">
              <StatTile label="Score" value={String(scoreBefore)} />
              <StatTile label="Band" value={bandBefore} />
              <StatTile label="Buffer" value={fmtRm(bufferBeforeSen)} />
            </div>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase text-navy/40">After</p>
            <div className="mt-2 flex flex-col gap-2">
              <StatTile label="Monthly payment" value={fmtRm(current.monthly_sen)} />
              <StatTile label="Score" value={String(current.score)} />
              <StatTile label="Band" value={current.band} />
              <StatTile
                label="Buffer"
                value={fmtRm(bufferAfterSen)}
                valueClassName={bufferAfterSen < bufferBeforeSen ? "text-risk-high" : ""}
              />
            </div>
          </div>
        </div>
      </Card>

      <VerdictBanner verdict={verdict} />

      <div>
        <h3 className="font-display text-lg">Alternatives</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {alternatives.map((alt) => (
            <Card key={alt.tenure_months} className="p-4">
              <p className="font-mono text-sm">{alt.tenure_months} months</p>
              <p className="mt-1 text-sm text-navy/70">{fmtRm(alt.monthly_sen)}/month</p>
              <p className="mt-1 font-mono text-sm">
                score {alt.score} ({alt.delta >= 0 ? "+" : ""}
                {alt.delta})
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
