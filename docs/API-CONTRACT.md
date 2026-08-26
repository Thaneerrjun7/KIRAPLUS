# API Contract

**Status: frozen.** This file is the interface between the application layer (Developer 1) and the
domain layer (Developer 2). Neither side changes it unilaterally. If a change is genuinely needed,
both developers agree it, the version below is bumped, and every affected test is updated in the
same commit.

`engine_version` — `1.0.0`
`contract_version` — `1.0.0`

---

## 0. The unit rule — read this first

> **Every monetary value crossing this interface is an integer number of sen.**
> No floats. No ringgit. No exceptions below the presentation layer.

| Layer | Unit | Example |
|---|---|---|
| SQLite | integer sen | `450000` |
| Domain functions | integer sen | `income_sen=450000` |
| Domain return values | integer sen | `buffer_sen=95000` |
| Presentation only | formatted ringgit | `fmt_rm(95000)` → `"RM950"` |

`utils/format.py` owns the only conversion:

```python
def fmt_rm(sen: int) -> str:      # 95000 -> "RM950"
def fmt_rm_cents(sen: int) -> str # 95000 -> "RM950.00"
def to_sen(ringgit: float) -> int # 950.0 -> 95000, banker-safe
```

> **Update, §9:** the presentation layer moved from Streamlit to a Next.js frontend (see §9). The
> conversions above now live in `frontend/lib/format.ts`, not `utils/format.py` — `utils/format.py`
> still documents the same functions but is no longer on the runtime display path. Nothing about the
> rule itself changed: sen crosses every interface below presentation, ringgit is presentation-only.

**The KIRA Score is unit-invariant.** Every scoring factor is a ratio, so a profile expressed in sen
and the same profile expressed in ringgit produce an identical score. This is verified over 2,000
random profiles — see test `T-13`. Only absolute quantities (`buffer_sen`) carry the unit. This means
the persona fixtures return 68 / 94 / 41 / 17 in either unit, and you cannot silently break the score
by getting the unit wrong — but you *can* silently break every figure on screen. Hence the rule.

---

## 1. Types

```python
Profile = {
    "profile_id":         int | None,   # None until saved
    "label":              str,
    "income_sen":         int,          # > 0
    "fixed_expenses_sen": int,          # >= 0
    "var_expenses_sen":   int,          # >= 0
    "savings_sen":        int,          # >= 0
    "loan_monthly_sen":   int,          # >= 0, non-BNPL debt service
    "commitments":        list[Commitment],
}

Commitment = {
    "commitment_id": int | None,
    "label":         str,
    "provider":      str,                                  # free text
    "kind":          "bnpl" | "loan" | "card" | "other",
    "monthly_sen":   int,                                  # >= 0
    "outstanding_sen": int,                                # >= 0
    "months_left":   int,                                  # >= 0
    "next_due":      str | None,                           # ISO 8601 date
}
```

`bnpl_monthly_sen` and `n_bnpl` are **derived, never stored**:

```python
bnpl_monthly_sen = sum(c["monthly_sen"] for c in commitments if c["kind"] == "bnpl")
n_bnpl           = len([c for c in commitments if c["kind"] == "bnpl"])
```

If a stored aggregate ever disagrees with the commitment list, the list wins.

---

## 2. `profile_service`

### `save_profile(profile: Profile) -> dict`

Validates, persists, returns `{"profile_id": int, "updated_at": str}`.
Cascades commitment inserts. Raises `ValidationError` before touching the database.

### `load_profile(profile_id: int) -> Profile`
### `list_profiles() -> list[{profile_id, label, is_demo, updated_at}]`
### `load_demo(name: str) -> Profile`

`name` ∈ `{"aisyah", "daniel", "weijian", "farah"}`, read from `data/mock-data.json`.
Returns an unsaved `Profile` with `profile_id = None`.

**Validation bounds** — enforced in `profile_service`, mirrored as SQLite `CHECK` constraints:

| Field | Rule | Message on failure |
|---|---|---|
| `income_sen` | `> 0` | `"Income must be greater than 0."` |
| all other money | `>= 0` | `"<field> cannot be negative."` |
| `fixed + var` | `<= 10 × income` | `"Expenses look implausibly high — please check."` |
| `months_left` | `0 … 120` | `"Tenure must be between 0 and 120 months."` |

---

## 3. `scoring_service.assess(profile: Profile) -> Assessment`

The single entry point the UI calls for a score. Orchestrates
features → score → model → warnings.

