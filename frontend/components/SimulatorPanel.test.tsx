// SimulatorPanel is purely presentational -- it receives the already-fetched 36-entry grid as a
// prop and never calls the backend itself, which is what makes "no further requests while
// dragging the tenure slider" (architecture.md) trivially true.

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { GridEntry } from "@/lib/api";
import { SimulatorPanel } from "./SimulatorPanel";

function buildGrid(overrides: Record<number, Partial<GridEntry>> = {}): GridEntry[] {
  return Array.from({ length: 36 }, (_, i) => {
    const tenure = i + 1;
    return {
      tenure_months: tenure,
      monthly_sen: Math.round(240000 / tenure),
      score: 68,
      band: "MODERATE RISK" as const,
      delta: 0,
      ...overrides[tenure],
    };
  });
}

const AISYAH_GRID = buildGrid({
  6: { score: 39, band: "HIGH RISK", delta: -29 },
  12: { score: 54, band: "MODERATE RISK", delta: -14 },
  18: { score: 59, band: "MODERATE RISK", delta: -9 },
  24: { score: 62, band: "MODERATE RISK", delta: -6 },
});

describe("SimulatorPanel", () => {
  it("renders the selected tenure's monthly amount, score, and band from the grid", () => {
    render(
      <SimulatorPanel
        grid={AISYAH_GRID}
        tenure={12}
        onTenureChange={vi.fn()}
        bandBefore="MODERATE RISK"
        scoreBefore={68}
        bufferBeforeSen={95000}
      />
    );
    expect(screen.getByText("RM200")).toBeInTheDocument(); // 240000/12 = 20000 sen -> RM200
    expect(screen.getByText("54")).toBeInTheDocument();
  });

  it("shows the buffer dropping by exactly the monthly amount", () => {
    render(
      <SimulatorPanel
        grid={AISYAH_GRID}
        tenure={12}
        onTenureChange={vi.fn()}
        bandBefore="MODERATE RISK"
        scoreBefore={68}
        bufferBeforeSen={95000}
      />
    );
    // 95000 - 20000 = 75000 sen = RM750, matching docs/API-CONTRACT.md §7's own fixture.
    expect(screen.getByText("RM750")).toBeInTheDocument();
  });

  it("moving the slider calls onTenureChange without this component calling the backend", () => {
    const onTenureChange = vi.fn();
    render(
      <SimulatorPanel
        grid={AISYAH_GRID}
        tenure={12}
        onTenureChange={onTenureChange}
        bandBefore="MODERATE RISK"
        scoreBefore={68}
        bufferBeforeSen={95000}
      />
    );
    fireEvent.change(screen.getByRole("slider"), { target: { value: "18" } });
    expect(onTenureChange).toHaveBeenCalledWith(18);
  });

  it("renders the verdict banner computed from the current selection", () => {
    render(
      <SimulatorPanel
        grid={AISYAH_GRID}
        tenure={12}
        onTenureChange={vi.fn()}
        bandBefore="MODERATE RISK"
        scoreBefore={68}
        bufferBeforeSen={95000}
      />
    );
    expect(screen.getByText("Higher financial stress")).toBeInTheDocument();
    expect(screen.getByText("This costs you 14 points.")).toBeInTheDocument();
  });

  it("surfaces alternatives at 6/12/18/24 months excluding the current tenure", () => {
    const { getByRole } = render(
      <SimulatorPanel
        grid={AISYAH_GRID}
        tenure={12}
        onTenureChange={vi.fn()}
        bandBefore="MODERATE RISK"
        scoreBefore={68}
        bufferBeforeSen={95000}
      />
    );
    const alternatives = getByRole("heading", { name: "Alternatives" }).parentElement!;
    expect(alternatives.textContent).toContain("6 months");
    expect(alternatives.textContent).toContain("score 39");
    expect(alternatives.textContent).toContain("18 months");
    expect(alternatives.textContent).toContain("score 59");
    expect(alternatives.textContent).toContain("24 months");
    expect(alternatives.textContent).toContain("score 62");
    // the current tenure (12) shouldn't also appear as a suggested "alternative" entry
    expect(alternatives.textContent).not.toContain("12 months");
  });
});
