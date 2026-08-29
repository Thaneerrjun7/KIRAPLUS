import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders a button element by default", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("applies primary variant classes by default", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-navy", "rounded-xl");
  });

  it("applies secondary variant classes when specified", () => {
    render(<Button variant="secondary">Cancel</Button>);
    expect(screen.getByRole("button")).toHaveClass("border-border", "rounded-xl");
  });

  it("renders as a link when href is given", () => {
    render(<Button href="/profile">Get started</Button>);
    expect(screen.getByRole("link", { name: "Get started" })).toHaveAttribute(
      "href",
      "/profile"
    );
  });

  it("forwards onClick to the underlying button", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
