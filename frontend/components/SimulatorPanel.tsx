// Purely presentational: receives the already-fetched 36-entry grid and reads grid[tenure - 1]
// locally -- no backend call happens here, which is what makes "no further requests while
// dragging the tenure slider" (architecture.md) true regardless of how often onTenureChange fires.

import type { GridEntry } from "@/lib/api";
import type { Band } from "@/lib/fixtures";
import { fmtRm } from "@/lib/format";
import { computeVerdict } from "@/lib/verdict";
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

  const alternatives = ALTERNATIVE_TENURES.filter((t) => t !== tenure).map(
    (t) => grid[t - 1]
  );

  return (
    <div>
      <label htmlFor="tenure-slider">Tenure: {tenure} months</label>
      <input
        id="tenure-slider"
        role="slider"
        type="range"
        min={1}
        max={36}
        value={tenure}
        onChange={(e) => onTenureChange(Number(e.target.value))}
      />

      <table>
        <thead>
          <tr>
            <th />
            <th>Before</th>
            <th>After</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Monthly payment</th>
            <td />
            <td>{fmtRm(current.monthly_sen)}</td>
          </tr>
          <tr>
            <th>Score</th>
            <td>{scoreBefore}</td>
            <td>{current.score}</td>
          </tr>
          <tr>
            <th>Band</th>
            <td>{bandBefore}</td>
            <td>{current.band}</td>
          </tr>
          <tr>
            <th>Buffer</th>
            <td>{fmtRm(bufferBeforeSen)}</td>
            <td>{fmtRm(bufferAfterSen)}</td>
          </tr>
        </tbody>
      </table>

      <VerdictBanner verdict={verdict} />

      <section>
        <h3>Alternatives</h3>
        <ul>
          {alternatives.map((alt) => (
            <li key={alt.tenure_months}>
              {alt.tenure_months} months: {fmtRm(alt.monthly_sen)}/month, score {alt.score} (
              {alt.delta >= 0 ? "+" : ""}
              {alt.delta})
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
