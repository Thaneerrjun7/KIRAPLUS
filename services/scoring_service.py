"""The single entry point the UI calls for a score. Must never import streamlit.

Orchestrates features -> score -> model -> warnings. See docs/API-CONTRACT.md
§3 for the canonical Assessment shape and its invariants.
"""


def assess(profile: dict) -> dict:
    """Return the Assessment dict: score, band, penalty, features, subscores,
    contributions, warnings, p_stress_12m, engine_version, disclaimer.
    """
    raise NotImplementedError
