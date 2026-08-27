// Six-factor breakdown config -- weights from README.md's "Scoring methodology" table,
// featureKey mapping derived from the same table's "Feature" column matched against
// docs/API-CONTRACT.md §3's features object and lib/fixtures.ts's AISYAH expected values.

import { describe, expect, it } from "vitest";
import { classifyStrength, FACTORS, rankFactorsByLostContribution } from "./factorConfig";
import { AISYAH } from "./fixtures";

const AISYAH_CONTRIBUTIONS = {
  debt_burden: 23.26,
  bnpl_exposure: 16.05,
  disposable_income: 14.07,
  emergency_buffer: 1.58,
  repayment_capacity: 12.0,
  savings_resilience: 1.33,
};

describe("FACTORS", () => {
  it("weights sum to 100, matching the published methodology", () => {
    const total = FACTORS.reduce((sum, factor) => sum + factor.weight, 0);
    expect(total).toBe(100);
  });

  it("each factor's featureKey resolves to Aisyah's fixture value for that factor", () => {
    const debtBurden = FACTORS.find((f) => f.key === "debt_burden")!;
    expect(AISYAH.expected.features[debtBurden.featureKey]).toBe(AISYAH.expected.features.dsr);

    const emergencyBuffer = FACTORS.find((f) => f.key === "emergency_buffer")!;
    expect(AISYAH.expected.features[emergencyBuffer.featureKey]).toBe(
      AISYAH.expected.features.runway_months
    );
  });
});

describe("classifyStrength", () => {
  it("classifies a subscore below 25 as Critical", () => {
    expect(classifyStrength(10.56)).toBe("Critical");
  });

  it("classifies a subscore of 25-49 as Weak", () => {
    expect(classifyStrength(30)).toBe("Weak");
  });

  it("classifies a subscore of 50-74 as Adequate", () => {
    expect(classifyStrength(70.37)).toBe("Adequate");
  });

  it("classifies a subscore of 75+ as Strong", () => {
    expect(classifyStrength(93.06)).toBe("Strong");
  });
});

describe("rankFactorsByLostContribution", () => {
  it("ranks Aisyah's weakest factor (by weight - contribution) first", () => {
    const ranked = rankFactorsByLostContribution(AISYAH.expected.subscores, AISYAH_CONTRIBUTIONS);
    expect(ranked[0]).toMatchObject({ name: "Emergency buffer", rank: 1 });
    expect(ranked[5]).toMatchObject({ name: "Repayment capacity", rank: 6 });
  });

  it("carries the sub-score, weight, and contribution through unchanged", () => {
    const ranked = rankFactorsByLostContribution(AISYAH.expected.subscores, AISYAH_CONTRIBUTIONS);
    const debtBurden = ranked.find((f) => f.name === "Debt burden")!;
    expect(debtBurden.sub).toBe(93.06);
    expect(debtBurden.weight).toBe(25);
    expect(debtBurden.contribution).toBe(23.26);
  });
});
