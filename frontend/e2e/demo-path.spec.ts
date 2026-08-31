// The end-to-end tier of frontend/docs/testing.md's pyramid (P1, not P0).
//
// Un-skipped: every page is real now, and this walk is what actually caught the
// two defects the unit suites could not -- a bare `uvicorn app.main:app` never
// created the SQLite schema (first "Save profile" 500'd), and llm_service only
// understood one of the two payload shapes reaching POST /explain (the
// dashboard's "What this means" panel read "currently unavailable" forever).
// Neither is visible without a browser and a live API.
//
// Needs BOTH servers up. `npm run test:e2e` starts the frontend via
// playwright.config.ts's webServer; the backend is not started for you:
//
//   cd backend && uvicorn app.main:app --port 8000
//
// The whole file skips with a clear reason if that API isn't answering, rather
// than failing with a wall of timeouts that look like frontend bugs.
//
// Happy path, per docs/MASTER-PACKAGE.md's own demo script and the frozen §7
// fixtures: load Aisyah on Profile, see her commitments, see 68 on Dashboard,
// simulate RM2,400 over 12 months and see 68 -> 54 with the buffer at RM750.

import { expect, test } from "@playwright/test";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

test.beforeAll(async ({ request }) => {
  const reachable = await request
    .get(`${API}/health`, { timeout: 4000 })
    .then((r) => r.ok())
    .catch(() => false);
  test.skip(!reachable, `KIRA+ API not answering at ${API} -- start it with: cd backend && uvicorn app.main:app --port 8000`);
});

test("demo path: Aisyah, profile through simulator", async ({ page }) => {
  // 1. Profile -- load the demo persona and save it.
  await page.goto("/profile");
  await page.getByRole("button", { name: /Aisyah/ }).click();
  await expect(page.locator("#profile-income")).toHaveValue("4500");
  await expect(page.locator("#profile-savings")).toHaveValue("2250");
  await page.getByRole("button", { name: /Save profile/i }).click();
  await expect(page.getByText(/profile saved/i)).toBeVisible();

  // 2. Commitments -- her three commitments, aggregated.
  await page.goto("/commitments");
  await expect(page.getByText("RM350")).toBeVisible();

  // 3. Dashboard -- the frozen fixture score, and a rendered explanation.
  await page.goto("/dashboard");
  await expect(page.getByText("68", { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/MODERATE RISK/).first()).toBeVisible();
  await expect(page.getByText(/currently unavailable/i)).toHaveCount(0);

  // 4. Simulator -- the demo moment: 68 -> 54, RM950 -> RM750.
  await page.goto("/simulator");
  await page.locator("#purchase-price").fill("2400");
  await page.locator("#tenure-slider").fill("12");
  await expect(page.getByText("RM200")).toBeVisible();
  await expect(page.getByText("54", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("RM750")).toBeVisible();
});
