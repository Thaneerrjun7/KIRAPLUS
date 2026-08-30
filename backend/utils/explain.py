"""Deterministic explanation templates -- the fallback that must always work
with no LLM available. See docs/API-CONTRACT.md §5.
"""

from utils.format import fmt_rm


def template(payload: dict) -> str:
    """Describe already-computed assessment data without new calculations.

    Reads exactly the fields docs/API-CONTRACT.md §5 promises the payload
    has. ``warnings`` is a list of warning CODE STRINGS (e.g. "LOW_BUFFER"),
    never a list of ``{level, title}`` objects, and there is no top-level
    "features" key -- both were wrong assumptions carried over from an
    earlier internal payload shape, and every real assessment with at least
    one warning crashed this function with an AttributeError as a result.

    Only ever echoes a raw payload value (score, buffer, score_after) --
    never a derived number like a score delta -- so this text always passes
    its own utils.guard.verify() the same way an LLM response would have to.
    """
    score = payload.get("score", 0)
    band = payload.get("band", "UNKNOWN")
    buffer_sen = payload.get("buffer_after_sen", payload.get("buffer_before_sen", 0))
    warnings = payload.get("warnings") or []
    purchase = payload.get("purchase")
    score_after = payload.get("score_after")

    parts = [
        f"Your KIRA Score is {score} out of 100, placing you in the {band} band.",
        f"After all monthly obligations, you have {fmt_rm(buffer_sen)} left each month.",
    ]
    if purchase and score_after is not None:
        band_after = payload.get("band_after", band)
        parts.append(
            f"With this purchase, your score would move to {score_after} out of 100 "
            f"({band_after})."
        )
    if warnings:
        parts.append(f"Active warning{'s' if len(warnings) != 1 else ''}: {', '.join(warnings)}.")
    parts.append("This assessment is based on user-provided data and is not financial advice.")
    return " ".join(parts)
