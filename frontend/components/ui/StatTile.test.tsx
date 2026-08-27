import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatTile } from "./StatTile";

describe("StatTile", () => {
  it("renders the label and value as separately queryable text", () => {
    render(<StatTile label="Monthly buffer" value="RM950" />);
    expect(screen.getByText("Monthly buffer")).toBeInTheDocument();
    expect(screen.getByText("RM950")).toBeInTheDocument();
  });

  it("applies a custom value class when given", () => {
    render(<StatTile label="After purchase" value="RM750" valueClassName="text-risk-high" />);
    expect(screen.getByText("RM750")).toHaveClass("text-risk-high");
  });
});
