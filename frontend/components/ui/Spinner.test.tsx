import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("renders an accessible loading status", () => {
    render(<Spinner />);
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
  });

  it("spins and uses the brand teal accent", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toHaveClass("animate-spin", "border-t-teal");
  });

  it("merges an extra className when given", () => {
    render(<Spinner className="ml-2" />);
    expect(screen.getByRole("status")).toHaveClass("ml-2");
  });
});