```jsonc
// Assessment — canonical response, Aisyah fixture
{
  "score": 68,
  "band": "MODERATE RISK",              // "LOW RISK" | "MODERATE RISK" | "HIGH RISK"
  "penalty": 0.0,
  "features": {
    "debt_sen":         35000,
    "outflow_sen":      355000,
    "buffer_sen":       95000,
    "dsr":              0.0778,
    "bnpl_ratio":       0.0556,
    "buffer_ratio":     0.2111,
    "runway_months":    0.6338,
    "coverage":         2.7143,
    "savings_months":   0.5000,
    "commitment_ratio": 0.7889,
    "n_bnpl":           2
  },
  "subscores": {
    "debt_burden": 93.06, "bnpl_exposure": 80.25, "disposable_income": 70.37,
    "emergency_buffer": 10.56, "repayment_capacity": 100.00, "savings_resilience": 16.67
  },
  "contributions": {
    "debt_burden": 23.26, "bnpl_exposure": 16.05, "disposable_income": 14.07,
    "emergency_buffer": 1.58, "repayment_capacity": 12.00, "savings_resilience": 1.33
  },
  "warnings": [
    { "code": "LOW_BUFFER", "level": "red",
      "title": "Emergency buffer is thin",
      "detail": "Your savings cover 0.6 months of spending.",
      "lever": "Reaching one month would add roughly 5 points." }
  ],
  "p_stress_12m": 0.31,                 // null if the model artefact is absent
  "engine_version": "1.0.0",
  "disclaimer": "Assessment based on user-provided data. Not financial advice."
}
```

**Invariants the UI may rely on:**

- `score` is always an integer in `[0, 100]`.
- `sum(contributions.values())` equals the weighted total before `penalty`, to within `1e-9`.
- `contributions[k] == WEIGHTS[k] * subscores[k] / 100` exactly.
- `p_stress_12m` is `null`, never absent, when `models/stress_model.pkl` cannot be loaded.
- `warnings` is ordered most severe first and may be empty.
- `disclaimer` is always present and must be surfaced somewhere on the page.

**Warning codes** — the complete set. The UI must handle an unknown code by rendering
`title` and `detail` generically rather than crashing.

| Code | Level | Trigger |
|---|---|---|
| `HIGH_BNPL` | red | `bnpl_ratio > 0.15` |
| `LOW_BUFFER` | red | `runway_months < 1.0` |
| `OVERCOMMITTED` | red | `commitment_ratio > 0.90` |
| `THIN_SLACK` | amber | `buffer_ratio < 0.10` |
| `MULTI_COMMIT` | amber | `n_bnpl >= 4` |
| `MODEL_STRESS` | amber | `p_stress_12m > 0.50` |

**Documented gap, deliberately not in the MVP.** No rule fires on *repayment capacity* alone.
Wei Jian's monthly slack covers only 0.75× his debt service — a real risk that the score
reflects (41) but no warning names. A `THIN_COVERAGE` rule at `coverage < 1.0` would close it.
It is not in v1.0.0 because adding a rule after the fixtures are frozen means re-verifying
every expectation in section 7. Raise it as a v1.1 change if there is time on day 3.

---

## 4. `simulation_service.simulate(profile, price_sen, tenure_months) -> Simulation`

```jsonc
// Aisyah + RM2,400 over 12 months
{
  "monthly_sen": 20000,
  "before": { /* full Assessment */ },
  "after":  { /* full Assessment */ },
  "deltas": {
    "score":            -14,
    "buffer_sen":       -20000,
    "commitment_ratio": +0.0444,
    "bnpl_ratio":       +0.0444,
    "dsr":              +0.0444,
    "coverage":         -1.3507
  },
  "band_changed": false,
  "verdict": {
    "level": "amber",                   // "green" | "amber" | "red"
    "headline": "Higher financial stress",
    "detail": "This costs you 14 points."
  },
  "alternatives": [
    { "tenure_months": 6,  "monthly_sen": 40000, "score": 39, "delta": -29, "band": "HIGH RISK" },
    { "tenure_months": 18, "monthly_sen": 13333, "score": 59, "delta":  -9, "band": "MODERATE RISK" },
    { "tenure_months": 24, "monthly_sen": 10000, "score": 62, "delta":  -6, "band": "MODERATE RISK" }
  ]
}
```

**Rules:**

- `monthly_sen = round(price_sen / tenure_months)`.
- The simulated profile adds one commitment of `kind="bnpl"`; `n_bnpl` increments by exactly 1.
- `price_sen <= 0` or `tenure_months < 1` raises `ValidationError`. Do not clamp silently.
- `alternatives` always covers `{6, 12, 18, 24}` minus the requested tenure.
- Verdict precedence, evaluated in order: buffer would go negative → `red`;
  band worsens → `red`; `delta.score <= -10` → `amber`; otherwise → `green`.

**Banned strings.** The verdict layer must never emit `"you cannot afford"`, `"you should"`,
`"we recommend"`, or `"bad decision"`. Test `T-14` greps the rendered output for these.

