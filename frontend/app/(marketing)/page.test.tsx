import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("links to the Profile page as the entry point", () => {
    render(<Home />);
    expect(screen.getByRole("link", { name: /get started/i })).toHaveAttribute(
      "href",
      "/profile"
    );
  });

  it("shows the live score-gauge preview using Aisyah's fixture score", () => {
    render(<Home />);
    expect(screen.getByText("68")).toBeInTheDocument();
    expect(screen.getByText("MODERATE RISK")).toBeInTheDocument();
  });

  it("lists the three-step process in order", () => {
    render(<Home />);
    const headings = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(headings).toEqual(["Consolidate", "Score", "Simulate"]);
  });

  it("shows real persona quotes, not placeholder copy", () => {
    render(<Home />);
    expect(
      screen.getByText(/I always know I can pay it/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/AISYAH, 26/)).toBeInTheDocument();
  });
});
