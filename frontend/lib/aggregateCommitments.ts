// Pure aggregation for the Commitments page's summary card and obligations breakdown.
// See frontend/docs/architecture.md's Commitments component spec.

import type { Commitment, CommitmentKind } from "./fixtures";

export type CommitmentsSummary = {
  count: number;
  monthlyTotalSen: number;
  outstandingTotalSen: number;
  nextDue: string | null;
  byKind: Record<CommitmentKind, { count: number; monthlyTotalSen: number }>;
};

export function summarizeCommitments(commitments: Commitment[]): CommitmentsSummary {
  const byKind: CommitmentsSummary["byKind"] = {
    bnpl: { count: 0, monthlyTotalSen: 0 },
    loan: { count: 0, monthlyTotalSen: 0 },
    card: { count: 0, monthlyTotalSen: 0 },
    other: { count: 0, monthlyTotalSen: 0 },
  };
  let monthlyTotalSen = 0;
  let outstandingTotalSen = 0;
  let nextDue: string | null = null;

  for (const commitment of commitments) {
    monthlyTotalSen += commitment.monthly_sen;
    outstandingTotalSen += commitment.outstanding_sen;
    byKind[commitment.kind].count += 1;
    byKind[commitment.kind].monthlyTotalSen += commitment.monthly_sen;
    if (commitment.next_due && (nextDue === null || commitment.next_due < nextDue)) {
      nextDue = commitment.next_due;
    }
  }

  return { count: commitments.length, monthlyTotalSen, outstandingTotalSen, nextDue, byKind };
}
