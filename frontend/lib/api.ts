// Thin client for the FastAPI backend. See docs/API-CONTRACT.md §9.
// Every request/response body here is the same integer-sen JSON shape
// documented in §1-§5 -- this file must never format currency itself.

import type { Band, Profile, WarningCode } from "./fixtures";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  field: string | null;

  constructor(message: string, field: string | null = null) {
    super(message);
    this.field = field;
  }
}

export type Warning = {
  code: WarningCode;
  level: "red" | "amber";
  title: string;
  detail: string;
  lever: string;
};

export type Assessment = {
  score: number;
  band: Band;
  penalty: number;
  features: Record<string, number>;
  subscores: Record<string, number>;
  contributions: Record<string, number>;
  warnings: Warning[];
  p_stress_12m: number | null;
  engine_version: string;
  disclaimer: string;
};

export type Verdict = {
  level: "green" | "amber" | "red";
  headline: string;
  detail: string;
};

export type Alternative = {
  tenure_months: number;
  monthly_sen: number;
  score: number;
  delta: number;
  band: Band;
};

export type Simulation = {
  monthly_sen: number;
  before: Assessment;
  after: Assessment;
  deltas: Record<string, number>;
  band_changed: boolean;
  verdict: Verdict;
  alternatives: Alternative[];
};

export type GridEntry = {
  tenure_months: number;
  monthly_sen: number;
  score: number;
  band: Band;
  delta: number;
};

export type ProfileSummary = {
  profile_id: number;
  label: string;
  is_demo: boolean;
  updated_at: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(body.message ?? "Request failed", body.field ?? null);
  }
  return response.json() as Promise<T>;
}

export function saveProfile(profile: Profile): Promise<{ profile_id: number; updated_at: string }> {
  return request("/profiles", { method: "POST", body: JSON.stringify(profile) });
}

export function loadProfile(profileId: number): Promise<Profile> {
  return request(`/profiles/${profileId}`);
}

export function listProfiles(): Promise<ProfileSummary[]> {
  return request("/profiles");
}

export function loadDemo(name: string): Promise<Profile> {
  return request(`/profiles/demo/${name}`);
}

export function assess(profile: Profile): Promise<Assessment> {
  return request("/assess", { method: "POST", body: JSON.stringify(profile) });
}

export function simulate(
  profile: Profile,
  priceSen: number,
  tenureMonths: number
): Promise<Simulation> {
  return request("/simulate", {
    method: "POST",
    body: JSON.stringify({ profile, price_sen: priceSen, tenure_months: tenureMonths }),
  });
}

export function simulateGrid(profile: Profile, priceSen: number): Promise<GridEntry[]> {
  return request("/simulate/grid", {
    method: "POST",
    body: JSON.stringify({ profile, price_sen: priceSen }),
  });
}

export function explain(payload: unknown): Promise<{ text: string; source: "llm" | "template" }> {
  return request("/explain", { method: "POST", body: JSON.stringify(payload) });
}
