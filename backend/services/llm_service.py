"""Grounded, guarded explanation layer. Never computes, never recommends.

See docs/API-CONTRACT.md §5. Guarantees the application layer may assume:

- Returns within ``LLM_TIMEOUT_SECONDS`` (default 4), always.
- Never raises -- every failure path returns ``(template_text, "template")``.
- Every numeral in a ``source="llm"`` response is present in the payload,
  enforced by utils.guard (T-10).
- Works with ``LLM_API_KEY`` unset (T-11) -- that is the normal case, not an
  error case. The demo must survive a dead conference wifi and an expired key.

The client speaks the OpenAI *chat completions* wire format, which is
deliberate: Groq, OpenRouter, Together, Gemini's compatibility endpoint and a
local Ollama all accept it. Switching provider on demo day is two environment
variables, not a code change.
"""

import json
import os
import urllib.error
import urllib.request

from prompts.advisor_prompts import SYSTEM_PROMPT, build_user_prompt
from utils.explain import template
from utils.guard import verify

DEFAULT_BASE_URL = "https://api.groq.com/openai/v1"
DEFAULT_MODEL = "llama-3.1-8b-instant"
DEFAULT_TIMEOUT_SECONDS = 4.0

# Short by design. The prompt asks for 3-5 sentences; a model that ignores that
# gets cut off rather than allowed to ramble into unguarded territory.
MAX_TOKENS = 320
TEMPERATURE = 0.2


def _timeout_seconds() -> float:
    try:
        return float(os.environ.get("LLM_TIMEOUT_SECONDS", DEFAULT_TIMEOUT_SECONDS))
    except (TypeError, ValueError):
        return DEFAULT_TIMEOUT_SECONDS


def _call_llm(payload: dict, api_key: str) -> str:
    """POST one chat completion and return the message text, or "" on any failure.

    Uses urllib rather than requests so the guarantee holds even in a stripped
    container: the standard library is always there.
    """
    base_url = os.environ.get("LLM_BASE_URL", DEFAULT_BASE_URL).rstrip("/")
    model = os.environ.get("LLM_MODEL") or DEFAULT_MODEL

    body = json.dumps(
        {
            "model": model,
            "temperature": TEMPERATURE,
            "max_tokens": MAX_TOKENS,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": build_user_prompt(payload)},
            ],
        }
    ).encode("utf-8")

    request = urllib.request.Request(
        f"{base_url}/chat/completions",
        data=body,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=_timeout_seconds()) as response:
            parsed = json.loads(response.read().decode("utf-8"))
        return (parsed["choices"][0]["message"]["content"] or "").strip()
    except (urllib.error.URLError, OSError, KeyError, IndexError, ValueError, TypeError):
        # Network down, key rejected, timeout, malformed body -- all the same
        # outcome as far as the caller is concerned.
        return ""


def explain(payload: dict) -> tuple:
    """Return ``(text, source)`` where ``source`` is "llm" or "template"."""
    try:
        fallback = template(payload)
    except Exception:
        fallback = "Assessment explanation is currently unavailable."

    try:
        api_key = (os.environ.get("LLM_API_KEY") or "").strip()
        if not api_key:
            return fallback, "template"

        generated = _call_llm(payload, api_key)
        if not generated:
            return fallback, "template"

        ok, _reason = verify(generated, payload)
        if not ok:
            return fallback, "template"

        return generated, "llm"
    except Exception:
        return fallback, "template"
