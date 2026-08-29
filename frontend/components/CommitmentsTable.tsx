"use client";

import type { Commitment, CommitmentKind } from "@/lib/fixtures";
import { summarizeCommitments } from "@/lib/aggregateCommitments";
import { fmtRm, toSen } from "@/lib/format";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { StatTile } from "./ui/StatTile";

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
    <div className="flex flex-col gap-6">
      <Card label="SUMMARY" className="p-6">
        <div className="flex flex-col gap-2.5">
          <StatTile label="Commitments" value={String(summary.count)} />
          <StatTile label="Monthly total" value={fmtRm(summary.monthlyTotalSen)} />
          <StatTile label="Outstanding total" value={fmtRm(summary.outstandingTotalSen)} />
          <StatTile label="Next due" value={summary.nextDue ?? "None"} />
        </div>
      </Card>

      <Card label="OBLIGATIONS BREAKDOWN" className="p-6">
        <div className="flex flex-col gap-2.5">
          {KINDS.map((kind) => (
            <div key={kind} className="flex items-center gap-2 text-sm">
              <Badge>{kind.toUpperCase()}</Badge>
              <span className="text-slate">
                {summary.byKind[kind].count} commitments,{" "}
                {fmtRm(summary.byKind[kind].monthlyTotalSen)}/month
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card label="EDIT COMMITMENTS" className="p-6">
        <div data-testid="commitments-desktop" className="hidden md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-mist">
                <th className="pb-2">Label</th>
                <th className="pb-2">Provider</th>
                <th className="pb-2">Kind</th>
                <th className="pb-2">Monthly (RM)</th>
                <th className="pb-2">Outstanding (RM)</th>
                <th className="pb-2">Months left</th>
                <th className="pb-2">Next due</th>
                <th className="pb-2" />
              </tr>
            </thead>
            <tbody>
              {commitments.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-4 text-slate">
                    No commitments yet.
                  </td>
                </tr>
              )}
              {commitments.map((commitment, index) => (
                <tr key={commitment.commitment_id} className="border-t border-border">
                  <td className="py-2">
                    <input
                      aria-label={`Label ${index + 1}`}
                      value={commitment.label}
                      onChange={(e) => updateField(index, "label", e.target.value)}
                      className="w-full rounded-xl border border-border px-2 py-1"
                    />
                  </td>
                  <td className="py-2">
                    <input
                      aria-label={`Provider ${index + 1}`}
                      value={commitment.provider}
                      onChange={(e) => updateField(index, "provider", e.target.value)}
                      className="w-full rounded-xl border border-border px-2 py-1"
                    />
                  </td>
                  <td className="py-2">
                    <select
                      aria-label={`Kind ${index + 1}`}
                      value={commitment.kind}
                      onChange={(e) => updateField(index, "kind", e.target.value)}
                      className="rounded-xl border border-border px-2 py-1"
                    >
                      {KINDS.map((kind) => (
                        <option key={kind} value={kind}>
                          {kind}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2">
                    <input
                      aria-label={`Monthly ${index + 1}`}
                      type="number"
                      value={commitment.monthly_sen / 100}
                      onChange={(e) => updateField(index, "monthly_sen", e.target.value)}
                      className="w-24 rounded-xl border border-border px-2 py-1 tabular-nums"
                    />
                  </td>
                  <td className="py-2">
                    <input
                      aria-label={`Outstanding ${index + 1}`}
                      type="number"
                      value={commitment.outstanding_sen / 100}
                      onChange={(e) => updateField(index, "outstanding_sen", e.target.value)}
                      className="w-24 rounded-xl border border-border px-2 py-1 tabular-nums"
                    />
                  </td>
                  <td className="py-2">
                    <input
                      aria-label={`Months left ${index + 1}`}
                      type="number"
                      value={commitment.months_left}
                      onChange={(e) => updateField(index, "months_left", e.target.value)}
                      className="w-20 rounded-xl border border-border px-2 py-1 tabular-nums"
                    />
                  </td>
                  <td className="py-2">
                    <input
                      aria-label={`Next due ${index + 1}`}
                      type="date"
                      value={commitment.next_due ?? ""}
                      onChange={(e) => updateField(index, "next_due", e.target.value)}
                      className="rounded-xl border border-border px-2 py-1"
                    />
                  </td>
                  <td className="py-2">
                    <button
                      type="button"
                      onClick={() => removeRow(index)}
                      className="text-xs text-risk-high hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div data-testid="commitments-mobile" className="flex flex-col gap-3 md:hidden">
          {commitments.length === 0 && <p className="text-slate">No commitments yet.</p>}
          {commitments.map((commitment, index) => (
            <div
              key={commitment.commitment_id}
              className="rounded-xl border border-border bg-surface p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <input
                    aria-label={`Label ${index + 1}`}
                    value={commitment.label}
                    onChange={(e) => updateField(index, "label", e.target.value)}
                    placeholder="Label"
                    className="w-full rounded-xl border border-border px-2 py-1 text-sm font-semibold"
                  />
                  <input
                    aria-label={`Provider ${index + 1}`}
                    value={commitment.provider}
                    onChange={(e) => updateField(index, "provider", e.target.value)}
                    placeholder="Provider"
                    className="mt-1 w-full rounded-xl border border-border px-2 py-1 text-xs text-slate"
                  />
                </div>
                <select
                  aria-label={`Kind ${index + 1}`}
                  value={commitment.kind}
                  onChange={(e) => updateField(index, "kind", e.target.value)}
                  className="rounded-xl border border-border px-2 py-1 text-xs uppercase"
                >
                  {KINDS.map((kind) => (
                    <option key={kind} value={kind}>
                      {kind}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] uppercase text-mist">Monthly (RM)</p>
                  <input
                    aria-label={`Monthly ${index + 1}`}
                    type="number"
                    value={commitment.monthly_sen / 100}
                    onChange={(e) => updateField(index, "monthly_sen", e.target.value)}
                    className="mt-0.5 w-full rounded-xl border border-border px-2 py-1 text-sm tabular-nums"
                  />
                </div>
                <div>
                  <p className="text-[10px] uppercase text-mist">Outstanding (RM)</p>
                  <input
                    aria-label={`Outstanding ${index + 1}`}
                    type="number"
                    value={commitment.outstanding_sen / 100}
                    onChange={(e) => updateField(index, "outstanding_sen", e.target.value)}
                    className="mt-0.5 w-full rounded-xl border border-border px-2 py-1 text-sm tabular-nums"
                  />
                </div>
                <div>
                  <p className="text-[10px] uppercase text-mist">Months left</p>
                  <input
                    aria-label={`Months left ${index + 1}`}
                    type="number"
                    value={commitment.months_left}
                    onChange={(e) => updateField(index, "months_left", e.target.value)}
                    className="mt-0.5 w-full rounded-xl border border-border px-2 py-1 text-sm tabular-nums"
                  />
                </div>
                <div>
                  <p className="text-[10px] uppercase text-mist">Next due</p>
                  <input
                    aria-label={`Next due ${index + 1}`}
                    type="date"
                    value={commitment.next_due ?? ""}
                    onChange={(e) => updateField(index, "next_due", e.target.value)}
                    className="mt-0.5 w-full rounded-xl border border-border px-2 py-1 text-sm"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeRow(index)}
                className="mt-3 text-xs text-risk-high hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <Button variant="secondary" onClick={addRow} className="mt-4">
          Add commitment
        </Button>
      </Card>
    </div>
  );
}
