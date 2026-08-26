# Team handoff — who owns what, and how the two sides meet

This documents how Aliff (Developer 1, application) and Arjun (Developer 2, AI/data) work in this
repo now that the application layer is Next.js + FastAPI instead of Streamlit. See
`docs/superpowers/nextjs-fastapi-migration.md` for why; this file is about the day-to-day split.

## Ownership

| Path | Owner | Notes |
|---|---|---|
| `frontend/` | Aliff | Next.js pages, `lib/format.ts` (sen→ringgit), `lib/api.ts` |
| `backend/app/` | Aliff | FastAPI transport — routes only, no domain logic |
| `backend/database/` | Aliff | `schema.sql`, `init_db.py` |
| `backend/services/profile_service.py` | Aliff | CRUD against the database |
| `backend/utils/` | Arjun | Scoring, features, simulation arithmetic, warnings, explain templates |
| `backend/models/` | Arjun | Synthetic data, Monte-Carlo labels, training, `MODEL_CARD.md` |
| `backend/services/scoring_service.py` | Arjun | Orchestrates `utils/` + the model into an `Assessment` |
| `backend/services/llm_service.py` | Arjun | Grounded/guarded explanation layer |
| `backend/services/simulation_service.py` | **Both** | The simulator is the one P0 feature both sides touch |
| `docs/API-CONTRACT.md` | **Both** | Frozen — neither side changes it unilaterally, see `CLAUDE.md` |

This mirrors the Master Package's Dev 1 / Dev 2 split (§6-§8, §14, §17-§18, §24 vs. §9-§16, §23) —
only the directory names changed (`utils/`, `services/`, `models/` moved under `backend/`; `main.py` /
`pages/` were removed and replaced by `frontend/`).

## The seam: `backend/services/*.py`

`docs/API-CONTRACT.md` §2-§5 is the literal interface between the two of you — those are the
`services/*.py` function signatures. Arjun implements what's inside them (calling into `utils/` and
`models/`); Aliff calls them from `backend/app/routers/*.py` and never reimplements what's inside.
Neither of you changes a signature without flagging it to the other first (per `CLAUDE.md`'s frozen
contract rule) — that now includes the HTTP shapes in §9, which are a 1:1 wrapper over §2-§5.

## Working in parallel without blocking each other

- **Arjun** never needs Node or a running server. His loop is `cd backend && pytest -q` against
  `backend/tests/` (T-01…T-12) and the fixtures in `data/mock-data.json`. He can implement and verify
  the entire scoring/ML/warning engine without FastAPI or Next.js running at all.
- **Aliff** needs Python only to run the existing `backend/app/` (`uvicorn app.main:app --reload`)
  and Node for `frontend/` (`npm run dev`). He can build every page and route against the *shape*
  `docs/API-CONTRACT.md` already defines (the Aisyah/Daniel/Wei Jian/Farah fixtures in §7) before
  Arjun's implementations land — the routers already call the real `services/*.py` functions, so the
  moment those stop raising `NotImplementedError`, real numbers flow through with no transport code
  changing.
- **Where you actually need to talk:** any change to `docs/API-CONTRACT.md`, a `services/*.py`
  signature, or `backend/services/simulation_service.py` (the one file you both write in — e.g.
  `simulate_grid`, the tenure-slider batching helper, already landed there). Everything else —
  `frontend/`, `backend/app/`, `backend/utils/`, `backend/models/` internals — can move
  independently.

## Local setup

Backend (Arjun and Aliff both need this):

```bash
cd backend
pip install -r requirements.txt
pytest -q                       # Arjun's loop — no server needed
uvicorn app.main:app --reload   # Aliff's loop — serves the API on :8000
```

Frontend (Aliff only):

```bash
cd frontend
npm install
npm run dev                     # serves the UI on :3000, calls http://localhost:8000
```

Both `backend/.env.example` and `frontend/.env.example` are checked in — copy each to `.env` /
`.env.local` in its own directory; never commit the real files.

## What to check before merging this into `main`

`feat/nextjs-fastapi-migration` is flagged **High** level of change in its PR (#3) because it moves
the directories Arjun's work lives under, even though it changes no signature inside them. Per the
PR template, that means a quick align between the two of you before merge — mainly: confirm Arjun is
fine with `utils/`/`models/` now living under `backend/` (paths in any of his own notes, scripts, or
muscle memory), and that the `backend/services/simulation_service.py` split (both of you writing to
one file) is workable as described above rather than a source of merge conflicts.
