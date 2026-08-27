"use client";

import { useState } from "react";
import type { Profile } from "@/lib/fixtures";
import { AISYAH, DANIEL, FARAH, WEIJIAN } from "@/lib/fixtures";
import { toSen } from "@/lib/format";
import { validateProfile } from "@/lib/validateProfile";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

export type DemoPersonaId = "aisyah" | "daniel" | "weijian" | "farah";

const DEMO_PERSONAS: { id: DemoPersonaId; label: string; quote: string }[] = [
  { id: "aisyah", label: AISYAH.label, quote: AISYAH.quote },
  { id: "daniel", label: DANIEL.label, quote: DANIEL.quote },
  { id: "weijian", label: WEIJIAN.label, quote: WEIJIAN.quote },
  { id: "farah", label: FARAH.label, quote: FARAH.quote },
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

  const inputClasses =
    "mt-1 w-full border border-navy/15 bg-paper px-3 py-2 text-sm focus:border-teal focus:outline-none";
  const labelClasses = "block text-sm font-medium text-navy/80";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Card label="DEMO PERSONAS" className="p-6">
        <h2 className="font-display text-lg">Load a demo persona</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {DEMO_PERSONAS.map((persona) => (
            <button
              key={persona.id}
              type="button"
              onClick={() => onLoadDemo(persona.id)}
              className="border border-navy/10 p-4 text-left hover:border-teal"
            >
              <p className="font-display text-sm font-semibold">{persona.label}</p>
              <p className="mt-1.5 text-sm italic text-navy/70">&ldquo;{persona.quote}&rdquo;</p>
            </button>
          ))}
        </div>
      </Card>

      <Card label="YOUR PROFILE" className="p-6">
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="profile-label" className={labelClasses}>
              Label
            </label>
            <input
              id="profile-label"
              value={values.label}
              onChange={set("label")}
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="profile-income" className={labelClasses}>
              Income (RM/month)
            </label>
            <input
              id="profile-income"
              type="number"
              value={values.income}
              onChange={set("income")}
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="profile-fixed-expenses" className={labelClasses}>
              Fixed expenses (RM/month)
            </label>
            <input
              id="profile-fixed-expenses"
              type="number"
              value={values.fixedExpenses}
              onChange={set("fixedExpenses")}
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="profile-var-expenses" className={labelClasses}>
              Variable expenses (RM/month)
            </label>
            <input
              id="profile-var-expenses"
              type="number"
              value={values.varExpenses}
              onChange={set("varExpenses")}
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="profile-savings" className={labelClasses}>
              Savings (RM)
            </label>
            <input
              id="profile-savings"
              type="number"
              value={values.savings}
              onChange={set("savings")}
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="profile-loan-monthly" className={labelClasses}>
              Loan monthly repayment (RM/month)
            </label>
            <input
              id="profile-loan-monthly"
              type="number"
              value={values.loanMonthly}
              onChange={set("loanMonthly")}
              className={inputClasses}
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-risk-high">
              {error.message}
            </p>
          )}

          <Button type="submit" className="self-start">
            Save profile
          </Button>
        </div>
      </Card>
    </form>
  );
}
