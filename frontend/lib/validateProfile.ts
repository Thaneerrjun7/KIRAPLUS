// Mirrors backend/services/profile_service.py's validation bounds, docs/API-CONTRACT.md §2,
// using the exact same field names and messages -- so ProfileForm can show an inline error
// before ever calling saveProfile. The backend remains the source of truth; this is a client-side
// preview of the same rules, not a replacement for server-side validation.

export type ProfileMoneyFields = {
  income_sen: number;
  fixed_expenses_sen: number;
  var_expenses_sen: number;
  savings_sen: number;
  loan_monthly_sen: number;
};

export type ValidationResult = { field: string; message: string } | null;

const NEGATIVE_CHECK_FIELDS = [
  "fixed_expenses_sen",
  "var_expenses_sen",
  "savings_sen",
  "loan_monthly_sen",
] as const;

export function validateProfile(profile: ProfileMoneyFields): ValidationResult {
  if (profile.income_sen <= 0) {
    return { field: "income_sen", message: "Income must be greater than 0." };
  }
  for (const field of NEGATIVE_CHECK_FIELDS) {
    if (profile[field] < 0) {
      return { field, message: `${field} cannot be negative.` };
    }
  }
  if (profile.fixed_expenses_sen + profile.var_expenses_sen > 10 * profile.income_sen) {
    return {
      field: "fixed_expenses_sen",
      message: "Expenses look implausibly high — please check.",
    };
  }
  return null;
}
