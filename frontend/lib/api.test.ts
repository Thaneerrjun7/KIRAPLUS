// The one module allowed to call the backend -- docs/API-CONTRACT.md §9. Component/page tests
// mock this module at its boundary (see testing.md tier 3); these tests instead prove the real
// fetch wiring: URL, method, and snake_case JSON body/error shapes actually match the contract.

import { afterEach, describe, expect, it, vi } from "vitest";
import { AISYAH } from "./fixtures";
import {
  API_URL,
  ApiError,
  assess,
  loadDemo,
  loadProfile,
  saveProfile,
  simulateGrid,
} from "./api";

function mockFetchOnce(status: number, body: unknown) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("saveProfile", () => {
  it("POSTs the profile to /profiles and returns the parsed body", async () => {
    const fetchMock = mockFetchOnce(200, { profile_id: 1, updated_at: "2026-01-01" });

    const result = await saveProfile(AISYAH.profile);

    expect(fetchMock).toHaveBeenCalledWith(
      `${API_URL}/profiles`,
      expect.objectContaining({ method: "POST", body: JSON.stringify(AISYAH.profile) })
    );
    expect(result).toEqual({ profile_id: 1, updated_at: "2026-01-01" });
  });
});

describe("loadProfile", () => {
  it("GETs /profiles/{id}", async () => {
    const fetchMock = mockFetchOnce(200, AISYAH.profile);

    await loadProfile(7);

    expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/profiles/7`, expect.anything());
  });
});

describe("loadDemo", () => {
  it("GETs /profiles/demo/{name}", async () => {
    mockFetchOnce(200, AISYAH.profile);

    const result = await loadDemo("aisyah");

    expect(result).toEqual(AISYAH.profile);
  });
});

describe("assess", () => {
  it("POSTs the profile to /assess", async () => {
    const fetchMock = mockFetchOnce(200, { score: 68 });

    await assess(AISYAH.profile);

    expect(fetchMock).toHaveBeenCalledWith(
      `${API_URL}/assess`,
      expect.objectContaining({ method: "POST", body: JSON.stringify(AISYAH.profile) })
    );
  });
});

describe("simulateGrid", () => {
  it("POSTs {profile, price_sen} in snake_case to /simulate/grid", async () => {
    const fetchMock = mockFetchOnce(200, []);

    await simulateGrid(AISYAH.profile, 240000);

    expect(fetchMock).toHaveBeenCalledWith(
      `${API_URL}/simulate/grid`,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ profile: AISYAH.profile, price_sen: 240000 }),
      })
    );
  });
});

describe("error handling", () => {
  it("throws an ApiError carrying the backend's field and message on a non-2xx response", async () => {
    mockFetchOnce(422, { field: "income_sen", message: "Income must be greater than 0." });

    await expect(loadProfile(1)).rejects.toMatchObject({
      field: "income_sen",
      message: "Income must be greater than 0.",
    });
  });

  it("the rejection is an instance of ApiError", async () => {
    mockFetchOnce(422, { field: "income_sen", message: "Income must be greater than 0." });

    await expect(loadProfile(1)).rejects.toBeInstanceOf(ApiError);
  });
});