---

## 5. `llm_service.explain(payload: dict) -> (text: str, source: str)`

`source` ∈ `{"llm", "template"}` and is displayed in the UI.

The payload is fixed and is the **only** thing the model receives. It never sees a raw `Profile`.

```jsonc
{
  "score": 68, "band": "MODERATE", "score_after": 54, "band_after": "MODERATE",
  "buffer_before_sen": 95000, "buffer_after_sen": 75000, "currency": "MYR",
  "factors": [ { "name": "Emergency buffer", "sub": 10.6, "weight": 15,
                 "contribution": 1.58, "rank": 1 } ],
  "warnings": ["LOW_BUFFER"],
  "p_stress_12m": 0.31,
  "purchase": { "price_sen": 240000, "tenure_months": 12, "monthly_sen": 20000 }
}
```

Guarantees the application layer may assume:

- Returns within **4 seconds**, always. Timeout falls back to the template.
- Never raises. Every failure path returns `(template_text, "template")`.
- Every numeral in a `source="llm"` response is present in the payload. Any numeral that is not
  voids the response and the template renders instead (`T-10`).
- Works with `LLM_API_KEY` unset (`T-11`).

---

## 6. Errors

One exception type crosses the boundary:

```python
class ValidationError(ValueError):
    field: str | None      # e.g. "income_sen"
    message: str           # user-facing, already plain English
```

Everything else is a bug. The application layer catches broad exceptions **only** at the page
boundary, logs with a correlation ID, and renders:

> Something went wrong on this page. Your data is safe. Reference: `a7f3`

No traceback ever reaches the screen (`D3-09`).

---

## 7. Fixtures both sides code against

Loaded from `data/mock-data.json`. If any of these drift, the deck is wrong — stop and fix the engine.

| Persona | Score | Band | `buffer_sen` | Warnings |
|---|---|---|---|---|
| `aisyah` | **68** | MODERATE RISK | 95000 | 1 — `LOW_BUFFER` |
| `daniel` | **94** | LOW RISK | 245000 | 0 |
| `weijian` | **41** | HIGH RISK | 43000 | 2 — `LOW_BUFFER`, `MULTI_COMMIT` |
| `farah` | **17** | HIGH RISK | 6000 | 4 — `LOW_BUFFER`, `OVERCOMMITTED`, `THIN_SLACK`, `MULTI_COMMIT` |

Counts exclude `MODEL_STRESS`, which requires the model artefact and may add one to any row.

| Simulation | Result |
|---|---|
| `aisyah` + `price_sen=240000`, `tenure_months=12` | 68 → **54**, buffer 95000 → 75000 |
| same purchase over 6 / 18 / 24 months | 39 / 59 / **62** — i.e. &minus;29 / &minus;9 / &minus;6 |

---

## 8. Changing this file

1. Both developers agree the change in writing.
2. Bump `contract_version`. Bump `engine_version` too if scoring output changes.
3. Update the fixtures table and `data/mock-data.json` in the same commit.
4. Re-run `pytest -q`. All tests green before merge to `main`.

A change that alters any number in section 7 is a change to the pitch deck as well. Tell Person 3.

---

## 9. HTTP transport (FastAPI)

The application layer is a Next.js frontend talking to a FastAPI backend over JSON. This section
documents the transport only — it wraps §2-§5 verbatim and changes no signature, no warning code and
no fixture. Adding or reshaping a route here does **not** require a `contract_version` bump unless it
changes what a §2-§5 function returns.

| Route | Wraps | Request body | Response |
|---|---|---|---|
| `POST /profiles` | `profile_service.save_profile` | `Profile` | `{profile_id, updated_at}` |
| `GET /profiles/{profile_id}` | `profile_service.load_profile` | — | `Profile` |
| `GET /profiles` | `profile_service.list_profiles` | — | `[{profile_id, label, is_demo, updated_at}]` |
| `GET /profiles/demo/{name}` | `profile_service.load_demo` | — | `Profile` |
| `POST /assess` | `scoring_service.assess` | `Profile` | `Assessment` |
| `POST /simulate` | `simulation_service.simulate` | `{profile, price_sen, tenure_months}` | `Simulation` |
| `POST /explain` | `llm_service.explain` | payload (§5) | `{text, source}` |
| `GET /health` | — | — | `{status: "ok"}` |

Every request/response body is the same integer-sen JSON already defined in §1-§5 — HTTP does not
introduce a new type system, just a transport. CORS is restricted to the frontend's origin
(`CORS_ALLOWED_ORIGINS` in `backend/.env.example`). The FastAPI layer (`backend/app/`) must never
contain scoring, warning, or simulation logic itself — only routing into `services/*.py`, same
constraint §2-§5 already put on the old Streamlit pages.
