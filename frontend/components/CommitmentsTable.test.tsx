import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AISYAH } from "@/lib/fixtures";
import { CommitmentsTable } from "./CommitmentsTable";

describe("CommitmentsTable", () => {
  it("renders an empty state, not an error, for zero commitments", () => {
    render(<CommitmentsTable commitments={[]} onChange={vi.fn()} />);
    expect(screen.getByText(/no commitments yet/i)).toBeInTheDocument();
  });

  it("renders the aggregate card matching the sum of Aisyah's commitments", () => {
    render(<CommitmentsTable commitments={AISYAH.profile.commitments} onChange={vi.fn()} />);
    expect(screen.getByText("RM350")).toBeInTheDocument();
    expect(screen.getByText("RM9100")).toBeInTheDocument();
    expect(screen.getByText("2026-09-01")).toBeInTheDocument();
  });

  it("renders the obligations breakdown by kind", () => {
    render(<CommitmentsTable commitments={AISYAH.profile.commitments} onChange={vi.fn()} />);
    expect(screen.getByText(/bnpl: 2 commitments/i)).toBeInTheDocument();
    expect(screen.getByText(/loan: 1 commitments/i)).toBeInTheDocument();
  });

  it("editing a commitment's monthly amount calls onChange with the sen-converted value", () => {
    const onChange = vi.fn();
    render(<CommitmentsTable commitments={AISYAH.profile.commitments} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText("Monthly 1"), { target: { value: "200" } });
    expect(onChange).toHaveBeenCalledWith([
      { ...AISYAH.profile.commitments[0], monthly_sen: 20000 },
      AISYAH.profile.commitments[1],
      AISYAH.profile.commitments[2],
    ]);
  });

  it("removing a row calls onChange without that commitment", () => {
    const onChange = vi.fn();
    render(<CommitmentsTable commitments={AISYAH.profile.commitments} onChange={onChange} />);
    fireEvent.click(screen.getAllByRole("button", { name: /remove/i })[0]);
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
});
