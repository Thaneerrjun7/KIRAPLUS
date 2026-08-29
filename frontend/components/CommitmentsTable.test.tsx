import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AISYAH } from "@/lib/fixtures";
import { CommitmentsTable } from "./CommitmentsTable";

describe("CommitmentsTable", () => {
  it("renders an empty state, not an error, for zero commitments", () => {
    render(<CommitmentsTable commitments={[]} onChange={vi.fn()} />);
    expect(screen.getAllByText(/no commitments yet/i)).toHaveLength(2);
  });

  it("renders the aggregate card matching the sum of Aisyah's commitments", () => {
    render(<CommitmentsTable commitments={AISYAH.profile.commitments} onChange={vi.fn()} />);
    expect(screen.getByText("RM350")).toBeInTheDocument();
    expect(screen.getByText("RM9100")).toBeInTheDocument();
    expect(screen.getByText("2026-09-01")).toBeInTheDocument();
  });

  it("renders the obligations breakdown by kind", () => {
    render(<CommitmentsTable commitments={AISYAH.profile.commitments} onChange={vi.fn()} />);
    expect(screen.getByText("[BNPL]")).toBeInTheDocument();
    expect(screen.getByText(/2 commitments, RM250\/month/i)).toBeInTheDocument();
    expect(screen.getByText("[LOAN]")).toBeInTheDocument();
    expect(screen.getByText(/1 commitments, RM100\/month/i)).toBeInTheDocument();
  });

  it("editing a commitment's monthly amount calls onChange with the sen-converted value", () => {
    const onChange = vi.fn();
    render(<CommitmentsTable commitments={AISYAH.profile.commitments} onChange={onChange} />);
    const desktop = within(screen.getByTestId("commitments-desktop"));
    fireEvent.change(desktop.getByLabelText("Monthly 1"), { target: { value: "200" } });
    expect(onChange).toHaveBeenCalledWith([
      { ...AISYAH.profile.commitments[0], monthly_sen: 20000 },
      AISYAH.profile.commitments[1],
      AISYAH.profile.commitments[2],
    ]);
  });

  it("removing a row calls onChange without that commitment", () => {
    const onChange = vi.fn();
    render(<CommitmentsTable commitments={AISYAH.profile.commitments} onChange={onChange} />);
    const desktop = within(screen.getByTestId("commitments-desktop"));
    fireEvent.click(desktop.getAllByRole("button", { name: /remove/i })[0]);
    expect(onChange).toHaveBeenCalledWith([
      AISYAH.profile.commitments[1],
      AISYAH.profile.commitments[2],
    ]);
  });

  it("adding a commitment calls onChange with one more entry appended", () => {
    const onChange = vi.fn();
    render(<CommitmentsTable commitments={[]} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: /add commitment/i }));
    const [result] = onChange.mock.calls[0];
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ label: "", monthly_sen: 0, kind: "bnpl" });
  });

  it("renders the same commitments as cards in the mobile view", () => {
    render(<CommitmentsTable commitments={AISYAH.profile.commitments} onChange={vi.fn()} />);
    const mobile = within(screen.getByTestId("commitments-mobile"));
    expect(mobile.getByLabelText("Label 1")).toHaveValue("Apparel — Uniqlo & Zara");
  });

  it("editing a commitment in the mobile view calls onChange with the sen-converted value", () => {
    const onChange = vi.fn();
    render(<CommitmentsTable commitments={AISYAH.profile.commitments} onChange={onChange} />);
    const mobile = within(screen.getByTestId("commitments-mobile"));
    fireEvent.change(mobile.getByLabelText("Monthly 1"), { target: { value: "200" } });
    expect(onChange).toHaveBeenCalledWith([
      { ...AISYAH.profile.commitments[0], monthly_sen: 20000 },
      AISYAH.profile.commitments[1],
      AISYAH.profile.commitments[2],
    ]);
  });

  it("removing a row from the mobile view calls onChange without that commitment", () => {
    const onChange = vi.fn();
    render(<CommitmentsTable commitments={AISYAH.profile.commitments} onChange={onChange} />);
    const mobile = within(screen.getByTestId("commitments-mobile"));
    fireEvent.click(mobile.getAllByRole("button", { name: /remove/i })[0]);
    expect(onChange).toHaveBeenCalledWith([
      AISYAH.profile.commitments[1],
      AISYAH.profile.commitments[2],
    ]);
  });

  it("keeps the desktop table and mobile cards on separate breakpoint-controlled containers", () => {
    render(<CommitmentsTable commitments={AISYAH.profile.commitments} onChange={vi.fn()} />);
    expect(screen.getByTestId("commitments-desktop")).toHaveClass("hidden", "md:block");
    expect(screen.getByTestId("commitments-mobile")).toHaveClass("md:hidden");
  });
});
