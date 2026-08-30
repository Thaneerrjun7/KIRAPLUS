"""Guards on generated text. Pure Python, zero third-party imports, no I/O.

API-CONTRACT §5 promises that every numeral in a ``source="llm"`` response is
present in the payload. This module is where that promise is kept. It is
deliberately paranoid: a model that invents "you'd save RM340 a month" is worse
than no model at all, because the figure looks exactly as authoritative as the
ones the engine actually computed.

The rule: extract every numeric token from the text, and reject the whole
response unless each one can be produced from a value that is genuinely in the
payload. Rejection is not an error -- llm_service falls back to the
deterministic template, and the user sees source="template".
"""

import re

from prompts.advisor_prompts import BANNED_PHRASES

# Digits, optionally with thousands separators and/or a decimal part.
_NUMERAL = re.compile(r"\d[\d,]*(?:\.\d+)?")

# The published score scale. "out of 100" and "0" are structural, not claims
# about the reader's money, so they are allowed even when absent from a payload.
_STRUCTURAL = {"0", "100"}


def _forms(value: float) -> set:
    """Every string a faithful writer might use for one payload value.

    Covers the raw number, its 1/2/4-decimal renderings, the same value read as
    a percentage (ratios are stored as 0.0778, written as 7.78%) and read as
    ringgit (money is stored in integer sen, written as RM950).
    """
    forms = set()
    for candidate in (value, value * 100, value / 100):
        if candidate != candidate or candidate in (float("inf"), float("-inf")):
            continue
        magnitude = abs(candidate)
        if magnitude == int(magnitude):
            forms.add(str(int(candidate)))
        forms.add(f"{candidate:.1f}")
        forms.add(f"{candidate:.2f}")
        forms.add(f"{candidate:.4f}".rstrip("0").rstrip("."))
        # Truncation, not rounding -- fmt_rm uses integer division.
        forms.add(str(int(candidate)))
    return {form.lstrip("-") for form in forms}


def allowed_numerals(payload) -> set:
    """Walk the payload and collect every writable form of every number in it."""
    allowed = set(_STRUCTURAL)

    def walk(node):
        if isinstance(node, bool):
            return
        if isinstance(node, (int, float)):
            allowed.update(_forms(float(node)))
        elif isinstance(node, dict):
            for item in node.values():
                walk(item)
        elif isinstance(node, (list, tuple)):
            for item in node:
                walk(item)

    walk(payload)
    return allowed


def unknown_numerals(text: str, payload) -> list:
    """Numerals in ``text`` that no payload value could have produced."""
    allowed = allowed_numerals(payload)
    unknown = []
    for raw in _NUMERAL.findall(text):
        token = raw.replace(",", "")
        if token in allowed:
            continue
        # A trailing ".0" or stray zeros shouldn't fail an otherwise honest figure.
        if "." in token and token.rstrip("0").rstrip(".") in allowed:
            continue
        unknown.append(token)
    return unknown


def banned_phrases(text: str) -> list:
    """Advice-shaped language the product is not allowed to produce."""
    lowered = text.lower()
    return [phrase for phrase in BANNED_PHRASES if phrase in lowered]


def verify(text: str, payload) -> tuple:
    """Return ``(ok, reason)``. ``reason`` is "" when the text passes.

    Reasons are for logging and tests, never for the user -- a rejected
    response is replaced silently by the template.
    """
    if not text or not text.strip():
        return False, "empty response"
    invented = unknown_numerals(text, payload)
    if invented:
        return False, f"invented numerals: {', '.join(invented[:5])}"
    advice = banned_phrases(text)
    if advice:
        return False, f"banned phrase: {advice[0]}"
    return True, ""
