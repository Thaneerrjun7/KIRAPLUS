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

3. **Contract/integration — mock the backend at the `lib/api.ts` boundary, not the network.** Use
   `vi.mock("@/lib/api")` (Vitest's built-in mocking) returning fixture-backed responses that match
   exactly the shapes `docs/API-CONTRACT.md` §9 documents, including the edge cases the backend
   explicitly guarantees. Decided against adding MSW — mocking at the `lib/api.ts` module boundary
   (rather than intercepting `fetch` itself) is one fewer dependency and is exactly the boundary
   `architecture.md` already says is the only thing allowed to call the backend, so mocking there is
   the natural seam, not a compromise.
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

## Tooling — installed and wired up

- **Vitest** + **React Testing Library** + **@testing-library/jest-dom** for unit/component tests —
  `vitest.config.mts` (jsdom environment, `@/` path alias matching `tsconfig.json`),
  `vitest.setup.ts` (jest-dom matchers). Run: `npm test` (once) or `npm run test:watch`.
- **Playwright** for end-to-end — `playwright.config.ts`, tests under `e2e/`. Run: `npm run test:e2e`
  (needs `npx playwright install` once for the browser binaries; not run yet since the one e2e spec
  is still `test.skip`-ed — there's no real page to walk through until the Profile page works).
- No MSW — mocking happens at the `lib/api.ts` module boundary with `vi.mock`, see above.
- `next lint`'s default `@typescript-eslint/no-unused-vars` rule was relaxed for unused *function
  arguments* only (`.eslintrc.json`) — every stub across this scaffold keeps its documented parameter
  names before it's implemented, and the default rule would otherwise error on every one of them.

Current state: `npm test` runs 2 files — `lib/theme.test.ts` (3 tests, passing: `bandToRisk` is a
trivial pure mapping and is fully implemented) and `lib/format.test.ts` (8 tests, failing: `fmtRm` /
`fmtRmCents` / `toSen` are still `NotImplementedError`-equivalent stubs). That split — one green file
proving the harness works, one red file waiting on an implementation — is what "AI-first TDD" is
supposed to look like at this stage, not a bug to fix.

## The fixtures this all depends on

`lib/fixtures.ts` holds typed copies of the four personas' expected score/band/features/subscores/
warning codes, plus all six of Aisyah's `simulator_scenarios`, transcribed directly from
`data/mock-data.json` (not retyped from memory or from Master Package prose — the two occasionally
give slightly different tenure/price combinations for what reads as "the same" scenario, and
`data/mock-data.json` is the one the backend's own tests read from). If a fixture here ever disagrees
with the backend's own fixtures, `data/mock-data.json` wins; update `lib/fixtures.ts` to match, never
the other way around, and never hand-derive a number that isn't actually in the source file.

## What "done" looks like for a frontend component (per `docs/MASTER-PACKAGE.md`'s acceptance bar)

- The four persona fixtures render score 68/94/41/17 and the exactly-right warning counts.
- The simulator renders 68 → 54 for Aisyah + RM2,400/12 months, matching backend test `T-08`.
- Every currency figure on screen went through `lib/format.ts` — no hand-formatted `"RM..."` string
  anywhere else in the codebase (this is itself a good candidate for a lint rule or a grep-based test
  once there's enough code to check).
- No component crashes when `p_stress_12m` is `null` or when the backend is unreachable.
- Every screen holds up at each of Tailwind's default breakpoints (`sm`/`md`/`lg`/`xl`) and at the
  1280×720 projector target — responsive design is mandatory per `design.md`, so a component test
  suite should include at least one assertion per screen at a narrow viewport, not just the default.

