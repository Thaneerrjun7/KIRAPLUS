// TEMPORARY DEMO-ONLY MOCK -- not part of the real backend, not Arjun's work. Delete this file once
// scoring_service/simulation_service are actually implemented and a real `uvicorn app.main:app` can
// be run instead (see backend/CLAUDE.md's "Local dev" section for that command).
//
// Purpose: let the dashboard/simulator pages render something instead of the 500s they currently get
// from scoring_service/simulation_service (still NotImplementedError while Arjun builds them), so
// anyone reviewing the frontend redesign can see it against real-shaped data without waiting on the
// real engine.
//
// Fidelity:
//   - The four demo personas (aisyah/daniel/weijian/farah) return the EXACT frozen numbers from
//     docs/API-CONTRACT.md §7 / data/mock-data.json -- score, band, subscores, warnings, all real.
//   - Any other (custom, hand-typed) profile gets a rough heuristic score -- plausible, monotonic,
//     but NOT the real scoring formula. Good enough to look at, not to test against.
//   - /simulate and /simulate/grid use a saturating approximation
//     (score_after = score_before * (1 - min(1, monthly_sen / buffer_before_sen))) calibrated
//     against the one real grid sample in the contract (Aisyah + RM2,400/12mo) -- close but not
//     exact off that one calibration point.
//
// Run:  node mock-backend.mjs                          (listens on :8010 by default)
// Then: cd frontend && NEXT_PUBLIC_API_URL=http://localhost:8010 npm run dev
// Uses :8010, not :8000, so it doesn't collide with a real `uvicorn app.main:app` you might
// already have running. Override with MOCK_PORT=xxxx if 8010 is also taken.

import { createServer } from "node:http";

const PORT = Number(process.env.MOCK_PORT) || 8010;

const WEIGHTS = {
  debt_burden: 25,
  bnpl_exposure: 20,
  disposable_income: 20,
  emergency_buffer: 15,
  repayment_capacity: 12,
  savings_resilience: 8,
};

function contributionsFrom(subscores) {
  const out = {};
  for (const k of Object.keys(WEIGHTS)) {
    out[k] = Math.round(((WEIGHTS[k] * subscores[k]) / 100) * 100) / 100;
  }
  return out;
}

function scoreToBand(score) {
  if (score >= 80) return "LOW RISK";
  if (score >= 50) return "MODERATE RISK";
  return "HIGH RISK";
}

const WARNING_META = {
  HIGH_BNPL: {
    level: "red",
    title: "BNPL exposure is high",
    lever: "Paying down or consolidating one BNPL line would bring this back under 15%.",
  },
  LOW_BUFFER: {
    level: "red",
    title: "Emergency buffer is thin",
    lever: "Building a bigger buffer would move this warning off red.",
  },
  OVERCOMMITTED: {
    level: "red",
    title: "You're overcommitted",
    lever: "Reducing any single commitment would ease this the fastest.",
  },
  THIN_SLACK: {
    level: "amber",
    title: "Very little slack left",
    lever: "Trimming a recurring expense would free up room here.",
  },
  MULTI_COMMIT: {
    level: "amber",
    title: "Multiple commitments stacking up",
    lever: "Consolidating due dates would make this easier to track, even without changing the total.",
  },
  MODEL_STRESS: {
    level: "amber",
    title: "Model flags elevated stress risk",
    lever: "This reflects the pattern across similar profiles, not a prediction about you specifically.",
  },
};

function bnplStats(commitments) {
  const bnpl = commitments.filter((c) => c.kind === "bnpl");
  const totalSen = bnpl.reduce((sum, c) => sum + c.monthly_sen, 0);
  const dueDates = new Set(bnpl.map((c) => c.next_due)).size;
  return { count: bnpl.length, totalSen, dueDates };
}

