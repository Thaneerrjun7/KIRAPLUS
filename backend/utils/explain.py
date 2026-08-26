"""Deterministic explanation templates -- the fallback that must always work
with no LLM available. See docs/API-CONTRACT.md §5.
"""


def template(payload: dict) -> str:
    raise NotImplementedError
