# CLAUDE.md — frontend/

Next.js (App Router, TypeScript). Presentation only. See the root `CLAUDE.md` for the frozen-contract
and unit rules in full; this file only adds what's specific to working in this directory.

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
npm run dev   # :3000, calls http://localhost:8000
```
