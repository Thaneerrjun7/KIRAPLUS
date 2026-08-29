import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

import { MarketingNav } from "./MarketingNav";

describe("MarketingNav", () => {
  it("links the wordmark to the landing page", () => {
    render(<MarketingNav />);
    expect(screen.getByRole("link", { name: "KIRA+" })).toHaveAttribute("href", "/");
  });

  it("links About to /about and Dashboard to /dashboard", () => {
    render(<MarketingNav />);
    expect(screen.getAllByRole("link", { name: "About" })[0]).toHaveAttribute("href", "/about");
    expect(screen.getAllByRole("link", { name: "Dashboard" })[0]).toHaveAttribute(
      "href",
      "/dashboard"
    );
  });

  it("hides the mobile menu until the hamburger is toggled open", () => {
    render(<MarketingNav />);
    const toggle = screen.getByRole("button", { name: /toggle menu/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getAllByRole("link", { name: "About" }).length).toBeGreaterThan(1);
  });
});
