"""The single entry point the UI calls for a score. Must never import fastapi.

Orchestrates features -> score -> model -> warnings. See docs/API-CONTRACT.md
§3 for the canonical Assessment shape and its invariants.
"""

import os

from utils.scoring import ENGINE_VERSION, kira_score
from utils.warnings import evaluate


_stress_model = None
_stress_model_loaded = False


def _load_stress_model():
    """Load the optional model artifact, returning ``None`` when unavailable."""
    try:
        import joblib

        model_path = os.path.join(
            os.path.dirname(__file__), "..", "models", "stress_model.pkl"
        )
        return joblib.load(model_path) if os.path.exists(model_path) else None
    except Exception:
        return None


def _get_stress_probability(features: dict) -> float | None:
    """Return an optional 12-month stress probability without breaking offline use."""
    global _stress_model, _stress_model_loaded
    if not _stress_model_loaded:
        _stress_model = _load_stress_model()
        _stress_model_loaded = True
    if _stress_model is None:
        return None

    try:
        vector = [
            features.get("dsr", 0.0),
            features.get("bnpl_ratio", 0.0),
            features.get("buffer_ratio", 0.0),
            features.get("runway_months", 0.0),
            features.get("coverage", 0.0),
            features.get("savings_months", 0.0),
            features.get("commitment_ratio", 0.0),
            features.get("n_bnpl", 0),
        ]
        return round(float(_stress_model.predict_proba([vector])[0][1]), 2)
    except Exception:
        return None


def assess(profile: dict) -> dict:
    """Return the Assessment dict: score, band, penalty, features, subscores,
    contributions, warnings, p_stress_12m, engine_version, disclaimer.
    """
    score = kira_score(profile)
    features = score["features"]
    p_stress_12m = _get_stress_probability(features)

    return {
        "score": score["score"],
        "band": score["band"],
        "penalty": score["penalty"],
        "features": features,
        "subscores": score["subscores"],
        "contributions": score["contributions"],
        "warnings": evaluate(features, p_stress_12m),
        "p_stress_12m": p_stress_12m,
        "engine_version": ENGINE_VERSION,
        "disclaimer": "Assessment based on user-provided data. Not financial advice.",
    }
