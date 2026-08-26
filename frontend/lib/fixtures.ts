// Typed copies of the fixtures in data/mock-data.json. Source of truth is
// that file, not this one -- if they ever disagree, data/mock-data.json wins
// (see docs/API-CONTRACT.md §7, frontend/docs/testing.md). Re-sync this file
// by hand if the backend fixtures ever change; there is no build step wiring
// the two together on purpose, so a drift is visible in a failing test
// rather than silent.

export type CommitmentKind = "bnpl" | "loan" | "card" | "other";

export type Commitment = {
  commitment_id: number;
  provider: string;
  label: string;
  kind: CommitmentKind;
  monthly_sen: number;
  outstanding_sen: number;
  months_left: number;
  next_due: string | null;
};

export type Profile = {
  profile_id: number | null;
  label: string;
  income_sen: number;
  fixed_expenses_sen: number;
  var_expenses_sen: number;
  savings_sen: number;
  loan_monthly_sen: number;
  commitments: Commitment[];
};

export type Band = "LOW RISK" | "MODERATE RISK" | "HIGH RISK";

export type Features = {
  buffer_sen: number;
  outflow_sen: number;
  dsr: number;
  bnpl_ratio: number;
  buffer_ratio: number;
  runway_months: number;
  coverage: number;
  savings_months: number;
  commitment_ratio: number;
  n_bnpl: number;
};

export type Subscores = {
  debt_burden: number;
  bnpl_exposure: number;
  disposable_income: number;
  emergency_buffer: number;
  repayment_capacity: number;
  savings_resilience: number;
};

export type WarningCode =
  | "HIGH_BNPL"
  | "LOW_BUFFER"
  | "OVERCOMMITTED"
  | "THIN_SLACK"
  | "MULTI_COMMIT"
  | "MODEL_STRESS";

export type PersonaId = "aisyah" | "daniel" | "weijian" | "farah";

export type PersonaFixture = {
  id: PersonaId;
  label: string;
  quote: string;
  profile: Profile;
  expected: {
    score: number;
    band: Band;
    penalty: number;
    features: Features;
    subscores: Subscores;
    warningCodes: WarningCode[];
  };
};

export const AISYAH: PersonaFixture = {
  id: "aisyah",
  label: "Aisyah, 26",
  quote:
    "I always know I can pay it. I just never know what happens if something goes wrong that month.",
  profile: {
    profile_id: null,
    label: "Aisyah, 26",
    income_sen: 450000,
    fixed_expenses_sen: 198400,
    var_expenses_sen: 121600,
    savings_sen: 225000,
    loan_monthly_sen: 10000,
    commitments: [
      {
        commitment_id: 1,
        provider: "Atome",
        label: "Apparel — Uniqlo & Zara",
        kind: "bnpl",
        monthly_sen: 15000,
        outstanding_sen: 30000,
        months_left: 2,
        next_due: "2026-09-03",
      },
      {
        commitment_id: 2,
        provider: "SPayLater",
        label: "Air fryer & kitchen",
        kind: "bnpl",
        monthly_sen: 10000,
        outstanding_sen: 40000,
        months_left: 4,
        next_due: "2026-09-11",
      },
      {
        commitment_id: 3,
        provider: "PTPTN",
        label: "Student loan",
        kind: "loan",
        monthly_sen: 10000,
        outstanding_sen: 840000,
        months_left: 84,
        next_due: "2026-09-01",
      },
    ],
  },
  expected: {
    score: 68,
    band: "MODERATE RISK",
    penalty: 0.0,
    features: {
      buffer_sen: 95000,
      outflow_sen: 355000,
      dsr: 0.0778,
      bnpl_ratio: 0.0556,
      buffer_ratio: 0.2111,
      runway_months: 0.6338,
      coverage: 2.7143,
      savings_months: 0.5,
      commitment_ratio: 0.7889,
      n_bnpl: 2,
    },
    subscores: {
      debt_burden: 93.06,
      bnpl_exposure: 80.25,
      disposable_income: 70.37,
      emergency_buffer: 10.56,
      repayment_capacity: 100.0,
      savings_resilience: 16.67,
    },
    warningCodes: ["LOW_BUFFER"],
  },
};

export const DANIEL: PersonaFixture = {
  id: "daniel",
  label: "Daniel, 31",
  quote:
    "I don't need an app to tell me I'm fine. I need one that tells me the month I stop being fine.",
  profile: {
    profile_id: null,
    label: "Daniel, 31",
    income_sen: 720000,
    fixed_expenses_sen: 260000,
    var_expenses_sen: 130000,
    savings_sen: 2600000,
    loan_monthly_sen: 85000,
    commitments: [
      {
        commitment_id: 1,
        provider: "Maybank",
        label: "Car hire purchase",
        kind: "loan",
        monthly_sen: 62000,
        outstanding_sen: 4340000,
        months_left: 70,
        next_due: "2026-09-05",
      },
      {
        commitment_id: 2,
        provider: "PTPTN",
        label: "Student loan",
        kind: "loan",
        monthly_sen: 23000,
        outstanding_sen: 920000,
        months_left: 40,
        next_due: "2026-09-01",
      },
    ],
  },
  expected: {
    score: 94,
    band: "LOW RISK",
    penalty: 0.0,
    features: {
      buffer_sen: 245000,
      outflow_sen: 475000,
      dsr: 0.1181,
      bnpl_ratio: 0.0,
      buffer_ratio: 0.3403,
      runway_months: 5.4737,
      coverage: 2.8824,
      savings_months: 3.6111,
      commitment_ratio: 0.6597,
      n_bnpl: 0,
    },
    subscores: {
      debt_burden: 82.99,
      bnpl_exposure: 100.0,
      disposable_income: 100.0,
      emergency_buffer: 91.23,
      repayment_capacity: 100.0,
      savings_resilience: 100.0,
    },
    warningCodes: [],
  },
};

