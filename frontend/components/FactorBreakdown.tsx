// Six-factor breakdown: sub-score, weight, contribution, the user's own raw figure per factor.
// The semantic list below is the correctness-bearing element; the Recharts horizontal bar
// (design.md's "Chart choices") is a supplementary at-a-glance visual alongside it.

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import type { Features, Subscores } from "@/lib/fixtures";
import { classifyStrength, FACTORS } from "@/lib/factorConfig";

type Props = {
  subscores: Subscores;
  contributions: Record<string, number>;
  features: Features;
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
    <div>
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

      <table>
        <thead>
          <tr>
            <th>Factor</th>
            <th>Sub-score</th>
            <th>Weight</th>
            <th>Contribution</th>
            <th>Your figure</th>
            <th>Strength</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.key}
              data-testid={`factor-${row.key}`}
              data-weakest={weakestKeys.has(row.key)}
              className={weakestKeys.has(row.key) ? "bg-risk-high/10 font-semibold" : undefined}
            >
              <td>{row.label}</td>
              <td>{row.subscore.toFixed(2)}</td>
              <td>{row.weight}</td>
              <td>{row.contribution.toFixed(2)}</td>
              <td>{row.rawValue}</td>
              <td>{classifyStrength(row.subscore)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
