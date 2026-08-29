// Integration test, mocking the backend at the lib/api.ts boundary -- per
// frontend/docs/testing.md tier 3. No real network call; no live backend needed.

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AISYAH } from "@/lib/fixtures";

const { loadDemo, loadProfile, saveProfile } = vi.hoisted(() => ({
  loadDemo: vi.fn(),
  loadProfile: vi.fn(),
  saveProfile: vi.fn(),
}));

vi.mock("@/lib/api", () => ({ loadDemo, loadProfile, saveProfile }));

import ProfilePage from "./page";

beforeEach(() => {
  window.localStorage.clear();
  loadDemo.mockReset();
  loadProfile.mockReset();
  saveProfile.mockReset();
});

afterEach(() => {
  window.localStorage.clear();
});

describe("ProfilePage", () => {
  it("does not fetch anything on mount when no profile_id is stored", () => {
    render(<ProfilePage />);
    expect(loadProfile).not.toHaveBeenCalled();
  });

  it("loads the stored profile on mount when a profile_id is in localStorage", async () => {
    window.localStorage.setItem("kira_profile_id", "7");
    loadProfile.mockResolvedValue(AISYAH.profile);

    render(<ProfilePage />);

    expect(loadProfile).toHaveBeenCalledWith(7);
    await waitFor(() => expect(screen.getByLabelText(/income/i)).toHaveValue(4500));
  });

  it("loading a demo persona populates the form without saving to the backend", async () => {
    loadDemo.mockResolvedValue(AISYAH.profile);
    render(<ProfilePage />);

    fireEvent.click(screen.getByRole("button", { name: /aisyah/i }));

    await waitFor(() => expect(screen.getByLabelText(/income/i)).toHaveValue(4500));
    expect(saveProfile).not.toHaveBeenCalled();
  });

  it("saving stores the returned profile_id and shows a confirmation", async () => {
    saveProfile.mockResolvedValue({ profile_id: 99, updated_at: "2026-01-01" });
    render(<ProfilePage />);

    fireEvent.change(screen.getByLabelText(/income/i), { target: { value: "4500" } });
    fireEvent.change(screen.getByLabelText(/fixed expenses/i), { target: { value: "1984" } });
    fireEvent.change(screen.getByLabelText(/variable expenses/i), { target: { value: "1216" } });
    fireEvent.change(screen.getByLabelText(/savings/i), { target: { value: "2250" } });
    fireEvent.change(screen.getByLabelText(/loan/i), { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => expect(saveProfile).toHaveBeenCalled());
    expect(window.localStorage.getItem("kira_profile_id")).toBe("99");
    expect(await screen.findByRole("status")).toHaveTextContent(/saved/i);
  });

  it("shows an error instead of crashing when the stored profile_id no longer exists", async () => {
    window.localStorage.setItem("kira_profile_id", "1");
    loadProfile.mockRejectedValue(new Error("Profile 1 not found."));

    render(<ProfilePage />);

    expect(await screen.findByRole("alert")).toHaveTextContent("Profile 1 not found.");
  });

  it("shows an error instead of crashing when saving fails", async () => {
    saveProfile.mockRejectedValue(new Error("Request failed"));
    render(<ProfilePage />);

    fireEvent.change(screen.getByLabelText(/income/i), { target: { value: "4500" } });
    fireEvent.change(screen.getByLabelText(/fixed expenses/i), { target: { value: "1984" } });
    fireEvent.change(screen.getByLabelText(/variable expenses/i), { target: { value: "1216" } });
    fireEvent.change(screen.getByLabelText(/savings/i), { target: { value: "2250" } });
    fireEvent.change(screen.getByLabelText(/loan/i), { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Request failed");
  });
});
