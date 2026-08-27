"use client";

import { useState } from "react";
import type { Profile } from "@/lib/fixtures";
import { toSen } from "@/lib/format";
import { validateProfile } from "@/lib/validateProfile";

export type DemoPersonaId = "aisyah" | "daniel" | "weijian" | "farah";

const DEMO_PERSONAS: { id: DemoPersonaId; label: string }[] = [
  { id: "aisyah", label: "Aisyah, 26" },
  { id: "daniel", label: "Daniel, 31" },
  { id: "weijian", label: "Wei Jian, 29" },
  { id: "farah", label: "Farah, 23" },
];

type Props = {
  initialProfile?: Profile;
  onSave: (profile: Profile) => void;
  onLoadDemo: (name: DemoPersonaId) => void;
};

type FieldValues = {
  label: string;
  income: string;
  fixedExpenses: string;
  varExpenses: string;
  savings: string;
  loanMonthly: string;
};

function toFieldValues(profile?: Profile): FieldValues {
  const ringgit = (sen: number) => String(sen / 100);
  return {
    label: profile?.label ?? "",
    income: profile ? ringgit(profile.income_sen) : "",
    fixedExpenses: profile ? ringgit(profile.fixed_expenses_sen) : "",
    varExpenses: profile ? ringgit(profile.var_expenses_sen) : "",
    savings: profile ? ringgit(profile.savings_sen) : "",
    loanMonthly: profile ? ringgit(profile.loan_monthly_sen) : "",
  };
}

export function ProfileForm({ initialProfile, onSave, onLoadDemo }: Props) {
  const [values, setValues] = useState<FieldValues>(() => toFieldValues(initialProfile));
  const [commitments] = useState(initialProfile?.commitments ?? []);
  const [error, setError] = useState<{ field: string; message: string } | null>(null);

  const set = (field: keyof FieldValues) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profile: Profile = {
      profile_id: initialProfile?.profile_id ?? null,
      label: values.label,
      income_sen: toSen(Number(values.income) || 0),
      fixed_expenses_sen: toSen(Number(values.fixedExpenses) || 0),
      var_expenses_sen: toSen(Number(values.varExpenses) || 0),
      savings_sen: toSen(Number(values.savings) || 0),
      loan_monthly_sen: toSen(Number(values.loanMonthly) || 0),
      commitments,
    };
    const validationError = validateProfile(profile);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    onSave(profile);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h2>Load a demo persona</h2>
        {DEMO_PERSONAS.map((persona) => (
          <button key={persona.id} type="button" onClick={() => onLoadDemo(persona.id)}>
            {persona.label}
          </button>
        ))}
      </div>

      <label htmlFor="profile-label">Label</label>
      <input id="profile-label" value={values.label} onChange={set("label")} />

      <label htmlFor="profile-income">Income (RM/month)</label>
      <input id="profile-income" type="number" value={values.income} onChange={set("income")} />

      <label htmlFor="profile-fixed-expenses">Fixed expenses (RM/month)</label>
      <input
        id="profile-fixed-expenses"
        type="number"
        value={values.fixedExpenses}
        onChange={set("fixedExpenses")}
      />

      <label htmlFor="profile-var-expenses">Variable expenses (RM/month)</label>
      <input
        id="profile-var-expenses"
        type="number"
        value={values.varExpenses}
        onChange={set("varExpenses")}
      />

      <label htmlFor="profile-savings">Savings (RM)</label>
      <input id="profile-savings" type="number" value={values.savings} onChange={set("savings")} />

      <label htmlFor="profile-loan-monthly">Loan monthly repayment (RM/month)</label>
      <input
        id="profile-loan-monthly"
        type="number"
        value={values.loanMonthly}
        onChange={set("loanMonthly")}
      />

      {error && <p role="alert">{error.message}</p>}

      <button type="submit">Save profile</button>
    </form>
  );
}
