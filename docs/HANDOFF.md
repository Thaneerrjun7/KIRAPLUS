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

## Path beyond the MVP

`docs/MASTER-PACKAGE.md`'s Future Technical Architecture table and Roadmap section name what's
deliberately not built yet and what triggers building it (mostly "first real user data" / "first
customer SLA"). Status as of this note:

- ✅ CI test gate (`.github/workflows/ci.yml`) — runs `pytest` + `npm test`/`lint`/`build` on every
  PR and push to `main`. Previously nothing blocked a broken PR from being mergeable.
- ❌ Uptime check via GitHub Actions — retired (`.github/workflows/uptime-check.yml` removed). The
  `*/15 * * * *` cron pinged the live backend `/health` and live frontend from GitHub-hosted runners,
  but every run failed: `kiraplus.aliffaizuddin.uk` and (before its DNS record was switched to
  DNS-only/grey cloud) `api-kiraplus.aliffaizuddin.uk` both sit behind Cloudflare, and Cloudflare's
  free-tier **Bot Fight Mode** issues a `managed_challenge` to GitHub Actions' Azure-hosted runner
  IPs (`source: "botFight"`, `ruleId: "bot_fight_mode"` in Security → Events) — confirmed via the
  Cloudflare dashboard that this specific block cannot be scoped or skipped by a Custom Rule on the
  Free plan (only paid Super Bot Fight Mode supports exceptions), so there was no way to keep this
  check on GitHub-hosted runners without either disabling Bot Fight Mode zone-wide or self-hosting a
  runner. Replacing with a real third-party monitor (UptimeRobot or similar) instead — being set up
  manually, not wired into this repo.
- 📋 `docs/PDPA-READINESS.md` — a scoping checklist for the formal PDPA/legal review
  `MASTER-PACKAGE.md`'s risk register (R6) calls for. Not started; has a long lead time independent
  of engineering work, so it's listed here to start in parallel rather than block on it later.
- ⏳ Not started, correctly gated on "first real user data": real authentication, migrating off
  SQLite, structured logging/error tracking/alerting. See `MASTER-PACKAGE.md`'s Future Technical
  Architecture table for the full trigger list — don't build these ahead of their trigger.

## What to check before merging this into `main`

`feat/nextjs-fastapi-migration` is flagged **High** level of change in its PR (#3) because it moves
the directories Arjun's work lives under, even though it changes no signature inside them. Per the
PR template, that means a quick align between the two of you before merge — mainly: confirm Arjun is
fine with `utils/`/`models/` now living under `backend/` (paths in any of his own notes, scripts, or
muscle memory), and that the `backend/services/simulation_service.py` split (both of you writing to
one file) is workable as described above rather than a source of merge conflicts.
