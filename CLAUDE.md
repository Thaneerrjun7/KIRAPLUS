# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project context

KIRA+ is a financial-health / BNPL early-warning prototype for the MAIC Nexus Challenge 2026 (Track T3). It consolidates a user's BNPL and loan commitments into one view, computes a transparent 0–100 "KIRA Score" from six published, weighted factors, and — the feature the product exists for — lets a user simulate a purchase they have not made yet and see what it does to their score and buffer before they commit.

Core flow: `Profile` (income, expenses, savings, commitments) → `scoring_service.assess()` (features → KIRA Score → band → ML stress probability → warnings) → `simulation_service.simulate()` (before/after assessment for a hypothetical purchase, plus alternatives at other tenures). An LLM layer only rephrases already-computed numbers into plain language; it never computes a score, a band, or a recommendation, and every core feature works with no LLM key present.

`docs/API-CONTRACT.md` is the authoritative technical spec; `docs/MASTER-PACKAGE.md` is the broader business/pitch document and is occasionally looser or inconsistent with the contract (e.g. its Appendix C reference implementation uses ringgit floats, not sen) — the contract always wins on any conflict.

## Current state

The application layer moved off Streamlit to a **Next.js frontend + FastAPI backend**, split as a monorepo:

- `frontend/` — Next.js (App Router, TypeScript). Presentation only: five pages (`app/profile`, `app/commitments`, `app/dashboard`, `app/simulator`, `app/about`), `lib/format.ts` (the sen→ringgit conversion, now the real presentation layer — see "The unit rule" below), `lib/api.ts` (FastAPI client).
- `backend/` — Python. `app/` is the new FastAPI transport (`main.py` + `routers/`), a thin wrapper that calls into `services/*.py` and adds no domain logic of its own (see `docs/API-CONTRACT.md` §9). `utils/` (domain layer) and `services/` (orchestration layer) carry the exact contract signatures unchanged. `models/` (ML pipeline scripts), `database/schema.sql` + `init_db.py` (fully working, INTEGER-sen columns), `tests/` (one stub file per test group: T-01…T-12), `requirements.txt`, `.env.example`.

**Nothing is implemented yet.** Every function in `backend/utils/` and `backend/services/` raises `NotImplementedError` — write the test against the contract's fixtures first, then the implementation. `backend/database/init_db.py` and `schema.sql` are the only pieces with real logic, since they're mechanical plumbing rather than domain rules. The FastAPI routers and Next.js pages are wiring/placeholders, not implementations.

Run locally: `uvicorn app.main:app --reload` from `backend/` (after `pip install -r requirements.txt`); `npm run dev` from `frontend/` (after `npm install`).

## The frozen contract

`docs/API-CONTRACT.md` is **frozen** (`contract_version: 1.0.0`, `engine_version: 1.0.0`). It is the interface between the application layer and the domain layer, and it defines:

- The `Profile` / `Commitment` types and validation bounds.
- Every service function signature (`save_profile`, `load_profile`, `assess`, `simulate`, `explain`, etc.).
- The complete set of warning codes and their triggers (`HIGH_BNPL`, `LOW_BUFFER`, `OVERCOMMITTED`, `THIN_SLACK`, `MULTI_COMMIT`, `MODEL_STRESS`).
- The fixture numbers in section 7 (aisyah=68, daniel=94, weijian=41, farah=17, and the simulator deltas), read from `data/mock-data.json`.

Do not change any function signature, warning code, or fixture number without flagging it to the user explicitly first and getting agreement — per the contract's own §8, a change here also means bumping `contract_version` (and `engine_version` if scoring output changes), updating `data/mock-data.json` in the same commit, and re-running the full test suite before merge.

## The unit rule

Every monetary value crossing the API contract boundary is an **integer number of sen**. No floats, no ringgit, below the presentation layer.

- SQLite columns, domain function arguments/returns, service payloads, and every FastAPI request/response body: integer sen (e.g. `income_sen=450000`). The HTTP boundary between `frontend/` and `backend/` does not change this — JSON carries sen, not ringgit.
- `frontend/lib/format.ts` is now the only sen→ringgit conversion point (`fmtRm`, `fmtRmCents`, `toSen`), since the presentation layer is the Next.js app, not Python. `backend/utils/format.py` still documents the equivalent Python functions but is no longer on the runtime display path.
- The KIRA Score itself is unit-invariant (every scoring factor is a ratio), but absolute quantities like `buffer_sen` are not — getting the unit wrong won't break the score, but it will silently break every figure on screen.

## Git workflow

- Never commit directly to `main`. Branch off `main` for every change.
- Branch naming: `<type>/<short-description>` — e.g. `feat/scoring-engine`, `fix/dsr-calculation`, `docs/architecture`.
- Commits: Conventional Commits, scoped to the layer touched — e.g. `feat(scoring): add coverage ratio`, `fix(services): correct sen rounding in simulate()`, `test(utils): cover THIN_SLACK warning trigger`.
- Before opening a PR, check the diff against `.github/pull_request_template.md` and fill it in properly rather than leaving it default.
