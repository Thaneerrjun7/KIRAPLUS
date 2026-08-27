// Pure aggregation for the Commitments page's summary card and obligations breakdown.
// architecture.md: "aggregate card (count, monthly total, outstanding total, next due date)".

import { describe, expect, it } from "vitest";
import { summarizeCommitments } from "./aggregateCommitments";
import { AISYAH } from "./fixtures";

describe("summarizeCommitments", () => {
  it("returns zeroes and no next due date for an empty list", () => {
    const summary = summarizeCommitments([]);
    expect(summary.count).toBe(0);
    expect(summary.monthlyTotalSen).toBe(0);
    expect(summary.outstandingTotalSen).toBe(0);
    expect(summary.nextDue).toBeNull();
  });

  it("sums Aisyah's three commitments correctly", () => {
    const summary = summarizeCommitments(AISYAH.profile.commitments);
    expect(summary.count).toBe(3);
    expect(summary.monthlyTotalSen).toBe(35000);
    expect(summary.outstandingTotalSen).toBe(910000);
    expect(summary.nextDue).toBe("2026-09-01");
  });

  it("breaks down count and monthly total by kind", () => {
    const summary = summarizeCommitments(AISYAH.profile.commitments);
    expect(summary.byKind.bnpl).toEqual({ count: 2, monthlyTotalSen: 25000 });
    expect(summary.byKind.loan).toEqual({ count: 1, monthlyTotalSen: 10000 });
    expect(summary.byKind.card).toEqual({ count: 0, monthlyTotalSen: 0 });
  });

  it("ignores a null next_due when finding the earliest date", () => {
    const summary = summarizeCommitments([
      { ...AISYAH.profile.commitments[0], next_due: null },
      AISYAH.profile.commitments[1],
    ]);
    expect(summary.nextDue).toBe(AISYAH.profile.commitments[1].next_due);
  });
});
