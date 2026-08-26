// The end-to-end tier of frontend/docs/testing.md's pyramid (P1, not P0).
// Skipped for now -- every page is still a placeholder ("Not yet
// implemented."), so there is nothing real to walk through yet. Un-skip once
// the Profile page can actually load a demo persona.
//
// Happy path, per docs/MASTER-PACKAGE.md's own demo script and
// lib/fixtures.ts's AISYAH: load the Aisyah demo persona on Profile, see her
// on Commitments, see score 68 on Dashboard, simulate a RM2,400/12-month
// purchase on Simulator and see 68 -> 54, then read About.

import { expect, test } from "@playwright/test";

test.skip("demo path: Aisyah, profile through simulator", async ({ page }) => {
  await page.goto("/profile");
  await page.getByRole("button", { name: /aisyah/i }).click();

  await page.goto("/dashboard");
  await expect(page.getByText("68")).toBeVisible();

  await page.goto("/simulator");
  await page.getByLabel(/purchase price/i).fill("2400");
  await page.getByLabel(/tenure/i).fill("12");
  await expect(page.getByText("54")).toBeVisible();
});