function buildWarnings(code, features, commitments) {
  const meta = WARNING_META[code];
  let detail = "";
  switch (code) {
    case "LOW_BUFFER":
      detail = `Your savings cover ${features.runway_months.toFixed(1)} months of spending. An unplanned RM1,000 expense would have to be financed.`;
      break;
    case "MULTI_COMMIT": {
      const { count, totalSen, dueDates } = bnplStats(commitments);
      detail = `${count} active commitments totalling RM${Math.round(totalSen / 100)} a month across ${dueDates} due dates.`;
      break;
    }
    case "OVERCOMMITTED":
      detail = `${Math.round(features.commitment_ratio * 100)}% of your income is already committed before any discretionary spending.`;
      break;
    case "THIN_SLACK":
      detail = `You have RM${Math.round(features.buffer_sen / 100)} left after all commitments — ${Math.round(features.buffer_ratio * 100)}% of income.`;
      break;
    case "HIGH_BNPL":
      detail = `BNPL repayments are ${Math.round(features.bnpl_ratio * 100)}% of your income. Above 15%, a single missed month tends to cascade.`;
      break;
    case "MODEL_STRESS":
      detail = `Profiles similar to yours ran short of cash within 12 months in ${Math.round((features.p_stress_12m ?? 0) * 100)}% of simulated paths.`;
      break;
    default:
      detail = "";
  }
  return { code, level: meta.level, title: meta.title, detail, lever: meta.lever };
}

// --- Persona fixtures, verbatim from docs/API-CONTRACT.md §7 / data/mock-data.json ---

