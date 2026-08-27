// Computed client-side from the already-fetched /simulate/grid entry + the "before" Assessment,
// so the tenure slider never makes a second network call while dragging. Rules are the exact
// published precedence from docs/design.md ("Verdict banner rules"), which mirror
// docs/API-CONTRACT.md §4's own simulate() verdict logic -- Aliff confirmed duplicating this
// small piece client-side (2026-08-27) rather than calling POST /simulate per drag frame.

import { describe, expect, it } from "vitest";
import { computeVerdict } from "./verdict";

const BANNED_PHRASES = [
  "you cannot afford",
  "you should",
  "we recommend",
  "bad decision",
];

function expectNoBannedWording(text: string) {
  const lower = text.toLowerCase();
  for (const phrase of BANNED_PHRASES) {
    expect(lower).not.toContain(phrase);
  }
}

describe("computeVerdict", () => {
  it("returns red when the buffer would go negative, naming the exact shortfall", () => {
    const verdict = computeVerdict({
      bandBefore: "MODERATE RISK",
      bandAfter: "MODERATE RISK",
      deltaScore: -5,
      bufferBeforeSen: 10000,
      monthlySen: 15000,
    });
    expect(verdict.level).toBe("red");
    expect(verdict.detail).toBe("This commitment exceeds your monthly slack by RM50.");
    expectNoBannedWording(verdict.headline + verdict.detail);
  });

  it("returns red when the band worsens, naming both bands", () => {
    const verdict = computeVerdict({
      bandBefore: "MODERATE RISK",
      bandAfter: "HIGH RISK",
      deltaScore: -20,
      bufferBeforeSen: 100000,
      monthlySen: 20000,
    });
    expect(verdict.level).toBe("red");
    expect(verdict.headline).toBe("This would move you from MODERATE to HIGH risk.");
    expectNoBannedWording(verdict.headline + verdict.detail);
  });

  it("prioritizes a negative buffer over a worsening band", () => {
    const verdict = computeVerdict({
      bandBefore: "MODERATE RISK",
      bandAfter: "HIGH RISK",
      deltaScore: -20,
      bufferBeforeSen: 10000,
      monthlySen: 50000,
    });
    expect(verdict.detail).toContain("exceeds your monthly slack");
  });

  it("returns amber when the score drops 10 or more but the band holds", () => {
    const verdict = computeVerdict({
      bandBefore: "MODERATE RISK",
      bandAfter: "MODERATE RISK",
      deltaScore: -14,
      bufferBeforeSen: 95000,
      monthlySen: 20000,
    });
    expect(verdict.level).toBe("amber");
    expect(verdict.headline).toBe("Higher financial stress");
    expect(verdict.detail).toBe("This costs you 14 points.");
    expectNoBannedWording(verdict.headline + verdict.detail);
  });

  it("returns green when the score drops less than 10", () => {
    const verdict = computeVerdict({
      bandBefore: "MODERATE RISK",
      bandAfter: "MODERATE RISK",
      deltaScore: -6,
      bufferBeforeSen: 95000,
      monthlySen: 10000,
    });
    expect(verdict.level).toBe("green");
    expect(verdict.headline).toBe("Manageable impact");
    expect(verdict.detail).toBe("This costs you 6 points.");
    expectNoBannedWording(verdict.headline + verdict.detail);
  });
});
