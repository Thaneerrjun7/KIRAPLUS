# Next.js + FastAPI migration — spec & test plan

Status: scaffolded, nothing implemented. Companion to `docs/API-CONTRACT.md` §9 (HTTP transport) and
`CLAUDE.md` ("Current state" / "The unit rule").

## Decision

The application layer moves from a single-process Streamlit app to two services:

- `frontend/` — Next.js (App Router, TypeScript). Presentation only.
- `backend/` — FastAPI wrapping the existing `services/*.py` over HTTP. No domain logic lives here;
  it is a transport, same constraint the Streamlit pages had.

The domain layer (`backend/utils/`, `backend/services/`, `backend/models/`) is unchanged in shape —
it moved directories, not signatures. `docs/API-CONTRACT.md`'s frozen §1-§8 still hold; §9 documents
the new transport without bumping `contract_version`.

## Why this pair, and not alternatives

- **Why not stay on a Python UI (Streamlit/Reflex/NiceGUI)?** Team explicitly wants a real frontend
  framework's capabilities (custom layout, component control) that Streamlit doesn't give.
- **Why not rewrite the domain/ML layer in TypeScript and go Next.js-only?** The stress model is a
  scikit-learn Random Forest pickled via `joblib` — it only runs in a Python process. Rewriting
  `backend/utils/scoring.py` and the model in TS in a 3-day window risks the two versions drifting
  from the frozen contract, which is exactly what fixture parity (`T-07`, `T-13`) exists to catch.
  Whatever UI framework is chosen, a Python process still has to run the scoring/ML code.
- **Why not split "AI" into its own service, separate from the rest of the backend?** The model is
  called in-process by the same services the FastAPI routes call — a third service would add a
  network hop and a deploy target for no benefit at this scale.
- **Why Next.js over plain Vite + React?** No SEO/SSR need either way; Next.js wins on ecosystem
  (shadcn/ui, Tailwind, Recharts for the score gauge / six-factor breakdown) and zero-config Vercel
  deploys, which mirrors how easy Streamlit Community Cloud was. Vite + React remains the fallback if
  the team finds App Router's server/client component split adds more friction than it saves.

## Architecture

```
Next.js (frontend/)  --JSON over HTTP-->  FastAPI (backend/app/)  --in-process calls-->  services/*.py --> utils/*.py, models/
        |                                         |
   lib/format.ts                            backend/database/ (SQLite)
   (sen -> ringgit,                         backend/.env (LLM_*, KIRA_*, CORS_ALLOWED_ORIGINS)
    the only conversion point now)
```

One Python process serves both the REST API and the domain/ML logic — no separate AI microservice.

## What's in this scaffold vs. still pending

Done (scaffold only, all raise `NotImplementedError` / render placeholders):

- `backend/app/main.py` + `backend/app/routers/{profiles,assessments,simulations,explanations}.py` —
  route skeletons wrapping each `services/*.py` function 1:1, per `docs/API-CONTRACT.md` §9. Includes
  `POST /simulate/grid` (batches `simulate()` over tenures 1-36 for the slider — added after this
  scaffold pass, see §9's "in detail" subsection).
- `frontend/app/{profile,commitments,dashboard,simulator,about}/page.tsx` — one placeholder page per
  MVP screen.
- `frontend/lib/format.ts`, `frontend/lib/api.ts` — the new presentation-layer conversion point and
  API base URL, both stubbed.
- `backend/requirements.txt` updated (FastAPI/uvicorn/httpx in, streamlit/plotly out);
  `backend/.env.example` and `frontend/.env.example` split from the old single `.env.example`.

Still pending (not part of this scaffold pass):

- Implementing any route body, page, or `utils/`/`services/` function (unchanged rule: tests first).
- Pydantic request/response models for `Profile`/`Commitment`/`Assessment`/`Simulation` — routers
  currently type bodies as bare `dict` to match the contract's existing dict-shaped types exactly;
  revisit once the team decides whether stricter FastAPI-side validation is worth the duplication
  against `docs/API-CONTRACT.md` §1.
- Actual `npm install` / `pip install` and a live end-to-end request have not been run in this pass.

## Test plan for the transport layer itself

Independent of scoring/domain correctness (that's T-01…T-13 in `backend/tests/`), once routes have
real bodies, verify:

1. **CORS** — a request from `http://localhost:3000` to a `backend/` running on `:8000` succeeds
   (`CORS_ALLOWED_ORIGINS` must include the frontend's actual origin in every environment, including
   whatever Vercel preview/prod domains are used).
2. **Unit rule holds across HTTP** — every JSON body in/out of `/profiles`, `/assess`, `/simulate`,
   and `/simulate/grid` is integer sen, never a float or a `"RM..."` string. A quick check: `grep`
   the response bodies for a decimal point where an amount field is expected.
3. **Existing pytest suite is unaffected by the move** — `cd backend && pytest -q` still discovers
   and (once implemented) passes T-01…T-13; the directory move alone should not change any test
   outcome.
4. **Fixture parity still holds over HTTP** — `POST /profiles/demo/aisyah` then `POST /assess` should
   reproduce score 68 exactly like calling `scoring_service.assess()` directly; same for
   daniel/weijian/farah. This is the HTTP-boundary equivalent of test `T-13`'s unit-invariance check.
   `POST /simulate/grid`'s row for `tenure_months=12` (and 24) should match the frozen §7 fixture
   numbers exactly, since it's the same `simulate()` call under the hood.
5. **`explain` still meets its 4-second / never-raises guarantee through HTTP** — the added network
   hop (frontend → FastAPI → LLM provider) must not push the effective latency budget users see past
   what `docs/API-CONTRACT.md` §5 promises; time it end-to-end, not just inside `llm_service.explain`.
6. **Frontend build and lint pass** — `npm run build` and `npm run lint` clean, once pages have real
   content; `frontend/lib/format.ts` is the only place a `RM` string should ever be constructed.
7. **`backend/database/init_db.py` still resolves paths correctly** run from `backend/` as the working
   directory (it does today — `KIRA_DB_PATH` defaults relative to the script's own location, which
   moved with it).

## Open risks / follow-ups

- **Env var duplication.** `KIRA_DEMO_MODE` / `KIRA_LANGUAGE` now live only in `frontend/.env.example`
  as `NEXT_PUBLIC_*`; if the backend ever needs to know demo/language state (e.g. for `llm_service`'s
  `en`/`ms` output), it has to be passed explicitly in the request payload, not read from its own env.
- **Deployment is now two targets instead of one** (Vercel + a container host for FastAPI) — confirm
  hosting choice for `backend/` before the demo, since Streamlit Community Cloud's one-click story no
  longer applies to it.
- **Pydantic models are deferred** (see above) — worth revisiting once profile validation errors need
  to surface cleanly to the frontend, since raw-`dict` routes currently return whatever Python raises.