const PERSONAS = {
  aisyah: {
    label: "Aisyah, 26",
    profile: {
      label: "Aisyah, 26",
      income_sen: 450000,
      fixed_expenses_sen: 198400,
      var_expenses_sen: 121600,
      savings_sen: 225000,
      loan_monthly_sen: 10000,
      commitments: [
        { commitment_id: 1, provider: "Atome", label: "Apparel — Uniqlo & Zara", kind: "bnpl", monthly_sen: 15000, outstanding_sen: 30000, months_left: 2, next_due: "2026-09-03" },
        { commitment_id: 2, provider: "SPayLater", label: "Air fryer & kitchen", kind: "bnpl", monthly_sen: 10000, outstanding_sen: 40000, months_left: 4, next_due: "2026-09-11" },
        { commitment_id: 3, provider: "PTPTN", label: "Student loan", kind: "loan", monthly_sen: 10000, outstanding_sen: 840000, months_left: 84, next_due: "2026-09-01" },
      ],
    },
    score: 68,
    penalty: 0.0,
    features: { debt_sen: 35000, outflow_sen: 355000, buffer_sen: 95000, dsr: 0.0778, bnpl_ratio: 0.0556, buffer_ratio: 0.2111, runway_months: 0.6338, coverage: 2.7143, savings_months: 0.5, commitment_ratio: 0.7889, n_bnpl: 2 },
    subscores: { debt_burden: 93.06, bnpl_exposure: 80.25, disposable_income: 70.37, emergency_buffer: 10.56, repayment_capacity: 100.0, savings_resilience: 16.67 },
    warningCodes: ["LOW_BUFFER"],
    p_stress_12m: 0.31,
  },
  daniel: {
    label: "Daniel, 31",
    profile: {
      label: "Daniel, 31",
      income_sen: 720000,
      fixed_expenses_sen: 260000,
      var_expenses_sen: 130000,
      savings_sen: 2600000,
      loan_monthly_sen: 85000,
      commitments: [
        { commitment_id: 1, provider: "Maybank", label: "Car hire purchase", kind: "loan", monthly_sen: 62000, outstanding_sen: 4340000, months_left: 70, next_due: "2026-09-05" },
        { commitment_id: 2, provider: "PTPTN", label: "Student loan", kind: "loan", monthly_sen: 23000, outstanding_sen: 920000, months_left: 40, next_due: "2026-09-01" },
      ],
    },
    score: 94,
    penalty: 0.0,
    features: { debt_sen: 85000, outflow_sen: 475000, buffer_sen: 245000, dsr: 0.1181, bnpl_ratio: 0.0, buffer_ratio: 0.3403, runway_months: 5.4737, coverage: 2.8824, savings_months: 3.6111, commitment_ratio: 0.6597, n_bnpl: 0 },
    subscores: { debt_burden: 82.99, bnpl_exposure: 100.0, disposable_income: 100.0, emergency_buffer: 91.23, repayment_capacity: 100.0, savings_resilience: 100.0 },
    warningCodes: [],
    p_stress_12m: 0.04,
  },
  weijian: {
    label: "Wei Jian, 29",
    profile: {
      label: "Wei Jian, 29",
      income_sen: 340000,
      fixed_expenses_sen: 150000,
      var_expenses_sen: 90000,
      savings_sen: 90000,
      loan_monthly_sen: 26000,
      commitments: [
        { commitment_id: 1, provider: "Atome", label: "Helmet & riding gear", kind: "bnpl", monthly_sen: 9000, outstanding_sen: 18000, months_left: 2, next_due: "2026-09-02" },
        { commitment_id: 2, provider: "SPayLater", label: "Phone accessories", kind: "bnpl", monthly_sen: 6000, outstanding_sen: 24000, months_left: 4, next_due: "2026-09-08" },
        { commitment_id: 3, provider: "Grab PayLater", label: "Groceries", kind: "bnpl", monthly_sen: 8000, outstanding_sen: 16000, months_left: 2, next_due: "2026-09-14" },
        { commitment_id: 4, provider: "Boost PayFlex", label: "Motorcycle tyres", kind: "bnpl", monthly_sen: 8000, outstanding_sen: 32000, months_left: 4, next_due: "2026-09-20" },
        { commitment_id: 5, provider: "Bank Rakyat", label: "Motorcycle loan", kind: "loan", monthly_sen: 26000, outstanding_sen: 780000, months_left: 30, next_due: "2026-09-05" },
      ],
    },
    score: 41,
    penalty: 3.0,
    features: { debt_sen: 57000, outflow_sen: 297000, buffer_sen: 43000, dsr: 0.1676, bnpl_ratio: 0.0912, buffer_ratio: 0.1265, runway_months: 0.303, coverage: 0.7544, savings_months: 0.2647, commitment_ratio: 0.8735, n_bnpl: 4 },
    subscores: { debt_burden: 70.59, bnpl_exposure: 60.46, disposable_income: 42.16, emergency_buffer: 5.05, repayment_capacity: 37.72, savings_resilience: 8.82 },
    warningCodes: ["LOW_BUFFER", "MULTI_COMMIT"],
    p_stress_12m: 0.38,
  },
  farah: {
    label: "Farah, 23",
    profile: {
      label: "Farah, 23",
      income_sen: 290000,
      fixed_expenses_sen: 145000,
      var_expenses_sen: 78000,
      savings_sen: 35000,
      loan_monthly_sen: 18000,
      commitments: [
        { commitment_id: 1, provider: "Atome", label: "Laptop", kind: "bnpl", monthly_sen: 16000, outstanding_sen: 96000, months_left: 6, next_due: "2026-09-04" },
        { commitment_id: 2, provider: "Boost PayFlex", label: "Mobile phone", kind: "bnpl", monthly_sen: 8000, outstanding_sen: 64000, months_left: 8, next_due: "2026-09-07" },
        { commitment_id: 3, provider: "SPayLater", label: "Skincare", kind: "bnpl", monthly_sen: 7000, outstanding_sen: 21000, months_left: 3, next_due: "2026-09-12" },
        { commitment_id: 4, provider: "SPayLater", label: "Clothing", kind: "bnpl", monthly_sen: 6000, outstanding_sen: 12000, months_left: 2, next_due: "2026-09-18" },
        { commitment_id: 5, provider: "Grab PayLater", label: "Food delivery", kind: "bnpl", monthly_sen: 6000, outstanding_sen: 12000, months_left: 2, next_due: "2026-09-22" },
        { commitment_id: 6, provider: "PTPTN", label: "Student loan", kind: "loan", monthly_sen: 18000, outstanding_sen: 640000, months_left: 40, next_due: "2026-09-01" },
      ],
    },
    score: 17,
    penalty: 6.0,
    features: { debt_sen: 61000, outflow_sen: 284000, buffer_sen: 6000, dsr: 0.2103, bnpl_ratio: 0.1483, buffer_ratio: 0.0207, runway_months: 0.1232, coverage: 0.0984, savings_months: 0.1207, commitment_ratio: 0.9793, n_bnpl: 5 },
    subscores: { debt_burden: 59.91, bnpl_exposure: 28.74, disposable_income: 6.9, emergency_buffer: 2.05, repayment_capacity: 4.92, savings_resilience: 4.02 },
    warningCodes: ["LOW_BUFFER", "OVERCOMMITTED", "THIN_SLACK", "MULTI_COMMIT"],
    p_stress_12m: 0.47,
  },
};

