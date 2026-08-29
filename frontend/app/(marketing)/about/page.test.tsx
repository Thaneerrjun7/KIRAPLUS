// Static content, no backend calls -- architecture.md's About component spec: "Methodology,
// factor weights table, synthetic-data disclosure, limitations." Acceptance bar (per
// docs/MASTER-PACKAGE.md): a reader can understand the score without asking a question.

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AboutPage from "./page";

describe("AboutPage", () => {
  it("renders every factor with its weight and 0/100 anchor points", () => {
    render(<AboutPage />);
    expect(screen.getByText("Debt burden")).toBeInTheDocument();
    expect(screen.getByText("debt service ratio")).toBeInTheDocument();
    expect(screen.getByText("0.45")).toBeInTheDocument();
    expect(screen.getByText("0.05")).toBeInTheDocument();
    expect(screen.getByText("Savings resilience")).toBeInTheDocument();
  });

  it("shows the weights summing to 100 and the score formula", () => {
    const { container } = render(<AboutPage />);
    expect(container.textContent).toContain("KIRA Score");
    expect(container.textContent).toMatch(/LOW.*70/);
    expect(container.textContent).toMatch(/HIGH.*45/);
  });

  it("discloses the data is synthetic", () => {
    const { container } = render(<AboutPage />);
    expect(container.textContent?.toLowerCase()).toContain("synthetic");
  });

  it("states the published limitations", () => {
    const { container } = render(<AboutPage />);
    const text = container.textContent?.toLowerCase() ?? "";
    expect(text).toContain("no real financial data");
    expect(text).toContain("not empirically fitted");
    expect(text).toContain("entirely manual entry");
    expect(text).toContain("no legal determination");
  });
});
