// Computed client-side from the already-fetched /simulate/grid entry + the "before" Assessment,
// so the tenure slider never makes a second network call while dragging (docs/HANDOFF.md-style
// note: Aliff confirmed this duplication of a small piece of simulation_service's verdict logic
// on 2026-08-27, in place of a POST /simulate call per drag frame). Precedence and wording per
// docs/design.md ("Verdict banner rules"), mirroring docs/API-CONTRACT.md §4's own rule.

import type { Band } from "./fixtures";
import { fmtRm } from "./format";

export type VerdictLevel = "green" | "amber" | "red";

export type Verdict = {
  level: VerdictLevel;
  headline: string;
  detail: string;
};

type ComputeVerdictArgs = {
  bandBefore: Band;
  bandAfter: Band;
  deltaScore: number;
  bufferBeforeSen: number;
  monthlySen: number;
};

const BAND_RANK: Record<Band, number> = {
  "LOW RISK": 0,
  "MODERATE RISK": 1,
  "HIGH RISK": 2,
};

function shortName(band: Band): string {
  return band.replace(" RISK", "");
}

export function computeVerdict({
  bandBefore,
  bandAfter,
  deltaScore,
  bufferBeforeSen,
  monthlySen,
}: ComputeVerdictArgs): Verdict {
  const bufferAfterSen = bufferBeforeSen - monthlySen;
  if (bufferAfterSen < 0) {
    const shortfallSen = monthlySen - bufferBeforeSen;
    return {
      level: "red",
      headline: "This exceeds your monthly slack.",
      detail: `This commitment exceeds your monthly slack by ${fmtRm(shortfallSen)}.`,
    };
  }

  if (BAND_RANK[bandAfter] > BAND_RANK[bandBefore]) {
    const headline = `This would move you from ${shortName(bandBefore)} to ${shortName(bandAfter)} risk.`;
    return { level: "red", headline, detail: headline };
  }

  const pointsLost = Math.round(Math.abs(deltaScore));
  if (deltaScore <= -10) {
    return {
      level: "amber",
      headline: "Higher financial stress",
      detail: `This costs you ${pointsLost} points.`,
    };
  }

  return {
    level: "green",
    headline: "Manageable impact",
    detail: `This costs you ${pointsLost} points.`,
  };
}