function fullAssessment(persona) {
  const features = { ...persona.features, p_stress_12m: persona.p_stress_12m };
  return {
    score: persona.score,
    band: scoreToBand(persona.score),
    penalty: persona.penalty,
    features: persona.features,
    subscores: persona.subscores,
    contributions: contributionsFrom(persona.subscores),
    warnings: persona.warningCodes.map((code) => buildWarnings(code, features, persona.profile.commitments)),
    p_stress_12m: persona.p_stress_12m,
    engine_version: "1.0.0",
    disclaimer: "Assessment based on user-provided data. Not financial advice. (mock-backend.mjs, not the real engine)",
  };
}

// Rough heuristic for any hand-typed profile that isn't one of the four personas above -- plausible
// shape, monotonic in the right directions, NOT the real scoring formula.
function heuristicAssessment(profile) {
  const bnpl = (profile.commitments ?? []).filter((c) => c.kind === "bnpl");
  const bnplMonthly = bnpl.reduce((s, c) => s + c.monthly_sen, 0);
  const nBnpl = bnpl.length;
  const income = Math.max(profile.income_sen, 1);
  const outflow = profile.fixed_expenses_sen + profile.var_expenses_sen + profile.loan_monthly_sen + bnplMonthly;
  const buffer = income - outflow;
  const dsr = (profile.loan_monthly_sen + bnplMonthly) / income;
  const bnplRatio = bnplMonthly / income;
  const bufferRatio = buffer / income;
  const commitmentRatio = outflow / income;
  const runwayMonths = profile.savings_sen / Math.max(outflow, 1);
  const savingsMonths = profile.savings_sen / income;
  const coverage = Math.max(income - profile.fixed_expenses_sen - profile.var_expenses_sen, 0) / Math.max(profile.loan_monthly_sen + bnplMonthly, 1);

  const clamp = (v) => Math.max(0, Math.min(100, v));
  const subscores = {
    debt_burden: clamp(100 - dsr * 250),
    bnpl_exposure: clamp(100 - bnplRatio * 400),
    disposable_income: clamp(100 - commitmentRatio * 100),
    emergency_buffer: clamp(runwayMonths * 60),
    repayment_capacity: clamp(coverage * 40),
    savings_resilience: clamp(savingsMonths * 40),
  };
  const contributions = contributionsFrom(subscores);
  const score = Math.round(Math.max(0, Math.min(100, Object.values(contributions).reduce((a, b) => a + b, 0))));

  const features = { debt_sen: profile.loan_monthly_sen + bnplMonthly, outflow_sen: outflow, buffer_sen: buffer, dsr, bnpl_ratio: bnplRatio, buffer_ratio: bufferRatio, runway_months: runwayMonths, coverage, savings_months: savingsMonths, commitment_ratio: commitmentRatio, n_bnpl: nBnpl };

  const warningCodes = [];
  if (bnplRatio > 0.15) warningCodes.push("HIGH_BNPL");
  if (runwayMonths < 1.0) warningCodes.push("LOW_BUFFER");
  if (commitmentRatio > 0.9) warningCodes.push("OVERCOMMITTED");
  if (bufferRatio < 0.1) warningCodes.push("THIN_SLACK");
  if (nBnpl >= 4) warningCodes.push("MULTI_COMMIT");

  return {
    score,
    band: scoreToBand(score),
    penalty: 0,
    features,
    subscores,
    contributions,
    warnings: warningCodes.map((code) => buildWarnings(code, { ...features, p_stress_12m: null }, profile.commitments ?? [])),
    p_stress_12m: null,
    engine_version: "1.0.0",
    disclaimer: "Assessment based on user-provided data. Not financial advice. (mock-backend.mjs heuristic -- not the real engine)",
  };
}

