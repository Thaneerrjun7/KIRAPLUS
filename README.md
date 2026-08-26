# KIRA+

**Kira Dulu. Baru Commit.** — *Calculate first, then commit.*

KIRA+ consolidates every Buy Now Pay Later commitment you hold into one view, scores your financial health out of 100 with the full working shown, and lets you simulate a purchase **before** you agree to it.

*Kira* is Malay for *to calculate*.

---

## The problem

As of **Q1 2026**, Malaysians hold **8.0 million active BNPL accounts** carrying **RM5.3 billion** in outstanding balances. RM181 million of that is overdue — 3.4% of total BNPL balances, and 0.3% of national household debt. Across full-year 2025 the market ran **243 million transactions worth RM21.3 billion**, at an average of RM91 each.

In the same country, **61% of Malaysians report difficulty raising RM1,000 for an emergency** — up from 47% in 2021.

The structural issue is not the debt. It is that **nobody can see the total**:

- Each provider sees only its own plans. Shopee does not know what you owe Atome.
- BNPL commitments do not currently appear in CCRIS or CTOS credit reports.
- The borrower has no consolidated view either — just several apps with several separate due dates.

The result is *stacking*: commitments that are individually small and collectively unpayable, discovered only when a payment fails. Transaction volume is growing faster than transaction value, which means Malaysians are taking **more** BNPL commitments rather than larger ones — exactly the pattern a per-provider view cannot see.

## What KIRA+ does

1. **Consolidates** every BNPL plan, loan and recurring obligation into one ledger with one monthly total.
2. **Scores** financial health 0–100 from six published, weighted factors — no black box.
3. **Explains** the score by showing each factor's sub-score, weight and exact contribution.
4. **Simulates** a purchase you have not made yet, and shows what it does to your buffer, your ratios and your score.
5. **Warns** on high BNPL exposure, thin buffers, multiple concurrent commitments and projected stress.

Not a budgeting app. Budgeting apps look backwards at what you spent. KIRA+ looks forward at what a new commitment would cost you.

---

## MVP scope

Five screens, six core features, three days, two developers.

| Screen | Does |
|---|---|
| Profile | Income, fixed and variable expenses, savings, existing commitments. Four one-click demo personas. |
| Commitments | Every BNPL plan and loan in one table, with the aggregate monthly total and upcoming due dates. |
| Dashboard | KIRA Score, risk band, six-factor breakdown, warning flags, plain-language explanation. |
| Simulator | Enter a purchase and tenure. Before/after on buffer, ratios, score and band. **The reason the product exists.** |
| About | Scoring methodology, factor weights, synthetic-data disclosure, limitations. |

### Explicitly out of scope for the MVP

- **Direct provider API, bank or open-banking integration.** BNM's Open Finance framework is at exposure-draft stage with a phased rollout beginning with larger banks; non-bank BNPL data sharing is not available to us today. User-supplied data is the only route currently open.
- **Credit score prediction.** CTOS weightings are not public; modelling them would be guesswork presented as fact. KIRA+ does not predict, replace or approximate a CTOS score.
- **Lending decisions.** KIRA+ does not approve, decline or price credit.
- **Authentication and stored personal data.** No accounts, no credentials, no real financial data on a public host. See *Data* below.
- **Conversational assistant.** Deferred, and deliberately not the headline.

---

## How the AI is used

Deliberately narrow, in three separate layers. **No language model computes any figure with a ringgit sign attached.**

| Layer | Component | Method | Why |
|---|---|---|---|
| 1 | KIRA Score, risk breakdown, simulator arithmetic | **Deterministic rules** | Must be explainable, stable and reproducible by hand. A hallucinated score would make the product worse than useless. |
| 2 | 12-month financial stress probability | **Supervised classifier** (scikit-learn Random Forest) | The target is the outcome of a Monte-Carlo simulation of household cash flow under random shocks — *not* a function of the scoring rules. Genuine learning problem with irreducible noise. |
| 3 | Plain-language explanation and education | **LLM, grounded and guarded** | Receives a fixed JSON payload of already-computed values. Never computes, never recommends. Every numeral in its output is checked against the payload; anything unrecognised voids the response and a template renders instead. |

**Rules decide. The model predicts. The language model explains.**

The app is fully functional with no LLM API key and no network connection.

### Model performance

Measured on 12,000 synthetic profiles, held-out 25% test split, positive class rate 14.3%:

| Metric | Value |
|---|---|
| ROC-AUC (held out) | **0.923** |
| ROC-AUC (5-fold CV) | 0.921 ± 0.005 |
| Recall, stress class | 0.790 |
| Brier score | 0.097 |
| Accuracy | 0.853 |

Two baselines, reported deliberately:

- **Majority class**: 0.857 accuracy, 0.500 ROC-AUC. Predicting "no stress" for everyone beats our accuracy and is useless — which is why accuracy is not our headline metric.
- **KIRA Score alone** (logistic): 0.844 ROC-AUC. The model adds **+0.079 AUC** over the deterministic score.

The classifier is tuned for recall, not accuracy. For an early-warning system a false alarm costs a moment of attention; a miss costs a household.

---

## Scoring methodology

Published in full, because a score a user cannot audit is a score a user should not trust.

