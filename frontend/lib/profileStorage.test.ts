// The one place profile_id survives a reload -- see frontend/docs/architecture.md
// ("State management"): no auth, so profile_id in localStorage stands in for a session.

import { afterEach, describe, expect, it } from "vitest";
import { getStoredProfileId, setStoredProfileId } from "./profileStorage";

afterEach(() => {
  window.localStorage.clear();
});

describe("profileStorage", () => {
  it("returns null when nothing has been stored", () => {
    expect(getStoredProfileId()).toBeNull();
  });

  it("round-trips a saved profile_id", () => {
    setStoredProfileId(42);
    expect(getStoredProfileId()).toBe(42);
  });
});
