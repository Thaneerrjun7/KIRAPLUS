"""Deterministic explanation templates -- the fallback that must always work
with no LLM available. See docs/API-CONTRACT.md §5.
"""

from utils.format import fmt_rm


def template(payload: dict) -> str:
    """Describe already-computed assessment data without new calculations."""
    score = payload.get("score", 0)
    band = payload.get("band", "UNKNOWN")
    features = payload.get("features", {})
    warnings = payload.get("warnings", [])
    buffer_sen = features.get("buffer_sen", 0)
    dsr = features.get("dsr", 0.0)
    runway_months = features.get("runway_months", 0.0)
    n_bnpl = features.get("n_bnpl", 0)

    parts = [
        f"Your KIRA Score is {score} out of 100, placing you in the {band} band.",
        f"After all monthly obligations, you have {fmt_rm(buffer_sen)} left "
        f"({dsr:.1%} of income goes to debt service).",
    ]
    if runway_months < 1.0:
        parts.append(
            f"Your savings would cover {runway_months:.1f} months of expenses, "
            "which is less than one month of runway."
        )
    else:
        parts.append(f"Your savings would cover {runway_months:.1f} months of expenses.")
    if n_bnpl:
        noun = "plan" if n_bnpl == 1 else "plans"
        parts.append(f"You have {n_bnpl} active BNPL {noun}.")
    red_warnings = [warning["title"].lower() for warning in warnings if warning.get("level") == "red"]
    if red_warnings:
        parts.append(f"Key concerns: {'; '.join(red_warnings)}.")
    parts.append("This assessment is based on user-provided data and is not financial advice.")
    return " ".join(parts)
