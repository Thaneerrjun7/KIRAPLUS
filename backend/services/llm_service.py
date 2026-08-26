"""Grounded, guarded explanation layer. Never computes, never recommends.

See docs/API-CONTRACT.md §5. Guarantees: returns within 4 seconds always;
never raises -- every failure path returns (template_text, "template");
every numeral in a source="llm" response must be present in the payload,
else the response is discarded in favour of the template; works with
LLM_API_KEY unset.
"""


def explain(payload: dict) -> tuple[str, str]:
    """Return (text, source) where source is "llm" or "template"."""
    raise NotImplementedError
