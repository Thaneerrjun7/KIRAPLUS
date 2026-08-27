import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders the text wrapped in brackets", () => {
    render(<Badge>STRONG</Badge>);
    expect(screen.getByText("[STRONG]")).toBeInTheDocument();
  });

  it("colors a high-risk badge with the risk-high token", () => {
    render(<Badge risk="high">CRITICAL</Badge>);
    expect(screen.getByText("[CRITICAL]")).toHaveClass("text-risk-high");
  });

  it("colors a low-risk badge with the risk-low token", () => {
    render(<Badge risk="low">STRONG</Badge>);
    expect(screen.getByText("[STRONG]")).toHaveClass("text-risk-low");
  });

  it("defaults to a neutral color when risk is omitted", () => {
    render(<Badge>ADEQUATE</Badge>);
    expect(screen.getByText("[ADEQUATE]")).toHaveClass("text-navy/50");
  });
});
