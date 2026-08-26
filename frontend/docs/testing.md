# Frontend testing — AI-first TDD

Status: draft. This is the file that makes "AI-first TDD" concrete for `frontend/`: the rule is the
same one `backend/CLAUDE.md` already states for the Python side — write the test against the
contract's fixtures first, then the implementation. Nothing in `frontend/` is implemented yet, so
every item below is a test to write before the component it tests.

## Why this needs its own file

An AI agent (or a developer) working test-first needs the acceptance criteria and the exact fixture
numbers in front of it before writing a single component — not scattered across
`docs/API-CONTRACT.md`, `docs/MASTER-PACKAGE.md`, and memory. This file is that single place for the
frontend half; `backend/tests/` (T-01…T-12) is the equivalent for the backend half, and the two
should never need to duplicate each other's assertions — the frontend trusts the backend's numbers
and tests that it *renders* them correctly, not that they're mathematically correct.

## Test pyramid

1. **Unit — `lib/format.ts`.** Pure functions, cheapest to test exhaustively.
   - `fmtRm(95000) === "RM950"`, `fmtRmCents(95000) === "RM950.00"`, `toSen(950.0) === 95000`.
   - Edge cases: zero, a value with cents that must round (banker's rounding, per the function's own
     docstring), negative values if they're ever legitimately passed (a negative buffer, for
     instance — decide whether that's allowed and test the decision either way).

2. **Component — React Testing Library, rendering against fixtures.** Feed each component the exact
   JSON shapes from `docs/API-CONTRACT.md` §7 (`lib/fixtures.ts` should hold these as typed
   constants, not re-typed ad hoc per test) and assert what's on screen, not implementation detail.
   - `ScoreGauge` + `FactorBreakdown` rendering Aisyah's `Assessment` shows score `68`, band
     `"MODERATE RISK"`, and all six factors with their own sub-score/weight/contribution — and the
     contributions sum to the weighted total before penalty, same invariant the backend enforces.
   - `WarningList` shows exactly one warning for Aisyah, zero for Daniel, two for Wei Jian, four for
     Farah (two of them red) — mirrors backend test `T-09`, reading the same
     `data/mock-data.json` expectations the backend does, not a re-derived number.
   - `VerdictBanner` renders each of the four banner conditions in `design.md` with the exact wording
     template, and never renders any of the banned phrases (assert the banned strings are *absent*,
     not just that the expected string is present — a regression that adds banned wording alongside
     correct wording would otherwise slip through).
   - `SimulatorPanel` given Aisyah's `/simulate/grid` response shows tenure 12 → score 54, buffer
     RM750, delta −14, and switching the slider to another tenure reads the next entry from the
     already-fetched array — assert no second network call happens (see integration tests below for
     how to make that assertion meaningfully).

3. **Contract/integration — mock the backend at the `lib/api.ts` boundary, not the network.** Use a
   fixture-backed mock (MSW or a hand-rolled fetch mock) that returns exactly the shapes
   `docs/API-CONTRACT.md` §9 documents, including the edge cases the backend explicitly guarantees:
   - `p_stress_12m: null` (model artefact absent) must not crash the Dashboard.
   - A `POST /simulate/grid` response is exactly 36 entries, tenures 1–36 in order — a page/component
     that assumes a different length or order should fail its test, not fail silently in production.
   - Every numeric field in every mocked response is an integer — if a test fixture ever has a float
     where sen is expected, that's a bug in the test fixture, not something to coerce around.
   - No test in this suite makes a real network call. The backend team (Arjun) doesn't need a running
     `uvicorn` process for the frontend suite to pass, mirroring the independence `docs/HANDOFF.md`
     already establishes in the other direction.

4. **End-to-end — Playwright, stretch goal (P1/P2, not P0).** One happy-path script matching the
   Master Package's own demo script: Profile (load Aisyah) → Commitments → Dashboard (score 68) →
   Simulator (RM2,400 over 12 months → score 54) → About. This is valuable for demo-rehearsal
   confidence but shouldn't block the P0 component/unit work if time runs out — same P0/P1
   prioritization discipline `docs/MASTER-PACKAGE.md` §27 already applies to the backend backlog.

## Tooling (proposed, not yet installed)

- **Vitest** + **React Testing Library** for unit/component tests — fast, native ESM, plays well with
  Next.js's App Router without extra config compared to Jest.
- **MSW** (Mock Service Worker) for the contract/integration layer — intercepts `fetch` the same way
  in tests as it would in a browser, so the mocking approach doesn't diverge from how `lib/api.ts`
  actually calls the backend.
- **Playwright** for the end-to-end stretch goal.

None of these are in `frontend/package.json` yet — add them alongside the first test file, not
speculatively ahead of time.

## The fixtures this all depends on

`lib/fixtures.ts` should hold typed copies of the four personas' full `Assessment` shape and at least
one `Simulation`/`/simulate/grid` response (Aisyah + RM2,400/12mo, per §7), sourced from
`docs/API-CONTRACT.md` §7 and `data/mock-data.json` — not retyped from memory. If a fixture here ever
disagrees with the backend's own fixtures, the backend's `data/mock-data.json` wins; update this file
to match, never the other way around, since `data/mock-data.json` is what §7's frozen numbers are
read from.

## What "done" looks like for a frontend component (per `docs/MASTER-PACKAGE.md`'s acceptance bar)

- The four persona fixtures render score 68/94/41/17 and the exactly-right warning counts.
- The simulator renders 68 → 54 for Aisyah + RM2,400/12 months, matching backend test `T-08`.
- Every currency figure on screen went through `lib/format.ts` — no hand-formatted `"RM..."` string
  anywhere else in the codebase (this is itself a good candidate for a lint rule or a grep-based test
  once there's enough code to check).
- No component crashes when `p_stress_12m` is `null` or when the backend is unreachable.
