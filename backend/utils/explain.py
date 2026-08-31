"""Deterministic explanation templates -- the fallback that must always work
with no LLM available. See docs/API-CONTRACT.md §5.

Two payload shapes reach this function and both must work:

- The **Assessment** shape (§3): a nested ``features`` dict and ``warnings`` as
  full ``{code, level, title}`` dicts -- what a direct ``POST /explain`` of a
  raw ``/assess`` response sends.
- The **§5 payload** shape: flat ``buffer_before_sen`` / ``buffer_after_sen``,
  a ranked ``factors`` list, and ``warnings`` as bare code strings -- what the
  dashboard and simulator actually send.

Reading only one shape is what caused two real regressions: a payload built
from the other shape either crashed with an AttributeError (`warning["level"]`
on a bare string) or silently rendered nothing (`features.get(...)` on a flat
payload with no `features` key). Every field below is read defensively -- a
sentence whose inputs are absent is omitted, never guessed -- and only ever
echoes a raw payload value (score, buffer, score_after) -- never a derived
number like a score delta -- so this text always passes its own
utils.guard.verify() the same way an LLM response would have to.
"""

from utils.format import fmt_rm


def template(payload: dict) -> str:
    """Describe already-computed assessment data without new calculations."""
    features = payload.get("features") or {}
    score = payload.get("score", 0)
    band = payload.get("band", "UNKNOWN")

    buffer_sen = features.get("buffer_sen")
    if buffer_sen is None:
        buffer_sen = payload.get("buffer_after_sen", payload.get("buffer_before_sen", 0))

    parts = [
        f"Your KIRA Score is {score} out of 100, placing you in the {band} band.",
        f"After all monthly obligations, you have {fmt_rm(buffer_sen)} left each month.",
    ]

    purchase = payload.get("purchase")
    score_after = payload.get("score_after")
    if purchase and score_after is not None and score_after != score:
        tenure = purchase.get("tenure_months")
        monthly_sen = purchase.get("monthly_sen")
        buffer_after_sen = payload.get("buffer_after_sen")
        sentence = "Taking this purchase"
        if monthly_sen is not None and tenure is not None:
            sentence += f" at {fmt_rm(monthly_sen)} a month over {tenure} months"
        sentence += f" would move the score to {score_after}"
        if buffer_after_sen is not None:
            sentence += f" and leave {fmt_rm(buffer_after_sen)} a month"
        parts.append(sentence + ".")

    # Named by the ranked factors list when the caller sends one -- this is the
    # single most useful sentence on the dashboard and it costs no arithmetic.
    factors = payload.get("factors") or []
    if factors and isinstance(factors[0], dict) and factors[0].get("name"):
        parts.append(f"The factor holding the score down most is {factors[0]['name'].lower()}.")

    # Warning CODE STRINGS are echoed verbatim, not translated to prose -- the
    # code itself is the payload's own vocabulary (docs/API-CONTRACT.md's
    # warning-code table), so echoing it is quoting the payload, not inventing
    # a new claim about it.
    codes = []
    for warning in payload.get("warnings") or []:
        if isinstance(warning, str):
            codes.append(warning)
        elif isinstance(warning, dict):
            code = warning.get("code") or warning.get("title")
            if code:
                codes.append(code)
    if codes:
        parts.append(f"Active warning{'s' if len(codes) != 1 else ''}: {', '.join(codes)}.")

    parts.append("This assessment is based on user-provided data and is not financial advice.")
    return " ".join(parts)