function personaForProfile(profile) {
  const label = (profile.label ?? "").trim().toLowerCase();
  return Object.values(PERSONAS).find((p) => p.label.toLowerCase() === label) ?? null;
}

function assessProfile(profile) {
  const persona = personaForProfile(profile);
  return persona ? fullAssessment(persona) : heuristicAssessment(profile);
}

// Saturating approximation, calibrated against the one real grid sample the contract publishes
// (Aisyah + RM240,000/12mo -> 54, buffer 95000 -> 75000): score_after = score_before * (1 - ratio),
// ratio = min(1, monthly_sen / buffer_before_sen).
function scoreAfterPurchase(scoreBefore, bufferBeforeSen, monthlySen) {
  const ratio = bufferBeforeSen > 0 ? Math.min(1, monthlySen / bufferBeforeSen) : 1;
  return Math.round(Math.max(0, Math.min(100, scoreBefore * (1 - ratio))));
}

function buildGrid(before, priceSen) {
  const entries = [];
  for (let t = 1; t <= 36; t++) {
    const monthlySen = Math.round(priceSen / t);
    const score = scoreAfterPurchase(before.score, before.features.buffer_sen, monthlySen);
    entries.push({ tenure_months: t, monthly_sen: monthlySen, score, band: scoreToBand(score), delta: score - before.score });
  }
  return entries;
}

// --- In-memory profile store (POST /profiles / GET /profiles/:id) ---

let nextProfileId = 5001;
const savedProfiles = new Map();

function jsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function send(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(payload);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  console.log(`${req.method} ${url.pathname}`);

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    return res.end();
  }

  try {
    if (req.method === "GET" && url.pathname === "/health") {
      return send(res, 200, { status: "ok" });
    }

    const demoMatch = url.pathname.match(/^\/profiles\/demo\/([a-z]+)$/);
    if (req.method === "GET" && demoMatch) {
      const persona = PERSONAS[demoMatch[1]];
      if (!persona) return send(res, 404, { message: `Unknown demo persona: ${demoMatch[1]}` });
      return send(res, 200, { ...persona.profile, profile_id: null });
    }

    if (req.method === "GET" && url.pathname === "/profiles") {
      const list = [...savedProfiles.entries()].map(([id, p]) => ({
        profile_id: id,
        label: p.label,
        is_demo: false,
        updated_at: p.updated_at,
      }));
      return send(res, 200, list);
    }

    const idMatch = url.pathname.match(/^\/profiles\/(\d+)$/);
    if (req.method === "GET" && idMatch) {
      const stored = savedProfiles.get(Number(idMatch[1]));
      if (!stored) return send(res, 404, { message: "Profile not found." });
      return send(res, 200, { ...stored.profile, profile_id: Number(idMatch[1]) });
    }

    if (req.method === "POST" && url.pathname === "/profiles") {
      const profile = await jsonBody(req);
      const profileId = nextProfileId++;
      const updatedAt = new Date().toISOString();
      savedProfiles.set(profileId, { profile, label: profile.label, updated_at: updatedAt });
      return send(res, 200, { profile_id: profileId, updated_at: updatedAt });
    }

    if (req.method === "POST" && url.pathname === "/assess") {
      const profile = await jsonBody(req);
      return send(res, 200, assessProfile(profile));
    }

    if (req.method === "POST" && url.pathname === "/simulate/grid") {
      const { profile, price_sen: priceSen } = await jsonBody(req);
      if (!priceSen || priceSen <= 0) return send(res, 422, { field: "price_sen", message: "Price must be greater than 0." });
      const before = assessProfile(profile);
      return send(res, 200, buildGrid(before, priceSen));
    }

    if (req.method === "POST" && url.pathname === "/simulate") {
      const { profile, price_sen: priceSen, tenure_months: tenureMonths } = await jsonBody(req);
      if (!priceSen || priceSen <= 0) return send(res, 422, { field: "price_sen", message: "Price must be greater than 0." });
      if (!tenureMonths || tenureMonths < 1) return send(res, 422, { field: "tenure_months", message: "Tenure must be at least 1 month." });

      const before = assessProfile(profile);
      const monthlySen = Math.round(priceSen / tenureMonths);
      const scoreAfter = scoreAfterPurchase(before.score, before.features.buffer_sen, monthlySen);
      const bandAfter = scoreToBand(scoreAfter);
      const bufferAfterSen = before.features.buffer_sen - monthlySen;

      const after = {
        ...before,
        score: scoreAfter,
        band: bandAfter,
        features: { ...before.features, buffer_sen: bufferAfterSen, n_bnpl: before.features.n_bnpl + 1 },
      };

      const bandChanged = after.band !== before.band;
      const deltaScore = scoreAfter - before.score;
      let verdict;
      if (bufferAfterSen < 0) {
        verdict = { level: "red", headline: "This would put you in the red", detail: "Your buffer would go negative." };
      } else if (bandChanged && (before.band === "LOW RISK" || before.band === "MODERATE RISK")) {
        verdict = { level: "red", headline: "This changes your risk band", detail: `Your band moves to ${bandAfter}.` };
      } else if (deltaScore <= -10) {
        verdict = { level: "amber", headline: "Higher financial stress", detail: `This costs you ${-deltaScore} points.` };
      } else {
        verdict = { level: "green", headline: "Manageable", detail: `This costs you ${-deltaScore} points.` };
      }

      const ALT_TENURES = [6, 12, 18, 24].filter((t) => t !== tenureMonths);
      const alternatives = ALT_TENURES.map((t) => {
        const altMonthly = Math.round(priceSen / t);
        const altScore = scoreAfterPurchase(before.score, before.features.buffer_sen, altMonthly);
        return { tenure_months: t, monthly_sen: altMonthly, score: altScore, delta: altScore - before.score, band: scoreToBand(altScore) };
      });

      return send(res, 200, {
        monthly_sen: monthlySen,
        before,
        after,
        deltas: {
          score: deltaScore,
          buffer_sen: bufferAfterSen - before.features.buffer_sen,
          commitment_ratio: after.features.commitment_ratio - before.features.commitment_ratio,
          bnpl_ratio: after.features.bnpl_ratio - before.features.bnpl_ratio,
          dsr: after.features.dsr - before.features.dsr,
          coverage: after.features.coverage - before.features.coverage,
        },
        band_changed: bandChanged,
        verdict,
        alternatives,
      });
    }

    if (req.method === "POST" && url.pathname === "/explain") {
      const payload = await jsonBody(req);
      const top = payload.factors?.[0];
      const parts = [`Your KIRA Score is ${payload.score} (${payload.band}).`];
      parts.push(top ? `The biggest factor holding it back is ${String(top.name).toLowerCase()}.` : "");
      parts.push(payload.warnings?.length ? `You have ${payload.warnings.length} active warning${payload.warnings.length > 1 ? "s" : ""} to review.` : "No warnings are active right now.");
      if (payload.purchase) {
        const delta = (payload.score_after ?? payload.score) - payload.score;
        parts.push(`Adding this purchase would change your score by ${delta >= 0 ? "+" : ""}${delta} points.`);
      }
      return send(res, 200, { text: parts.filter(Boolean).join(" "), source: "template" });
    }

    return send(res, 404, { message: `No mock route for ${req.method} ${url.pathname}` });
  } catch (err) {
    console.error(err);
    return send(res, 500, { message: "Mock server error", detail: String(err) });
  }
});

server.listen(PORT, () => {
  console.log(`KIRA+ mock backend on http://localhost:${PORT}`);
  console.log("Demo personas: aisyah, daniel, weijian, farah -- load one on /profile, save it, then visit /dashboard or /simulator.");
  console.log("This is a rough visual mock, not the real scoring engine -- see the file header.");
});
