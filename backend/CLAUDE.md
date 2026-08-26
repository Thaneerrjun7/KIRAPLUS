# CLAUDE.md — backend/

Python: the FastAPI transport (`app/`) plus the domain, orchestration, and ML layers. See the root
`CLAUDE.md` for the frozen-contract and unit rules in full, and `docs/HANDOFF.md` for who owns what;
this file only adds what's specific to working in this directory.

## Layout and ownership

- `app/` — FastAPI routers. Transport only, no domain logic. Aliff.
- `services/` — the literal interface, `docs/API-CONTRACT.md` §2-§5. `profile_service.py` (Aliff),
  `scoring_service.py` / `llm_service.py` (Arjun), `simulation_service.py` (**both** — the one file
  you both write in, e.g. `simulate_grid`).
- `utils/` — pure Python, zero third-party imports. Arjun.
- `models/` — synthetic data generation, Monte-Carlo labels, training. Arjun.
- `database/` — `schema.sql` + `init_db.py`, INTEGER-sen columns. Aliff. Already working, not a stub.
- `tests/` — one stub file per test group, T-01…T-12. (T-13, the unit-invariance test §0 refers to,
  has no stub file yet — a pre-existing gap from the original scaffold, not part of any later change.)

## Rules specific to this half of the repo

- Imports only flow one way: `app/` → `services/` → `utils/`/`models/`. Never the reverse, and
  `utils/`/`services/` never import `fastapi` (or any web framework) — that's what keeps the domain
  layer testable without a running server.
- Every `utils/`/`services/` function signature matches `docs/API-CONTRACT.md` exactly. Don't add a
  parameter or change a return shape without flagging it first, per the root `CLAUDE.md`'s
  frozen-contract rule.
- Write the test in `tests/` against the `data/mock-data.json` fixtures before writing the
  implementation.

## Local dev

```bash
pip install -r requirements.txt
pytest -q                       # no server needed — this is most of Arjun's loop
uvicorn app.main:app --reload   # :8000 — needed once app/ or the frontend is in the loop
```
