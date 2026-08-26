# CLAUDE.md — frontend/

Next.js (App Router, TypeScript). Presentation only. See the root `CLAUDE.md` for the frozen-contract
and unit rules in full; this file only adds what's specific to working in this directory.

## Local docs

`frontend/docs/` holds this side's own planning docs — separate from the root `docs/` (the shared
contract, the master package, cross-team handoff), which stays the master for anything both sides
need. Read before building anything:

- `frontend/docs/architecture.md` — directory layout, data flow, state management, one section per
  MVP screen with its backend calls and acceptance criteria.
- `frontend/docs/design.md` — brand system, UI rules, verdict-banner and warning-copy wording,
  screen content spec. Aliff tunes this one most.
- `frontend/docs/testing.md` — the AI-first TDD plan: what to test at each layer, against which
  fixtures, before writing the component it tests.

## Scope

This directory owns the five MVP pages (`app/profile`, `app/commitments`, `app/dashboard`,
`app/simulator`, `app/about`), `lib/format.ts`, and `lib/api.ts`. Nothing here computes a score, a
warning, or a recommendation — it renders what `backend/` returns and formats sen into ringgit.

## The sen/ringgit boundary lives here now

`lib/format.ts` (`fmtRm`, `fmtRmCents`, `toSen`) is the only place allowed to construct an `"RM..."`
string. Every value from the FastAPI backend is integer sen — never format currency inline in a page
component.

## Talking to the backend

- Base URL: `NEXT_PUBLIC_API_URL` (see `.env.example`), defaults to `http://localhost:8000`.
- Routes and their shapes are documented in `docs/API-CONTRACT.md` §9 — this app consumes exactly
  what's documented there, it doesn't invent its own request/response shapes.
- Use `POST /simulate/grid` for the simulator's tenure slider — fetch once, read `grid[tenure - 1]`
  locally. Don't reintroduce a `POST /simulate` call per drag frame; that's the exact stutter this
  route exists to avoid.

## Nothing is implemented yet

Every page is currently a placeholder. Build against the fixture shapes in `docs/API-CONTRACT.md` §7
(Aisyah/Daniel/Wei Jian/Farah) — the FastAPI routers already call the real `services/*.py` functions,
so nothing here needs to change once those stop raising `NotImplementedError`.

## Local dev

```bash
npm install
npm run dev        # :3000, calls http://localhost:8000
npm test            # Vitest, once
npm run test:watch  # Vitest, watch mode
npm run test:e2e    # Playwright (needs `npx playwright install` once)
```

Write the test in `lib/` (or eventually `components/`) against `lib/fixtures.ts` before writing the
implementation — same TDD-first rule `backend/CLAUDE.md` states for the Python side. See
`frontend/docs/testing.md` for the full test pyramid and what's already wired up.
