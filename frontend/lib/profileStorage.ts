// The one place profile_id survives a reload. See frontend/docs/architecture.md
// ("State management"): no auth in the MVP, so profile_id in localStorage stands in for a
// server session -- only this value needs to survive a reload, never the full Profile.

const STORAGE_KEY = "kira_profile_id";

export function getStoredProfileId(): number | null {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw === null ? null : Number(raw);
}

export function setStoredProfileId(profileId: number): void {
  window.localStorage.setItem(STORAGE_KEY, String(profileId));
}
