// Six-factor breakdown -- sub-score, weight, contribution, the user's own raw figure per
// factor, per architecture.md's Dashboard component spec. Correctness lives in a semantic list
// (testable, accessible); design.md's Recharts bar chart is a supplementary visual only.

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AISYAH } from "@/lib/fixtures";
import { FactorBreakdown } from "./FactorBreakdown";

describe("FactorBreakdown", () => {
  it("renders all six factors with their subscore, weight, and contribution", () => {
    render(
      <FactorBreakdown
        subscores={AISYAH.expected.subscores}
        contributions={{
          debt_burden: 23.26,
          bnpl_exposure: 16.05,
          disposable_income: 14.07,
          emergency_buffer: 1.58,
          repayment_capacity: 12.0,
          savings_resilience: 1.33,
        }}
        features={AISYAH.expected.features}
      />
    );

    expect(screen.getByText("Debt burden")).toBeInTheDocument();
    expect(screen.getByText(/w25/)).toBeInTheDocument();
    expect(screen.getByText(/sub 93\.06/)).toBeInTheDocument();
    expect(screen.getByText(/fig 0\.0778/)).toBeInTheDocument();
    expect(screen.getByText("+23.26")).toBeInTheDocument();
  });

  it("renders each factor's strength as a badge", () => {
    render(
      <FactorBreakdown
        subscores={AISYAH.expected.subscores}
        contributions={{
          debt_burden: 23.26,
          bnpl_exposure: 16.05,
          disposable_income: 14.07,
          emergency_buffer: 1.58,
          repayment_capacity: 12.0,
          savings_resilience: 1.33,
        }}
        features={AISYAH.expected.features}
      />
    );
    expect(screen.getAllByText("[STRONG]").length).toBeGreaterThan(0);
    expect(screen.getAllByText("[CRITICAL]").length).toBeGreaterThan(0);
  });

  it("visually distinguishes the two weakest factors by lost contribution", () => {
    render(
      <FactorBreakdown
        subscores={AISYAH.expected.subscores}
        contributions={{
          debt_burden: 23.26,
          bnpl_exposure: 16.05,
          disposable_income: 14.07,
          emergency_buffer: 1.58,
          repayment_capacity: 12.0,
          savings_resilience: 1.33,
        }}
        features={AISYAH.expected.features}
      />
    );

    // emergency_buffer (15 - 1.58 = 13.42) and savings_resilience (8 - 1.33 = 6.67) lose the
    // most weight to a low subscore -- highest of the six lostContribution values.
    expect(screen.getByTestId("factor-emergency_buffer")).toHaveAttribute(
      "data-weakest",
      "true"
    );
    expect(screen.getByTestId("factor-debt_burden")).toHaveAttribute("data-weakest", "false");
    expect(screen.getByTestId("factor-emergency_buffer")).toHaveClass("bg-risk-high/10");
    expect(screen.getByTestId("factor-debt_burden")).not.toHaveClass("bg-risk-high/10");
  });
});
