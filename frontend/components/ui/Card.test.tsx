import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "./Card";

describe("Card", () => {
  it("renders its children", () => {
    render(<Card>Hello</Card>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("renders a corner label when given", () => {
    render(<Card label="SCORE">Hello</Card>);
    expect(screen.getByText("SCORE")).toBeInTheDocument();
  });

  it("renders no label element when omitted", () => {
    const { container } = render(<Card>Hello</Card>);
    expect(container.querySelectorAll("span").length).toBe(0);
  });

  it("uses the surface background, hairline border, and 12px radius", () => {
    const { container } = render(<Card>Hello</Card>);
    expect(container.firstChild).toHaveClass("bg-surface", "border-border", "rounded-xl");
  });

  it("carries the shared card shadow", () => {
    const { container } = render(<Card>Hello</Card>);
    expect(container.firstChild).toHaveClass("shadow-card");
  });
});
