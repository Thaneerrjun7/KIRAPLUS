// Hand-rolled SVG semicircle arc -- design.md's "Chart choices": a gauge is one arc + a fill
// percentage, not worth a charting library.

import { bandToRisk, type Band } from "@/lib/theme";
import { scoreDashOffset } from "@/lib/scoreGaugeMath";

const RADIUS = 80;
const CX = 100;
const CY = 100;
const CIRCUMFERENCE = Math.PI * RADIUS;
const ARC_PATH = `M ${CX - RADIUS} ${CY} A ${RADIUS} ${RADIUS} 0 0 1 ${CX + RADIUS} ${CY}`;

type Props = {
  score: number;
  band: Band;
};

export function ScoreGauge({ score, band }: Props) {
  const risk = bandToRisk(band);
  return (
    <div className="inline-flex flex-col items-center">
      <svg viewBox="0 0 200 110" width={200} height={110}>
        <path
          d={ARC_PATH}
          fill="none"
          strokeWidth={14}
          strokeLinecap="round"
          className="stroke-navy/10"
        />
        <path
          d={ARC_PATH}
          fill="none"
          strokeWidth={14}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={scoreDashOffset(score, CIRCUMFERENCE)}
          className={`score-gauge-fill stroke-risk-${risk}`}
        />
        <text x={CX} y={CY - 5} textAnchor="middle" className="font-mono text-3xl fill-navy">
          {score}
        </text>
      </svg>
      <span className={`font-display text-sm tracking-wide text-risk-${risk}`}>{band}</span>
    </div>
  );
}
