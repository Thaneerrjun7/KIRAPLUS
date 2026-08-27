import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScoreGauge } from "./ScoreGauge";

describe("ScoreGauge", () => {
  it("renders the score and band", () => {
    render(<ScoreGauge score={68} band="MODERATE RISK" />);
    expect(screen.getByText("68")).toBeInTheDocument();
    expect(screen.getByText("MODERATE RISK")).toBeInTheDocument();
  });

  it("colors the arc by the band's risk level", () => {
    const { container } = render(<ScoreGauge score={68} band="MODERATE RISK" />);
    const arc = container.querySelector("path.score-gauge-fill");
    expect(arc).toHaveClass("stroke-risk-moderate");
  });

  it("colors a LOW RISK band's arc as risk-low", () => {
    const { container } = render(<ScoreGauge score={94} band="LOW RISK" />);
    expect(container.querySelector("path.score-gauge-fill")).toHaveClass("stroke-risk-low");
  });

  it("colors a HIGH RISK band's arc as risk-high", () => {
    const { container } = render(<ScoreGauge score={17} band="HIGH RISK" />);
    expect(container.querySelector("path.score-gauge-fill")).toHaveClass("stroke-risk-high");
  });
});
