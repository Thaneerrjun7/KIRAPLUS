"""KIRA Score engine. Pure Python, zero third-party imports.

This module must never import streamlit -- if it does, the engine can no
longer be tested without launching the app.

Weights, anchors and the penalty formula are specified in
docs/MASTER-PACKAGE.md Part II §12 and docs/API-CONTRACT.md §3. Persona
fixtures (docs/API-CONTRACT.md §7, data/mock-data.json): aisyah=68,
daniel=94, weijian=41, farah=17.
"""

ENGINE_VERSION = "1.0.0"


def kira_score(profile: dict) -> dict:
    """Return {score, band, features, subscores, contributions, penalty}."""
    raise NotImplementedError


def band(score: int) -> str:
    """LOW RISK if score >= 70, MODERATE RISK if 45 <= score < 70, else HIGH RISK."""
    raise NotImplementedError
