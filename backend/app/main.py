"""FastAPI entry point -- the application layer's HTTP transport.

Wraps services/*.py as HTTP routes for the Next.js frontend. See
docs/API-CONTRACT.md §9. Must never contain scoring/domain logic itself --
that stays in services/ and utils/, unchanged by this file.
"""
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import assessments, explanations, profiles, simulations

app = FastAPI(title="KIRA+ API", version=os.environ.get("KIRA_ENGINE_VERSION", "1.0.0"))

_origins = os.environ.get("CORS_ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(profiles.router)
app.include_router(assessments.router)
app.include_router(simulations.router)
app.include_router(explanations.router)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}
