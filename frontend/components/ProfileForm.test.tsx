// Component test, RTL -- per frontend/docs/testing.md tier 2. Feeds the form real fixture
// values and asserts what's on screen / what callbacks fire, not implementation detail.

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AISYAH } from "@/lib/fixtures";
import { ProfileForm } from "./ProfileForm";

describe("ProfileForm", () => {
  it("renders the profile-level fields with empty defaults", () => {
    render(<ProfileForm onSave={vi.fn()} onLoadDemo={vi.fn()} />);
    expect(screen.getByLabelText(/label/i)).toHaveValue("");
    expect(screen.getByLabelText(/income/i)).toHaveValue(null);
    expect(screen.getByLabelText(/fixed expenses/i)).toHaveValue(null);
    expect(screen.getByLabelText(/variable expenses/i)).toHaveValue(null);
    expect(screen.getByLabelText(/savings/i)).toHaveValue(null);
    expect(screen.getByLabelText(/loan/i)).toHaveValue(null);
  });

  it("renders all four demo persona buttons", () => {
    render(<ProfileForm onSave={vi.fn()} onLoadDemo={vi.fn()} />);
    expect(screen.getByRole("button", { name: /aisyah/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /daniel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /wei jian/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /farah/i })).toBeInTheDocument();
  });

  it("calls onLoadDemo with the persona id when a demo button is clicked", () => {
    const onLoadDemo = vi.fn();
    render(<ProfileForm onSave={vi.fn()} onLoadDemo={onLoadDemo} />);
    fireEvent.click(screen.getByRole("button", { name: /aisyah/i }));
    expect(onLoadDemo).toHaveBeenCalledWith("aisyah");
  });

  it("pre-fills fields in ringgit from an initialProfile", () => {
    render(<ProfileForm initialProfile={AISYAH.profile} onSave={vi.fn()} onLoadDemo={vi.fn()} />);
    expect(screen.getByLabelText(/income/i)).toHaveValue(4500);
    expect(screen.getByLabelText(/savings/i)).toHaveValue(2250);
  });

  it("shows the exact contract validation message and does not call onSave on invalid input", () => {
    const onSave = vi.fn();
    render(<ProfileForm onSave={onSave} onLoadDemo={vi.fn()} />);
    fireEvent.change(screen.getByLabelText(/income/i), { target: { value: "0" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));
    expect(screen.getByText("Income must be greater than 0.")).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("calls onSave with sen-converted values on valid submit", () => {
    const onSave = vi.fn();
    render(<ProfileForm onSave={onSave} onLoadDemo={vi.fn()} />);
    fireEvent.change(screen.getByLabelText(/label/i), { target: { value: "My profile" } });
    fireEvent.change(screen.getByLabelText(/income/i), { target: { value: "4500" } });
    fireEvent.change(screen.getByLabelText(/fixed expenses/i), { target: { value: "1984" } });
    fireEvent.change(screen.getByLabelText(/variable expenses/i), { target: { value: "1216" } });
    fireEvent.change(screen.getByLabelText(/savings/i), { target: { value: "2250" } });
    fireEvent.change(screen.getByLabelText(/loan/i), { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        label: "My profile",
        income_sen: 450000,
        fixed_expenses_sen: 198400,
        var_expenses_sen: 121600,
        savings_sen: 225000,
        loan_monthly_sen: 10000,
      })
    );
  });

  it("shows each demo persona's real quote, not just their name", () => {
    render(<ProfileForm onSave={vi.fn()} onLoadDemo={vi.fn()} />);
    expect(
      screen.getByText(/I always know I can pay it/i)
    ).toBeInTheDocument();
  });
});
