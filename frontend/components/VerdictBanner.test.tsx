import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VerdictBanner } from "./VerdictBanner";

describe("VerdictBanner", () => {
  it("renders the headline and detail", () => {
    render(
      <VerdictBanner
        verdict={{ level: "amber", headline: "Higher financial stress", detail: "This costs you 14 points." }}
      />
    );
    expect(screen.getByText("Higher financial stress")).toBeInTheDocument();
    expect(screen.getByText("This costs you 14 points.")).toBeInTheDocument();
  });

  it("colors a red verdict as risk-high", () => {
    const { container } = render(
      <VerdictBanner verdict={{ level: "red", headline: "h", detail: "d" }} />
    );
    expect(container.firstChild).toHaveClass("border-risk-high");
  });

  it("colors a green verdict as risk-low", () => {
    const { container } = render(
      <VerdictBanner verdict={{ level: "green", headline: "h", detail: "d" }} />
    );
    expect(container.firstChild).toHaveClass("border-risk-low");
  });
});