export const WEIJIAN: PersonaFixture = {
  id: "weijian",
  label: "Wei Jian, 29",
  quote: "Good week, no problem. Bad week, I'm choosing which one to pay late.",
  profile: {
    profile_id: null,
    label: "Wei Jian, 29",
    income_sen: 340000,
    fixed_expenses_sen: 150000,
    var_expenses_sen: 90000,
    savings_sen: 90000,
    loan_monthly_sen: 26000,
    commitments: [
      {
        commitment_id: 1,
        provider: "Atome",
        label: "Helmet & riding gear",
        kind: "bnpl",
        monthly_sen: 9000,
        outstanding_sen: 18000,
        months_left: 2,
        next_due: "2026-09-02",
      },
      {
        commitment_id: 2,
        provider: "SPayLater",
        label: "Phone accessories",
        kind: "bnpl",
        monthly_sen: 6000,
        outstanding_sen: 24000,
        months_left: 4,
        next_due: "2026-09-08",
      },
      {
        commitment_id: 3,
        provider: "Grab PayLater",
        label: "Groceries",
        kind: "bnpl",
        monthly_sen: 8000,
        outstanding_sen: 16000,
        months_left: 2,
        next_due: "2026-09-14",
      },
      {
        commitment_id: 4,
        provider: "Boost PayFlex",
        label: "Motorcycle tyres",
        kind: "bnpl",
        monthly_sen: 8000,
        outstanding_sen: 32000,
        months_left: 4,
        next_due: "2026-09-20",
      },
      {
        commitment_id: 5,
        provider: "Bank Rakyat",
        label: "Motorcycle loan",
        kind: "loan",
        monthly_sen: 26000,
        outstanding_sen: 780000,
        months_left: 30,
        next_due: "2026-09-05",
      },
    ],
  },
  expected: {
    score: 41,
    band: "HIGH RISK",
    penalty: 3.0,
    features: {
      buffer_sen: 43000,
      outflow_sen: 297000,
      dsr: 0.1676,
      bnpl_ratio: 0.0912,
      buffer_ratio: 0.1265,
      runway_months: 0.303,
      coverage: 0.7544,
      savings_months: 0.2647,
      commitment_ratio: 0.8735,
      n_bnpl: 4,
    },
    subscores: {
      debt_burden: 70.59,
      bnpl_exposure: 60.46,
      disposable_income: 42.16,
      emergency_buffer: 5.05,
      repayment_capacity: 37.72,
      savings_resilience: 8.82,
    },
    warningCodes: ["LOW_BUFFER", "MULTI_COMMIT"],
  },
};

export const FARAH: PersonaFixture = {
  id: "farah",
  label: "Farah, 23",
  quote: "Each one was only about a hundred ringgit a month. I genuinely didn't add them up.",
  profile: {
    profile_id: null,
    label: "Farah, 23",
    income_sen: 290000,
    fixed_expenses_sen: 145000,
    var_expenses_sen: 78000,
    savings_sen: 35000,
    loan_monthly_sen: 18000,
    commitments: [
      {
        commitment_id: 1,
        provider: "Atome",
        label: "Laptop",
        kind: "bnpl",
        monthly_sen: 16000,
        outstanding_sen: 96000,
        months_left: 6,
        next_due: "2026-09-04",
      },
      {
        commitment_id: 2,
        provider: "Boost PayFlex",
        label: "Mobile phone",
        kind: "bnpl",
        monthly_sen: 8000,
        outstanding_sen: 64000,
        months_left: 8,
        next_due: "2026-09-07",
      },
      {
        commitment_id: 3,
        provider: "SPayLater",
        label: "Skincare",
        kind: "bnpl",
        monthly_sen: 7000,
        outstanding_sen: 21000,
        months_left: 3,
        next_due: "2026-09-12",
      },
      {
        commitment_id: 4,
        provider: "SPayLater",
        label: "Clothing",
        kind: "bnpl",
        monthly_sen: 6000,
        outstanding_sen: 12000,
        months_left: 2,
        next_due: "2026-09-18",
      },
      {
        commitment_id: 5,
        provider: "Grab PayLater",
        label: "Food delivery",
        kind: "bnpl",
        monthly_sen: 6000,
        outstanding_sen: 12000,
        months_left: 2,
        next_due: "2026-09-22",
      },
      {
        commitment_id: 6,
        provider: "PTPTN",
        label: "Student loan",
        kind: "loan",
        monthly_sen: 18000,
        outstanding_sen: 640000,
        months_left: 40,
        next_due: "2026-09-01",
      },
    ],
  },
  expected: {
    score: 17,
    band: "HIGH RISK",
    penalty: 6.0,
    features: {
      buffer_sen: 6000,
      outflow_sen: 284000,
      dsr: 0.2103,
      bnpl_ratio: 0.1483,
      buffer_ratio: 0.0207,
      runway_months: 0.1232,
      coverage: 0.0984,
      savings_months: 0.1207,
      commitment_ratio: 0.9793,
      n_bnpl: 5,
    },
    subscores: {
      debt_burden: 59.91,
      bnpl_exposure: 28.74,
      disposable_income: 6.9,
      emergency_buffer: 2.05,
      repayment_capacity: 4.92,
      savings_resilience: 4.02,
    },
    warningCodes: ["LOW_BUFFER", "OVERCOMMITTED", "THIN_SLACK", "MULTI_COMMIT"],
  },
};

