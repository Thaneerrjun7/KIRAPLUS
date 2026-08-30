"""Deterministic explanation templates -- the fallback that must always work
with no LLM available. See docs/API-CONTRACT.md §5.

Two payload shapes reach this function and both must work:

- The **Assessment** shape (§3): a nested ``features`` dict and ``warnings`` as
  full dicts. This is what a direct ``POST /explain`` of an assessment sends.
- The **§5 payload** shape: flat ``buffer_before_sen`` / ``buffer_after_sen``,
  a ranked ``factors`` list, and ``warnings`` as bare code strings. This is what
  the dashboard and simulator actually send.

Reading only the first shape is what made the dashboard's "What this means"
panel render "currently unavailable" on every load: ``warnings`` arrived as
strings, ``warning["level"]`` raised TypeError, and llm_service's catch-all
turned that into the unavailable message. Every field below is therefore read
defensively -- a sentence whose inputs are absent is omitted, never guessed.
"""

from utils.format import fmt_rm

# Phrasings for bare warning codes. Deliberately lower-case fragments meant to
# sit inside a sentence, which is why they aren't utils/warnings.py's Titles.
_WARNING_PHRASES = {
    "HIGH_BNPL": "your BNPL exposure is high",
    "LOW_BUFFER": "your emergency buffer is thin",
    "OVERCOMMITTED": "your outflows take up more than 90% of income",
    "THIN_SLACK": "your monthly slack is below a tenth of income",
    "MULTI_COMMIT": "you are running several BNPL plans at once",
    "MODEL_STRESS": "the stress model flags an elevated 12-month risk",
}


def _warning_phrases(warnings) -> list:
    """Accept warnings as dicts (§3) or as bare code strings (§5)."""
    phrases = []
    for warning in warnings or []:
        if isinstance(warning, str):
            phrases.append(_WARNING_PHRASES.get(warning, warning.replace("_", " ").lower()))
        elif isinstance(warning, dict):
            if warning.get("level") and warning.get("level") != "red":
                continue
            title = warning.get("title") or _WARNING_PHRASES.get(warning.get("code", ""), "")
            if title:
                phrases.append(title.lower())
    return phrases


def template(payload: dict) -> str:
    """Describe already-computed assessment data without new calculations."""
    features = payload.get("features") or {}
    score = payload.get("score", 0)
    band = payload.get("band", "UNKNOWN")

    buffer_sen = features.get("buffer_sen")
    if buffer_sen is None:
        buffer_sen = payload.get("buffer_before_sen")

    parts = [f"Your KIRA Score is {score} out of 100, placing you in the {band} band."]

    if buffer_sen is not None:
        dsr = features.get("dsr")
        if dsr is not None:
            parts.append(
                f"After all monthly obligations, you have {fmt_rm(buffer_sen)} left "
                f"({dsr:.1%} of income goes to debt service)."
            )
        else:
            parts.append(
                f"After all monthly obligations, you have {fmt_rm(buffer_sen)} left each month."
            )

    runway_months = features.get("runway_months")
    if runway_months is not None:
        if runway_months < 1.0:
            parts.append(
                f"Your savings would cover {runway_months:.1f} months of expenses, "
                "which is less than one month of runway."
            )
        else:
            parts.append(f"Your savings would cover {runway_months:.1f} months of expenses.")

    n_bnpl = features.get("n_bnpl")
    if n_bnpl:
        noun = "plan" if n_bnpl == 1 else "plans"
        parts.append(f"You have {n_bnpl} active BNPL {noun}.")

    # Named by the ranked factors list when the caller sends one -- this is the
    # single most useful sentence on the dashboard and it costs no arithmetic.
    factors = payload.get("factors") or []
    if factors and isinstance(factors[0], dict) and factors[0].get("name"):
        parts.append(f"The factor holding the score down most is {factors[0]['name'].lower()}.")

    # Only when a purchase is actually being simulated.
    purchase = payload.get("purchase") or {}
    score_after = payload.get("score_after")
    buffer_after_sen = payload.get("buffer_after_sen")
    if purchase and score_after is not None and score_after != score:
        tenure = purchase.get("tenure_months")
        monthly_sen = purchase.get("monthly_sen")
        sentence = "Taking this purchase"
        if monthly_sen is not None and tenure is not None:
            sentence += f" at {fmt_rm(monthly_sen)} a month over {tenure} months"
        sentence += f" would move the score to {score_after}"
        if buffer_after_sen is not None:
            sentence += f" and leave {fmt_rm(buffer_after_sen)} a month"
        parts.append(sentence + ".")

    phrases = _warning_phrases(payload.get("warnings"))
    if phrases:
        parts.append(f"Key concerns: {'; '.join(phrases)}.")

    parts.append("This assessment is based on user-provided data and is not financial advice.")
    return " ".join(parts)
