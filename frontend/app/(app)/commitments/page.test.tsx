// Integration test, mocking the backend at the lib/api.ts boundary -- per
// frontend/docs/testing.md tier 3. architecture.md: Commitments "reads from the already-loaded
// Profile.commitments; no separate endpoint" -- this page loads the saved profile via the same
// profile_id persistence app/profile/page.tsx uses, and re-saves through the same endpoint.

import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AISYAH } from "@/lib/fixtures";

const { loadProfile, saveProfile } = vi.hoisted(() => ({
  loadProfile: vi.fn(),
  saveProfile: vi.fn(),
}));

vi.mock("@/lib/api", () => ({ loadProfile, saveProfile }));

import CommitmentsPage from "./page";

beforeEach(() => {
  window.localStorage.clear();
  loadProfile.mockReset();
  saveProfile.mockReset();
});

describe("CommitmentsPage", () => {
  it("prompts to complete a profile first when no profile_id is stored", () => {
    render(<CommitmentsPage />);
    expect(screen.getByText(/save a profile first/i)).toBeInTheDocument();
    expect(loadProfile).not.toHaveBeenCalled();
  });

  it("loads the saved profile's commitments when a profile_id is stored", async () => {
    window.localStorage.setItem("kira_profile_id", "7");
    loadProfile.mockResolvedValue(AISYAH.profile);

    render(<CommitmentsPage />);

    expect(loadProfile).toHaveBeenCalledWith(7);
    await waitFor(() => expect(screen.getByText("RM350")).toBeInTheDocument());
  });

  it("saving re-saves the whole profile with the edited commitments, keyed on the same profile_id", async () => {
    window.localStorage.setItem("kira_profile_id", "7");
    loadProfile.mockResolvedValue({ ...AISYAH.profile, profile_id: 7 });
    saveProfile.mockResolvedValue({ profile_id: 7, updated_at: "2026-01-01" });

    render(<CommitmentsPage />);
    await waitFor(() =>
      expect(within(screen.getByTestId("commitments-desktop")).getByLabelText("Monthly 1")).toBeInTheDocument()
    );

    const desktop = within(screen.getByTestId("commitments-desktop"));
    fireEvent.change(desktop.getByLabelText("Monthly 1"), { target: { value: "200" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => expect(saveProfile).toHaveBeenCalled());
    const [savedProfile] = saveProfile.mock.calls[0];
    expect(savedProfile.profile_id).toBe(7);
    expect(savedProfile.income_sen).toBe(AISYAH.profile.income_sen);
    expect(savedProfile.commitments[0].monthly_sen).toBe(20000);
    expect(await screen.findByRole("status")).toHaveTextContent(/saved/i);
  });

  it("shows an error instead of crashing when loading the profile fails", async () => {
    window.localStorage.setItem("kira_profile_id", "7");
    loadProfile.mockRejectedValue(new Error("Profile 7 not found."));

    render(<CommitmentsPage />);

    expect(await screen.findByRole("alert")).toHaveTextContent("Profile 7 not found.");
  });

  it("shows an error instead of crashing when saving fails", async () => {
    window.localStorage.setItem("kira_profile_id", "7");
    loadProfile.mockResolvedValue({ ...AISYAH.profile, profile_id: 7 });
    saveProfile.mockRejectedValue(new Error("Request failed"));

    render(<CommitmentsPage />);
    await waitFor(() =>
      expect(within(screen.getByTestId("commitments-desktop")).getByLabelText("Monthly 1")).toBeInTheDocument()
    );

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Request failed");
  });
});
