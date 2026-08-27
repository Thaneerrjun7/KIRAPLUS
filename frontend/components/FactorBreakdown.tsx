// Six-factor breakdown: sub-score, weight, contribution, the user's own raw figure per factor.
// The ledger-line list below is the correctness-bearing element; the Recharts horizontal bar
// (design.md's "Chart choices") is kept alongside it as a quick visual comparison (2026-08-27
// decision: keep both rather than dropping the chart in favor of the ledger lines alone).

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import type { Features, Subscores } from "@/lib/fixtures";
import { classifyStrength, FACTORS, type Strength } from "@/lib/factorConfig";
import { Badge } from "./ui/Badge";
import { Card } from "./ui/Card";

type Props = {
  subscores: Subscores;
  contributions: Record<string, number>;
  features: Features;
};

const STRENGTH_RISK: Record<Strength, "high" | "moderate" | "neutral" | "low"> = {
  Critical: "high",
  Weak: "moderate",
  Adequate: "neutral",
  Strong: "low",
};

export function FactorBreakdown({ subscores, contributions, features }: Props) {
  const rows = FACTORS.map((factor) => ({
    ...factor,
    subscore: subscores[factor.key],
    contribution: contributions[factor.key],
    lostContribution: factor.weight - contributions[factor.key],
    rawValue: features[factor.featureKey],
  }));

  const weakestKeys = new Set(
    [...rows]
      .sort((a, b) => b.lostContribution - a.lostContribution)
      .slice(0, 2)
      .map((row) => row.key)
  );

  return (
    <Card label="SIX-FACTOR BREAKDOWN">
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <BarChart data={rows} layout="vertical" margin={{ left: 24 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis type="category" dataKey="label" width={140} />
            <Bar dataKey="subscore" fill="#0F5C56" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-col gap-2.5">
        <div className="flex items-baseline font-mono text-[11px] text-navy/40">
          <span className="flex-1">FACTOR &middot; WEIGHT &middot; SUB-SCORE &middot; YOUR FIGURE</span>
          <span className="w-20 text-right">CONTRIB.</span>
          <span className="w-24 text-right">STRENGTH</span>
        </div>
        {rows.map((row) => {
          const strength = classifyStrength(row.subscore);
          const weakest = weakestKeys.has(row.key);
          return (
            <div
              key={row.key}
              data-testid={`factor-${row.key}`}
              data-weakest={weakest}
              className={`flex items-baseline gap-1.5 ${weakest ? "bg-risk-high/10 font-semibold" : ""}`}
            >
              <span className="text-sm">
                <span>{row.label}</span>{" "}
                <span className="font-mono text-[11px] text-navy/45">
                  w{row.weight} &middot; sub {row.subscore.toFixed(2)} &middot; fig {row.rawValue}
                </span>
              </span>
              <span className="mb-0.5 flex-1 border-b border-dotted border-navy/30" />
              <span className="w-20 text-right font-mono text-sm">
                {row.contribution >= 0 ? "+" : ""}
                {row.contribution.toFixed(2)}
              </span>
              <span className="w-24 text-right">
                <Badge risk={STRENGTH_RISK[strength]}>{strength.toUpperCase()}</Badge>
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
