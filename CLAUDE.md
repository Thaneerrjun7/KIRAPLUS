# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project context

KIRA+ is a financial-health / BNPL early-warning prototype for the MAIC Nexus Challenge 2026 (Track T3). It consolidates a user's BNPL and loan commitments into one view, computes a transparent 0–100 "KIRA Score" from six published, weighted factors, and — the feature the product exists for — lets a user simulate a purchase they have not made yet and see what it does to their score and buffer before they commit.

Core flow: `Profile` (income, expenses, savings, commitments) → `scoring_service.assess()` (features → KIRA Score → band → ML stress probability → warnings) → `simulation_service.simulate()` (before/after assessment for a hypothetical purchase, plus alternatives at other tenures). An LLM layer only rephrases already-computed numbers into plain language; it never computes a score, a band, or a recommendation, and every core feature works with no LLM key present.

`docs/API-CONTRACT.md` is the authoritative technical spec; `docs/MASTER-PACKAGE.md` is the broader business/pitch document and is occasionally looser or inconsistent with the contract (e.g. its Appendix C reference implementation uses ringgit floats, not sen) — the contract always wins on any conflict.

The repo is scaffolded (`main.py`, `pages/`, `utils/`, `services/`, `models/`, `database/`, `tests/`) but domain and service modules are still `NotImplementedError` stubs carrying exact contract signatures — logic is filled in test-first, not invented ahead of a test.

**Team, per `README.md`:** Aliff owns the application layer (Streamlit pages, database, interface — Master Package's "Developer 1" track: §6-§8, §14, §17-§18, §24, tasks `D1-07` onward). Arjun owns the scoring engine, ML pipeline and explanation layer ("Developer 2": §9-§16, §23, tasks `D1-01` onward). Tammy, Thanu and Angel own documentation, business/pitch, and branding/UX respectively (Part I, III, V) and don't touch code.

## The frozen contract

`docs/API-CONTRACT.md` is **frozen** (`contract_version: 1.0.0`, `engine_version: 1.0.0`). It is the interface between the application layer and the domain layer, and it defines:

- The `Profile` / `Commitment` types and validation bounds.
- Every service function signature (`save_profile`, `load_profile`, `assess`, `simulate`, `explain`, etc.).
- The complete set of warning codes and their triggers (`HIGH_BNPL`, `LOW_BUFFER`, `OVERCOMMITTED`, `THIN_SLACK`, `MULTI_COMMIT`, `MODEL_STRESS`).
- The fixture numbers in section 7 (aisyah=68, daniel=94, weijian=41, farah=17, and the simulator deltas), read from `data/mock-data.json`.

Do not change any function signature, warning code, or fixture number without flagging it to the user explicitly first and getting agreement — per the contract's own §8, a change here also means bumping `contract_version` (and `engine_version` if scoring output changes), updating `data/mock-data.json` in the same commit, and re-running the full test suite before merge.

## The unit rule

Every monetary value crossing the API contract boundary is an **integer number of sen**. No floats, no ringgit, below the presentation layer.

- SQLite columns, domain function arguments/returns, and service payloads: integer sen (e.g. `income_sen=450000`).
- Only `utils/format.py` converts sen to a displayed ringgit string (`fmt_rm`, `fmt_rm_cents`, `to_sen`), and only the presentation layer may call it.
- The KIRA Score itself is unit-invariant (every scoring factor is a ratio), but absolute quantities like `buffer_sen` are not — getting the unit wrong won't break the score, but it will silently break every figure on screen.

## Git workflow

- Never commit directly to `main`. Branch off `main` for every change.
- Branch naming: `<type>/<short-description>` — e.g. `feat/scoring-engine`, `fix/dsr-calculation`, `docs/architecture`.
- Commits: Conventional Commits, scoped to the layer touched — e.g. `feat(scoring): add coverage ratio`, `fix(services): correct sen rounding in simulate()`, `test(utils): cover THIN_SLACK warning trigger`.
- Before opening a PR, check the diff against `.github/pull_request_template.md` and fill it in properly rather than leaving it default.
