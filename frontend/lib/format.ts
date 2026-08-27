// The only sen<->ringgit conversion point in the codebase. See docs/API-CONTRACT.md §0, §9.
//
// This module -- not backend/utils/format.py -- is what the unit rule's
// "presentation layer" now means, since the presentation layer moved from
// Streamlit to this Next.js app. backend/utils/format.py still documents the
// same conversions for any Python-side use, but is no longer on the runtime
// display path.

export function fmtRm(sen: number): string {
  // 95000 -> "RM950"
  return `RM${Math.round(sen / 100)}`;
}

export function fmtRmCents(sen: number): string {
  // 95000 -> "RM950.00"
  return `RM${(sen / 100).toFixed(2)}`;
}

export function toSen(ringgit: number): number {
  // 950.0 -> 95000, banker-safe
  const cents = ringgit * 100;
  const floor = Math.floor(cents);
  const diff = cents - floor;
  if (diff < 0.5) return floor;
  if (diff > 0.5) return floor + 1;
  return floor % 2 === 0 ? floor : floor + 1;
}
