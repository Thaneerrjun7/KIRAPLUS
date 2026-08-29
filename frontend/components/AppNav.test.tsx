import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ usePathname: () => "/dashboard" }));

import { AppNav } from "./AppNav";

const PAGES = [
  ["Profile", "/profile"],
  ["Commitments", "/commitments"],
  ["Dashboard", "/dashboard"],
  ["Simulator", "/simulator"],
] as const;

describe("AppNav", () => {
  it("renders both a desktop top nav and a mobile bottom nav, toggled by breakpoint classes", () => {
    render(<AppNav />);
    const navs = screen.getAllByRole("navigation", { name: "Main" });
    expect(navs).toHaveLength(2);
    expect(navs[0]).toHaveClass("hidden", "md:flex");
    expect(navs[1]).toHaveClass("md:hidden");
  });

  it("links to all four app-shell pages from both navs", () => {
    render(<AppNav />);
    for (const [name, href] of PAGES) {
      const links = screen.getAllByRole("link", { name });
      expect(links).toHaveLength(2);
      for (const link of links) expect(link).toHaveAttribute("href", href);
    }
  });

  it("highlights the current route in both navs and not the others", () => {
    render(<AppNav />);
    for (const link of screen.getAllByRole("link", { name: "Dashboard" })) {
      expect(link).toHaveClass("text-navy");
    }
    for (const link of screen.getAllByRole("link", { name: "Profile" })) {
      expect(link).not.toHaveClass("text-navy");
    }
  });
});
