"use client";

import type { Commitment, CommitmentKind } from "@/lib/fixtures";
import { summarizeCommitments } from "@/lib/aggregateCommitments";
import { fmtRm, toSen } from "@/lib/format";

type Props = {
  commitments: Commitment[];
  onChange: (commitments: Commitment[]) => void;
};

const KINDS: CommitmentKind[] = ["bnpl", "loan", "card", "other"];

type EditableField = "label" | "provider" | "kind" | "monthly_sen" | "outstanding_sen" | "months_left" | "next_due";

export function CommitmentsTable({ commitments, onChange }: Props) {
  const summary = summarizeCommitments(commitments);

  const updateField = (index: number, field: EditableField, rawValue: string) => {
    onChange(
      commitments.map((commitment, i) => {
        if (i !== index) return commitment;
        switch (field) {
          case "monthly_sen":
          case "outstanding_sen":
            return { ...commitment, [field]: toSen(Number(rawValue) || 0) };
          case "months_left":
            return { ...commitment, months_left: Number(rawValue) || 0 };
          case "next_due":
            return { ...commitment, next_due: rawValue || null };
          default:
            return { ...commitment, [field]: rawValue };
        }
      })
    );
  };

  const removeRow = (index: number) => {
    onChange(commitments.filter((_, i) => i !== index));
  };

  const addRow = () => {
    const nextId = Math.min(0, ...commitments.map((c) => c.commitment_id)) - 1;
    onChange([
      ...commitments,
      {
        commitment_id: nextId,
        label: "",
        provider: "",
        kind: "bnpl",
        monthly_sen: 0,
        outstanding_sen: 0,
        months_left: 0,
        next_due: null,
      },
    ]);
  };

  return (
    <div>
      <section>
        <h2>Summary</h2>
        <p>Commitments: <strong>{summary.count}</strong></p>
        <p>Monthly total: <strong>{fmtRm(summary.monthlyTotalSen)}</strong></p>
        <p>Outstanding total: <strong>{fmtRm(summary.outstandingTotalSen)}</strong></p>
        <p>Next due: <strong>{summary.nextDue ?? "None"}</strong></p>
      </section>

      <section>
        <h2>Obligations breakdown</h2>
        <ul>
          {KINDS.map((kind) => (
            <li key={kind}>
              {kind}: {summary.byKind[kind].count} commitments,{" "}
              {fmtRm(summary.byKind[kind].monthlyTotalSen)}/month
            </li>
          ))}
        </ul>
      </section>

      <table>
        <thead>
          <tr>
            <th>Label</th>
            <th>Provider</th>
            <th>Kind</th>
            <th>Monthly (RM)</th>
            <th>Outstanding (RM)</th>
            <th>Months left</th>
            <th>Next due</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {commitments.length === 0 && (
            <tr>
              <td colSpan={8}>No commitments yet.</td>
            </tr>
          )}
          {commitments.map((commitment, index) => (
            <tr key={commitment.commitment_id}>
              <td>
                <input
                  aria-label={`Label ${index + 1}`}
                  value={commitment.label}
                  onChange={(e) => updateField(index, "label", e.target.value)}
                />
              </td>
              <td>
                <input
                  aria-label={`Provider ${index + 1}`}
                  value={commitment.provider}
                  onChange={(e) => updateField(index, "provider", e.target.value)}
                />
              </td>
              <td>
                <select
                  aria-label={`Kind ${index + 1}`}
                  value={commitment.kind}
                  onChange={(e) => updateField(index, "kind", e.target.value)}
                >
                  {KINDS.map((kind) => (
                    <option key={kind} value={kind}>
                      {kind}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  aria-label={`Monthly ${index + 1}`}
                  type="number"
                  value={commitment.monthly_sen / 100}
                  onChange={(e) => updateField(index, "monthly_sen", e.target.value)}
                />
              </td>
              <td>
                <input
                  aria-label={`Outstanding ${index + 1}`}
                  type="number"
                  value={commitment.outstanding_sen / 100}
                  onChange={(e) => updateField(index, "outstanding_sen", e.target.value)}
                />
              </td>
              <td>
                <input
                  aria-label={`Months left ${index + 1}`}
                  type="number"
                  value={commitment.months_left}
                  onChange={(e) => updateField(index, "months_left", e.target.value)}
                />
              </td>
              <td>
                <input
                  aria-label={`Next due ${index + 1}`}
                  type="date"
                  value={commitment.next_due ?? ""}
                  onChange={(e) => updateField(index, "next_due", e.target.value)}
                />
              </td>
              <td>
                <button type="button" onClick={() => removeRow(index)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button type="button" onClick={addRow}>
        Add commitment
      </button>
    </div>
  );
}