| Factor | Feature | Weight | Scores 0 at | Scores 100 at |
|---|---|---|---|---|
| Debt burden | debt service ratio | 25 | 0.45 | 0.05 |
| BNPL exposure | BNPL ÷ income | 20 | 0.20 | 0.02 |
| Disposable income | buffer ÷ income | 20 | 0.00 | 0.30 |
| Emergency buffer | savings ÷ monthly outflow | 15 | 0 months | 6 months |
| Repayment capacity | buffer ÷ debt service | 12 | 0× | 2× |
| Savings resilience | savings ÷ income | 8 | 0 months | 3 months |

```
sub(x, zero_at, full_at) = clamp(100 × (x − zero_at) / (full_at − zero_at), 0, 100)
weighted   = Σ (weightᵢ × subᵢ) / 100
penalty    = min(10, 3 × max(0, n_bnpl − 3))
KIRA Score = round(clamp(weighted − penalty, 0, 100))

band = LOW ≥ 70  ·  MODERATE 45–69  ·  HIGH < 45
```

The score is built on **debt service ratio** and **net disposable income** — the same measures the Consumer Credit Act 2025 requires licensed credit providers to consider when assessing affordability against a consumer's existing commitments.

Weights and anchor points are the team's judgement, informed by publicly discussed debt-service practice and standard emergency-fund guidance. They are **not** empirically fitted, and real outcome data would refit them.

---

## Data

**No real consumer financial data is used anywhere in this repository.**

The evaluation dataset is generated, with income drawn log-normally, expense share falling with income, and BNPL commitment counts drawn over realistic instalment sizes. Labels come from a Monte-Carlo simulation of 12-month cash paths driven partly by a behavioural factor the model never observes. All seeds are fixed — every metric above is reproducible with `python models/train.py`.

The four demo personas are constructed to exercise every branch of the scoring engine. They are not research subjects.

> This prototype demonstrates the AI pipeline using synthetic data and simulation-derived labels. Production deployment would require validation and retraining using representative, consented and anonymised real-world data.

---

## Stack

- **Application** — Streamlit (multipage), Plotly
- **Domain layer** — pure Python, zero third-party imports, fully unit-testable
- **ML** — scikit-learn, pandas, NumPy
- **Data** — SQLite; all monetary values stored as integer sen
- **Hosting** — Streamlit Community Cloud

Streamlit was chosen so that two developers could ship six working features in three days. It is a prototype choice, not an architecture: the domain layer has no framework dependency and lifts into a FastAPI service unchanged.

## Repository layout

```
main.py                    Streamlit entry point
pages/                     Profile · Commitments · Dashboard · Simulator · About
utils/                     DOMAIN — pure Python, no third-party imports
  features.py                11 derived features
  scoring.py                 KIRA Score engine
  simulate.py                what-if arithmetic
  warnings.py                early-warning rules
  explain.py                 deterministic explanation templates
services/                  orchestration — no streamlit imports
models/                    synthetic generation, Monte-Carlo labels, training, MODEL_CARD.md
data/                      synthetic profiles, demo personas, knowledge base
database/                  schema.sql, init_db.py
tests/                     12 tests — run before every push
docs/                      master package, API-CONTRACT.md, demo script
```

`docs/API-CONTRACT.md` is the frozen interface between the application and the domain layer. Neither side changes it unilaterally.

**Architectural rule:** `utils/scoring.py` must never import `streamlit`. If it does, the engine can no longer be tested without launching the app and the two developers become coupled.

## Running it

```bash
pip install -r requirements.txt
streamlit run main.py
```

No configuration required. `LLM_API_KEY` is optional — without it, explanations render from deterministic templates and every core feature still works.

```bash
pytest -q                  # 12 tests, runs in under 10 seconds
python utils/scoring.py    # prints the four persona fixtures: 68 / 94 / 41 / 17
```

---

## Team

Built for the **MAIC Nexus Challenge 2026**, Track T3 — AI for Financial Services & Fintech.

| Role | Owner |
|---|---|
| Scoring engine, ML pipeline, explanation layer | Arjun |
| Application, database, interface | Aliff |
| Documentation, research, source verification | Tammy |
| Pitch, business model, commercial narrative | Thanu |
| Branding, UX, compliance and AI usage disclosure | Angel |

## Status

Early development. **Not a licensed financial service.**

KIRA+ provides information and planning tools only. It does not provide financial advice, does not make lending decisions, does not predict or replace a CTOS score, and is not a substitute for advice from AKPK or a licensed adviser.

The prototype follows privacy-by-design principles and would require formal PDPA and legal review before production deployment.

## Sources

All statistics in this README are attributable:

- BNPL accounts, outstanding balances and overdue figures (Q1 2026) — Ministry of Finance
- Full-year 2025 transaction volume and value — Ministry of Finance / Bank Negara Malaysia
- Emergency fund resilience (61%) — BNM Financial Capability & Inclusion Demand Side Survey 2024, n = 3,587
- Affordability assessment obligations — Consumer Credit Act 2025

Model metrics are measured on synthetic data and are not claims about real-world predictive accuracy.

## Licence

Copyright © 2026 the KIRA+ team. All rights reserved.

This repository is public for MAIC Nexus Challenge judging. Public visibility is not a grant of reuse, redistribution or derivative works.
