// Six-factor breakdown config. Weights and factor->feature mapping come from README.md's
// "Scoring methodology" table; classification thresholds are a frontend-only display
// convenience (not part of docs/API-CONTRACT.md) for design.md's Strong/Adequate/Weak/Critical
// bar coloring -- no exact thresholds are published, so this uses even quartiles of the 0-100
// subscore range. Tune here if Aliff wants different cut points.

import type { Features, Subscores } from "./fixtures";

export type FactorKey = keyof Subscores;

export type FactorConfig = {
  key: FactorKey;
  label: string;
  weight: number;
  featureKey: keyof Features;
  // README.md "Scoring methodology" table -- published, not derived.
  featureDescription: string;
  zeroAt: string;
  fullAt: string;
};

export const FACTORS: FactorConfig[] = [
  {
    key: "debt_burden",
    label: "Debt burden",
    weight: 25,
    featureKey: "dsr",
    featureDescription: "debt service ratio",
    zeroAt: "0.45",
    fullAt: "0.05",
  },
  {
    key: "bnpl_exposure",
    label: "BNPL exposure",
    weight: 20,
    featureKey: "bnpl_ratio",
    featureDescription: "BNPL ÷ income",
    zeroAt: "0.20",
    fullAt: "0.02",
  },
  {
    key: "disposable_income",
    label: "Disposable income",
    weight: 20,
    featureKey: "buffer_ratio",
    featureDescription: "buffer ÷ income",
    zeroAt: "0.00",
    fullAt: "0.30",
  },
  {
    key: "emergency_buffer",
    label: "Emergency buffer",
    weight: 15,
    featureKey: "runway_months",
    featureDescription: "savings ÷ monthly outflow",
    zeroAt: "0 months",
    fullAt: "6 months",
  },
  {
    key: "repayment_capacity",
    label: "Repayment capacity",
    weight: 12,
    featureKey: "coverage",
    featureDescription: "buffer ÷ debt service",
    zeroAt: "0×",
    fullAt: "2×",
  },
  {
    key: "savings_resilience",
    label: "Savings resilience",
    weight: 8,
    featureKey: "savings_months",
    featureDescription: "savings ÷ income",
    zeroAt: "0 months",
    fullAt: "3 months",
  },
];

export type Strength = "Critical" | "Weak" | "Adequate" | "Strong";

export function classifyStrength(subscore: number): Strength {
  if (subscore < 25) return "Critical";
  if (subscore < 50) return "Weak";
  if (subscore < 75) return "Adequate";
  return "Strong";
}

export type RankedFactor = {
  name: string;
  sub: number;
  weight: number;
  contribution: number;
  rank: number;
};

// Weakest-lost-the-most-weight first -- the natural "explain this one first" order for the
// llm_service.explain payload's `factors` array (docs/API-CONTRACT.md §5).
export function rankFactorsByLostContribution(
  subscores: Record<string, number>,
  contributions: Record<string, number>
): RankedFactor[] {
  return FACTORS.map((factor) => ({
    name: factor.label,
    sub: subscores[factor.key],
    weight: factor.weight,
    contribution: contributions[factor.key],
    lostContribution: factor.weight - contributions[factor.key],
  }))
    .sort((a, b) => b.lostContribution - a.lostContribution)
    .map(({ lostContribution: _lostContribution, ...rest }, index) => ({
      ...rest,
      rank: index + 1,
    }));
}
