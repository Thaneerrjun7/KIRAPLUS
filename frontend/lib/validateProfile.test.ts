// Mirrors docs/API-CONTRACT.md §2's validation bounds client-side, using the exact same
// messages, so ProfileForm can show an inline error before ever calling saveProfile.

import { describe, expect, it } from "vitest";
import { validateProfile } from "./validateProfile";

function baseProfile(overrides: Partial<Parameters<typeof validateProfile>[0]> = {}) {
  return {
    income_sen: 450000,
    fixed_expenses_sen: 198400,
    var_expenses_sen: 121600,
    savings_sen: 225000,
    loan_monthly_sen: 10000,
    ...overrides,
  };
}

describe("validateProfile", () => {
  it("returns null for a valid profile", () => {
    expect(validateProfile(baseProfile())).toBeNull();
  });

  it("rejects zero income with the exact contract message", () => {
    expect(validateProfile(baseProfile({ income_sen: 0 }))).toEqual({
      field: "income_sen",
      message: "Income must be greater than 0.",
    });
  });

  it("rejects negative income", () => {
    expect(validateProfile(baseProfile({ income_sen: -1 }))).toEqual({
      field: "income_sen",
      message: "Income must be greater than 0.",
    });
  });

  it("rejects a negative money field with the field named in the message", () => {
    expect(validateProfile(baseProfile({ savings_sen: -1 }))).toEqual({
      field: "savings_sen",
      message: "savings_sen cannot be negative.",
    });
  });

  it("rejects expenses over 10x income", () => {
    expect(
      validateProfile(
        baseProfile({ income_sen: 1000, fixed_expenses_sen: 6000, var_expenses_sen: 6000 })
      )
    ).toEqual({
      field: "fixed_expenses_sen",
      message: "Expenses look implausibly high — please check.",
    });
  });
});
