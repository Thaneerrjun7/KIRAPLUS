// Integration test, mocking the backend at the lib/api.ts boundary -- per
// frontend/docs/testing.md tier 3. Dashboard "Calls: POST /assess, POST /explain".

import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AISYAH } from "@/lib/fixtures";

const { loadProfile, assess, explain } = vi.hoisted(() => ({
  loadProfile: vi.fn(),
  assess: vi.fn(),
  explain: vi.fn(),
}));

vi.mock("@/lib/api", () => ({ loadProfile, assess, explain }));

import DashboardPage from "./page";

function aisyahAssessment() {
  return {
    score: AISYAH.expected.score,
    band: AISYAH.expected.band,
    penalty: AISYAH.expected.penalty,
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
    warnings: [
      {
        code: "LOW_BUFFER",
        level: "red",
        title: "Emergency buffer is thin",
        detail: "Your savings cover 0.6 months of spending.",
        lever: "Reaching one month would add roughly 5 points.",
      },
    ],
    p_stress_12m: 0.31,
    engine_version: "1.0.0",
    disclaimer: "Assessment based on user-provided data. Not financial advice.",
  };
}

beforeEach(() => {
  window.localStorage.clear();
  loadProfile.mockReset();
  assess.mockReset();
  explain.mockReset();
});

describe("DashboardPage", () => {
  it("prompts to complete a profile first when no profile_id is stored", () => {
    render(<DashboardPage />);
    expect(screen.getByText(/save a profile first/i)).toBeInTheDocument();
    expect(assess).not.toHaveBeenCalled();
  });

  it("renders the score, band, factors, and warnings for the loaded profile", async () => {
    window.localStorage.setItem("kira_profile_id", "7");
    loadProfile.mockResolvedValue({ ...AISYAH.profile, profile_id: 7 });
    assess.mockResolvedValue(aisyahAssessment());
    explain.mockResolvedValue({ text: "You're in decent shape.", source: "template" });

    render(<DashboardPage />);

    expect(await screen.findByText("68")).toBeInTheDocument();
    expect(screen.getByText("MODERATE RISK")).toBeInTheDocument();
    expect(screen.getByText("Your savings cover 0.6 months of spending.")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("You're in decent shape.")).toBeInTheDocument());
  });

  it("still renders the score when explain fails, since it's best-effort", async () => {
    window.localStorage.setItem("kira_profile_id", "7");
    loadProfile.mockResolvedValue({ ...AISYAH.profile, profile_id: 7 });
    assess.mockResolvedValue(aisyahAssessment());
    explain.mockRejectedValue(new Error("Not implemented"));

    render(<DashboardPage />);

    expect(await screen.findByText("68")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows an error instead of crashing when assess fails", async () => {
    window.localStorage.setItem("kira_profile_id", "7");
    loadProfile.mockResolvedValue({ ...AISYAH.profile, profile_id: 7 });
    assess.mockRejectedValue(new Error("Not implemented"));

    render(<DashboardPage />);

    expect(await screen.findByRole("alert")).toHaveTextContent("Not implemented");
  });
});
