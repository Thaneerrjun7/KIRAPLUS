// Integration test, mocking the backend at the lib/api.ts boundary -- per
// frontend/docs/testing.md tier 3. Key acceptance: dragging the tenure slider causes zero
// additional network requests after the initial grid fetch (architecture.md).

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { GridEntry } from "@/lib/api";
import { AISYAH } from "@/lib/fixtures";

const { loadProfile, assess, simulateGrid } = vi.hoisted(() => ({
  loadProfile: vi.fn(),
  assess: vi.fn(),
  simulateGrid: vi.fn(),
}));

vi.mock("@/lib/api", () => ({ loadProfile, assess, simulateGrid }));

import SimulatorPage from "./page";

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
  12: { score: 54, band: "MODERATE RISK", delta: -14 },
});

function aisyahAssessment() {
  return {
    score: 68,
    band: "MODERATE RISK",
    penalty: 0,
    features: AISYAH.expected.features,
    subscores: AISYAH.expected.subscores,
    contributions: {
      debt_burden: 23.26,
      bnpl_exposure: 16.05,
      disposable_income: 14.07,
      emergency_buffer: 1.58,
      repayment_capacity: 12.0,
      savings_resilience: 1.33,
    },
    warnings: [],
    p_stress_12m: 0.31,
    engine_version: "1.0.0",
    disclaimer: "Assessment based on user-provided data. Not financial advice.",
  };
}

beforeEach(() => {
  window.localStorage.clear();
  loadProfile.mockReset();
  assess.mockReset();
  simulateGrid.mockReset();
});

describe("SimulatorPage", () => {
  it("prompts to complete a profile first when no profile_id is stored", () => {
    render(<SimulatorPage />);
    expect(screen.getByText(/save a profile first/i)).toBeInTheDocument();
    expect(assess).not.toHaveBeenCalled();
  });

  it("loads the baseline and the grid for the default price and tenure", async () => {
    window.localStorage.setItem("kira_profile_id", "7");
    loadProfile.mockResolvedValue({ ...AISYAH.profile, profile_id: 7 });
    assess.mockResolvedValue(aisyahAssessment());
    simulateGrid.mockResolvedValue(AISYAH_GRID);

    render(<SimulatorPage />);

    await waitFor(() => expect(simulateGrid).toHaveBeenCalledTimes(1));
    const [, priceSenArg] = simulateGrid.mock.calls[0];
    expect(priceSenArg).toBe(240000);
    expect(await screen.findByRole("slider")).toHaveValue("12");
  });

  it("dragging the tenure slider causes zero additional requests", async () => {
    window.localStorage.setItem("kira_profile_id", "7");
    loadProfile.mockResolvedValue({ ...AISYAH.profile, profile_id: 7 });
    assess.mockResolvedValue(aisyahAssessment());
    simulateGrid.mockResolvedValue(AISYAH_GRID);

    render(<SimulatorPage />);
    await waitFor(() => expect(simulateGrid).toHaveBeenCalledTimes(1));

    const slider = screen.getByRole("slider");
    for (const value of [6, 18, 24, 12, 30]) {
      fireEvent.change(slider, { target: { value: String(value) } });
    }

    expect(simulateGrid).toHaveBeenCalledTimes(1);
    expect(assess).toHaveBeenCalledTimes(1);
  });

  it("changing the price fetches a new grid for the new price", async () => {
    window.localStorage.setItem("kira_profile_id", "7");
    loadProfile.mockResolvedValue({ ...AISYAH.profile, profile_id: 7 });
    assess.mockResolvedValue(aisyahAssessment());
    simulateGrid.mockResolvedValue(AISYAH_GRID);

    render(<SimulatorPage />);
    await waitFor(() => expect(simulateGrid).toHaveBeenCalledTimes(1));

    fireEvent.change(screen.getByLabelText(/purchase price/i), { target: { value: "1000" } });

    await waitFor(() => expect(simulateGrid).toHaveBeenCalledTimes(2));
    const [, secondPriceSen] = simulateGrid.mock.calls[1];
    expect(secondPriceSen).toBe(100000);
  });

  it("shows an error instead of crashing when assess fails", async () => {
    window.localStorage.setItem("kira_profile_id", "7");
    loadProfile.mockResolvedValue({ ...AISYAH.profile, profile_id: 7 });
    assess.mockRejectedValue(new Error("Not implemented"));
    simulateGrid.mockResolvedValue(AISYAH_GRID);

    render(<SimulatorPage />);

    expect(await screen.findByRole("alert")).toHaveTextContent("Not implemented");
  });
});
