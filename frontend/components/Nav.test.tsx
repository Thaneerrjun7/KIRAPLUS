import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Nav } from "./Nav";

describe("Nav", () => {
  it("links to all five MVP pages", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: "Profile" })).toHaveAttribute("href", "/profile");
    expect(screen.getByRole("link", { name: "Commitments" })).toHaveAttribute(
      "href",
      "/commitments"
    );
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute("href", "/dashboard");
    expect(screen.getByRole("link", { name: "Simulator" })).toHaveAttribute("href", "/simulator");
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
  });
});
