"""FastAPI entry point -- the application layer's HTTP transport.

Wraps services/*.py as HTTP routes for the Next.js frontend. See
docs/API-CONTRACT.md §9. Must never contain scoring/domain logic itself --
that stays in services/ and utils/, unchanged by this file.
"""
import logging
import os
import sqlite3
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.routers import (
    assessments,
    explanations,
    optimizations,
    profiles,
    projections,
    simulations,
)
from errors import ValidationError

logger = logging.getLogger(__name__)

def _ensure_database() -> None:
    """Create the SQLite schema if this is a first boot against an empty file.

    Without this, `uvicorn app.main:app --reload` -- the local run command in
    docs/HANDOFF.md and the workflow handbook -- starts cleanly and then fails
    the first "Save profile" with a 500 and `no such table: profiles`, because
    nothing ever ran database/init_db.py. The Docker path was already covered
    by docker-entrypoint.sh; a bare uvicorn was not, so anyone cloning the repo
    to record the demo hit a 500 on the first click.

    Guarded on the table's absence, not the file's, and deliberately narrow:
    database/schema.sql carries no DROP and no IF NOT EXISTS, so init_db()
    raises on an existing schema. Nothing here touches a database that has one.
    """
    db_path = os.environ.get("KIRA_DB_PATH", "database/kira.db")
    parent = os.path.dirname(db_path)
    if parent:
        os.makedirs(parent, exist_ok=True)

    connection = sqlite3.connect(db_path)
    try:
        existing = connection.execute(
            "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'profiles'"
        ).fetchone()
    finally:
        connection.close()

    if existing:
        return

    from database.init_db import init_db

    init_db(db_path)


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        _ensure_database()
    except Exception:
        # An unwritable path must not stop the app booting: /assess, /simulate,
        # /simulate/grid, /project, /optimize and /explain are all stateless and
        # keep working. Only the profile routes need the file. Logged (not
        # swallowed silently) so a genuinely broken schema/import doesn't boot
        # clean and only surface later as an unrelated 500 on first /profiles use.
        logger.exception("Database bootstrap failed; profile routes will fail until this is fixed")
    yield


app = FastAPI(
    title="KIRA+ API",
    version=os.environ.get("KIRA_ENGINE_VERSION", "1.0.0"),
    lifespan=lifespan,
)

_origins = os.environ.get("CORS_ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(ValidationError)
def handle_validation_error(request: Request, exc: ValidationError) -> JSONResponse:
    return JSONResponse(status_code=422, content={"field": exc.field, "message": exc.message})

app.include_router(profiles.router)
app.include_router(assessments.router)
app.include_router(simulations.router)
app.include_router(explanations.router)
app.include_router(projections.router)
app.include_router(optimizations.router)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}