export const PERSONAS: readonly PersonaFixture[] = [AISYAH, DANIEL, WEIJIAN, FARAH];

// Aisyah's simulator scenarios -- the only persona data/mock-data.json's
// simulator_scenarios currently covers. See docs/API-CONTRACT.md §4, §9 and
// frontend/docs/architecture.md's Simulator component spec.
export type SimulatorScenario = {
  name: string;
  personaId: PersonaId;
  priceSen: number;
  tenureMonths: number;
  monthlySen: number;
  expected: {
    scoreBefore: number;
    scoreAfter: number;
    delta: number;
    bufferBeforeSen: number;
    bufferAfterSen: number;
    bandBefore: Band;
    bandAfter: Band;
    bandChanged: boolean;
  };
};

export const SIMULATOR_SCENARIOS: readonly SimulatorScenario[] = [
  {
    name: "Headphones",
    personaId: "aisyah",
    priceSen: 60000,
    tenureMonths: 6,
    monthlySen: 10000,
    expected: {
      scoreBefore: 68,
      scoreAfter: 62,
      delta: -6,
      bufferBeforeSen: 95000,
      bufferAfterSen: 85000,
      bandBefore: "MODERATE RISK",
      bandAfter: "MODERATE RISK",
      bandChanged: false,
    },
  },
  {
    name: "Furniture",
    personaId: "aisyah",
    priceSen: 180000,
    tenureMonths: 24,
    monthlySen: 7500,
    expected: {
      scoreBefore: 68,
      scoreAfter: 64,
      delta: -4,
      bufferBeforeSen: 95000,
      bufferAfterSen: 87500,
      bandBefore: "MODERATE RISK",
      bandAfter: "MODERATE RISK",
      bandChanged: false,
    },
  },
  {
    name: "Mobile phone",
    personaId: "aisyah",
    priceSen: 240000,
    tenureMonths: 12,
    monthlySen: 20000,
    expected: {
      scoreBefore: 68,
      scoreAfter: 54,
      delta: -14,
      bufferBeforeSen: 95000,
      bufferAfterSen: 75000,
      bandBefore: "MODERATE RISK",
      bandAfter: "MODERATE RISK",
      bandChanged: false,
    },
  },
  {
    name: "Laptop",
    personaId: "aisyah",
    priceSen: 360000,
    tenureMonths: 12,
    monthlySen: 30000,
    expected: {
      scoreBefore: 68,
      scoreAfter: 46,
      delta: -22,
      bufferBeforeSen: 95000,
      bufferAfterSen: 65000,
      bandBefore: "MODERATE RISK",
      bandAfter: "MODERATE RISK",
      bandChanged: false,
    },
  },
  {
    name: "Holiday",
    personaId: "aisyah",
    priceSen: 480000,
    tenureMonths: 6,
    monthlySen: 80000,
    expected: {
      scoreBefore: 68,
      scoreAfter: 18,
      delta: -50,
      bufferBeforeSen: 95000,
      bufferAfterSen: 15000,
      bandBefore: "MODERATE RISK",
      bandAfter: "HIGH RISK",
      bandChanged: true,
    },
  },
  {
    name: "Mobile phone, stretched to 24 months",
    personaId: "aisyah",
    priceSen: 240000,
    tenureMonths: 24,
    monthlySen: 10000,
    expected: {
      scoreBefore: 68,
      scoreAfter: 62,
      delta: -6,
      bufferBeforeSen: 95000,
      bufferAfterSen: 85000,
      bandBefore: "MODERATE RISK",
      bandAfter: "MODERATE RISK",
      bandChanged: false,
    },
  },
];

// code -> level, from data/mock-data.json's warning_rules.
export const WARNING_LEVELS: Record<WarningCode, "red" | "amber"> = {
  HIGH_BNPL: "red",
  LOW_BUFFER: "red",
  OVERCOMMITTED: "red",
  THIN_SLACK: "amber",
  MULTI_COMMIT: "amber",
  MODEL_STRESS: "amber",
};
