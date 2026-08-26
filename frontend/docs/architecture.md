# Frontend architecture

Status: draft, generated from `docs/MASTER-PACKAGE.md` Part II (Component Architecture §5, Frontend
§6, API Structure §17) adapted from Streamlit to Next.js. Aliff owns this file and should tune it
freely — it's the starting point, not a finished spec.

## Stack and boundaries

Next.js (App Router, TypeScript), talking to the FastAPI backend over JSON. See the root
`docs/API-CONTRACT.md` for the wire contract (§9 documents the routes) and `frontend/CLAUDE.md` for
the short version of the rules below.

- **Pages** (`app/*/page.tsx`) render. They never fetch or format currency directly.
- **`lib/api.ts`** is the only module that calls the backend (`fetch` against `NEXT_PUBLIC_API_URL`).
- **`lib/format.ts`** is the only module that turns sen into an `"RM..."` string.
- Import direction: pages → components → `lib/api.ts` / `lib/format.ts`. Never the reverse, and
  components never construct a fetch call or a currency string themselves.

This mirrors the backend's own rule (services → utils, never sideways) — the same discipline that let
Aliff and Arjun build in parallel applies inside `frontend/` between pages and their data/formatting
layers.

## Directory structure (proposed)

```
frontend/
  app/
    profile/page.tsx
    commitments/page.tsx
    dashboard/page.tsx
    simulator/page.tsx
    about/page.tsx
  components/            # new — one component per Component Architecture entry below
    ProfileForm.tsx
    CommitmentsTable.tsx
    ScoreGauge.tsx
    FactorBreakdown.tsx
    WarningList.tsx
    SimulatorPanel.tsx
    VerdictBanner.tsx
    SyntheticDataNotice.tsx
  lib/
    api.ts               # fetch client
    format.ts            # sen -> ringgit
    fixtures.ts          # new — the four persona payloads from docs/API-CONTRACT.md §7, for tests
  __tests__/ or *.test.tsx co-located next to what they test (see testing.md)
```

Nothing here is implemented yet — see `testing.md` for the TDD workflow this is meant to support.

## Data flow

```
Profile form  --POST /profiles-->  profile_id
Profile/demo  --GET /profiles/demo/{name}-->  Profile (unsaved, profile_id: null)
Dashboard     --POST /assess-->  Assessment (score, band, subscores, contributions, warnings, p_stress_12m)
Simulator     --POST /simulate/grid (once, on page load / price change)-->  36-entry array
              --tenure slider reads grid[tenure - 1] locally, no further requests--
```

Every value in every response is integer sen. `ScoreGauge`, `FactorBreakdown`, `CommitmentsTable`,
and `SimulatorPanel` all receive sen and call `lib/format.ts` at render time — they never receive a
pre-formatted string as a prop, so a future locale/currency change touches one file.

## State management

The MVP has no authentication (per `docs/MASTER-PACKAGE.md` §21 — a deliberate decision, not a gap:
no accounts means no stored credentials on a public host). That carries over directly:

- The working profile lives in client state (React state / context) while being edited, matching the
  Streamlit MVP's `st.session_state` equivalent — write to the backend only on explicit save
  (`POST /profiles`), not on every field change.
- Once saved, `profile_id` is the only thing that needs to survive a page reload — store it in
  `localStorage`, not a server session, since there's no login to key a session on.
- **Open decision for Aliff to tune:** whether demo personas are re-fetched from
  `GET /profiles/demo/{name}` each time or cached client-side after first load. Given they're static
  fixtures (§7), caching them is safe and removes a network round-trip from the demo path.

## Component architecture

One entry per MVP screen component, adapted from `docs/MASTER-PACKAGE.md` §5 (Component
Architecture) — purpose, backend call, and acceptance criteria carried over; only the rendering
technology changes.

### Profile (`app/profile/page.tsx`, `ProfileForm`)

- **Calls:** `POST /profiles`, `GET /profiles/demo/{name}`.
- **Contains:** seven-field form (income, fixed expenses, variable expenses, savings, loan monthly,
  plus commitments), four one-click demo persona buttons, inline validation messages.
- **Acceptance:** a profile survives a page reload (via `profile_id` in `localStorage` +
  `GET /profiles/{id}`); a negative income is rejected with a specific message, not a generic one;
  all four demo personas load and their `assess()` scores match §7 exactly (68/94/41/17).

### Commitments (`app/commitments/page.tsx`, `CommitmentsTable`)

- **Calls:** reads from the already-loaded `Profile.commitments`; no separate endpoint.
- **Contains:** editable commitment table, an aggregate card (count, monthly total, outstanding
  total, next due date), obligations breakdown.
- **Acceptance:** adding/editing a commitment and re-saving updates the total and, on the next
  `assess()` call, the score, in the same user interaction. Zero commitments renders an empty state,
  not an error. The aggregate card's totals match the sum of the table exactly.

### Dashboard (`app/dashboard/page.tsx`, `ScoreGauge`, `FactorBreakdown`, `WarningList`)

- **Calls:** `POST /assess`, `POST /explain`.
- **Contains:** score gauge with band colour, six-factor breakdown (sub-score, weight, contribution,
  the user's own figure per factor — see `design.md` for exact wording rules), ordered warning list,
  plain-language explanation (with a visible `source: "llm" | "template"` distinction is optional,
  but the explanation must render either way).
- **Acceptance:** contributions sum to the weighted total before penalty (to within rounding, same
  invariant the backend's own tests enforce); the two weakest factors are visually distinguished;
  every warning names the number that triggered it (never a generic "you're at risk").

### Simulator (`app/simulator/page.tsx`, `SimulatorPanel`, `VerdictBanner`)

- **Calls:** `POST /simulate/grid` once per page load / price change; no further requests while
  dragging the tenure slider.
- **Contains:** purchase price + tenure inputs, before/after comparison (buffer, ratios, score,
  band), a verdict banner (see `design.md` for exact banner rules and banned wording), tenure
  alternatives (the grid response already has all 36 — surface a few, e.g. 6/12/18/24, as suggested
  alternatives the way the fixture table in `docs/API-CONTRACT.md` §7 does).
- **Acceptance:** Aisyah + RM2,400 over 12 months renders score 68 → 54 and buffer RM950 → RM750 on
  screen, matching `docs/API-CONTRACT.md` §7 exactly (this is test `T-08` in `backend/tests/`, and
  the frontend-side equivalent belongs in `testing.md`). Dragging the slider across all 36 positions
  causes zero additional network requests after the initial fetch.

### About (`app/about/page.tsx`)

- **Calls:** none — static content plus the weights table already published in `README.md` /
  `docs/API-CONTRACT.md` §0, §3.
- **Contains:** scoring methodology, factor weights table, synthetic-data disclosure, limitations.
- **Acceptance:** a reader can understand the score without asking a question, per the backend
  Master Package's own bar for this page.

### Cross-cutting: `SyntheticDataNotice`

- Persistent on every page (footer or top banner) — not a dismissible modal. Carried over unchanged
  from the Streamlit-era rule; see `design.md`.

## Error handling

Mirror `docs/API-CONTRACT.md` §6 (Errors) and the backend's degrade-gracefully posture: a missing
`p_stress_12m` (null) must not crash the Dashboard, a `POST /assess` failure must not take down the
whole page (catch at the page boundary, show a correlation-id style message, never a raw stack
trace), and the app should remain usable if the backend is briefly unreachable (show a clear
"couldn't reach the server" state rather than an infinite spinner).
