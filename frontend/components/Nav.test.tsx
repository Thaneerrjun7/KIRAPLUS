import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ usePathname: () => "/dashboard" }));

import { Nav } from "./Nav";

describe("Nav", () => {
  it("links to all five MVP pages", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: /profile/i })).toHaveAttribute("href", "/profile");
    expect(screen.getByRole("link", { name: /commitments/i })).toHaveAttribute(
      "href",
      "/commitments"
    );
    expect(screen.getByRole("link", { name: /dashboard/i })).toHaveAttribute(
      "href",
      "/dashboard"
    );
    expect(screen.getByRole("link", { name: /simulator/i })).toHaveAttribute(
      "href",
      "/simulator"
    );
    expect(screen.getByRole("link", { name: /about/i })).toHaveAttribute("href", "/about");
  });

  it("highlights the current route and not the others", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: /dashboard/i })).toHaveClass("border-teal");
    expect(screen.getByRole("link", { name: /profile/i })).not.toHaveClass("border-teal");
  });
});
