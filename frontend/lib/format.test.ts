// Written before the implementation, per frontend/docs/testing.md's TDD
// pyramid (tier 1: lib/format.ts, the cheapest and most exhaustive layer).
// These are expected to FAIL until fmtRm/fmtRmCents/toSen are implemented --
// that's the point. Numbers mirror docs/API-CONTRACT.md §0's own examples
// and lib/fixtures.ts's Aisyah persona (buffer_sen: 95000).

import { describe, expect, it } from "vitest";
import { AISYAH } from "./fixtures";
import { fmtRm, fmtRmCents, toSen } from "./format";

describe("fmtRm", () => {
  it("formats a whole-ringgit sen amount with no decimals", () => {
    expect(fmtRm(95000)).toBe("RM950");
  });

  it("formats Aisyah's buffer_sen fixture the same way", () => {
    expect(fmtRm(AISYAH.expected.features.buffer_sen)).toBe("RM950");
  });

  it("formats zero", () => {
    expect(fmtRm(0)).toBe("RM0");
  });
});

describe("fmtRmCents", () => {
  it("formats a whole-ringgit sen amount with cents", () => {
    expect(fmtRmCents(95000)).toBe("RM950.00");
  });

  it("formats a sen amount with non-zero cents", () => {
    expect(fmtRmCents(95050)).toBe("RM950.50");
  });
});

describe("toSen", () => {
  it("converts a whole-ringgit float to sen", () => {
    expect(toSen(950.0)).toBe(95000);
  });

  it("converts a ringgit float with cents to sen", () => {
    expect(toSen(950.5)).toBe(95050);
  });

  it("round-trips through fmtRmCents' inverse", () => {
    expect(toSen(9.99)).toBe(999);
  });
});
