"""T-10 (numeral guard), T-11 (offline mode) and the Stage 7 client -- API-CONTRACT §5.

No test in this file makes a network call or spends a token: the HTTP layer is
monkeypatched at services.llm_service._call_llm, which is exactly the seam the
guard sits behind. What is being tested is the guard and the fallback policy,
not somebody else's model.
"""

import pytest

from services import llm_service
from services.llm_service import explain
from utils.explain import template
from utils.guard import allowed_numerals, banned_phrases, unknown_numerals, verify


def _assessment():
    return {
        "score": 68,
        "band": "MODERATE RISK",
        "features": {
            "buffer_sen": 95_000,
            "dsr": 0.0778,
            "runway_months": 0.6338,
            "n_bnpl": 2,
        },
        "warnings": [
            {"level": "red", "title": "Emergency buffer is thin"},
        ],
    }


# --- T-11: the app works with no key, which is the normal case ---------------

def test_explain_uses_the_template_when_no_api_key_is_set(monkeypatch):
    monkeypatch.delenv("LLM_API_KEY", raising=False)

    text, source = explain(_assessment())

    assert source == "template"
    assert "68" in text
    assert "RM950" in text


def test_explain_never_calls_the_model_without_a_key(monkeypatch):
    monkeypatch.delenv("LLM_API_KEY", raising=False)
    called = []
    monkeypatch.setattr(llm_service, "_call_llm", lambda *a, **k: called.append(1) or "x")

    explain(_assessment())

    assert called == [], "a missing key must short-circuit before the network"


# --- The happy path ----------------------------------------------------------

def test_explain_returns_the_model_text_when_it_is_grounded(monkeypatch):
    monkeypatch.setenv("LLM_API_KEY", "test-key")
    grounded = (
        "Your KIRA Score is 68 out of 100, which puts you in the MODERATE RISK band. "
        "You have RM950 left each month after every obligation, and 2 active BNPL plans. "
        "Your savings would cover 0.6 months of expenses. This is not financial advice."
    )
    monkeypatch.setattr(llm_service, "_call_llm", lambda payload, key: grounded)

    text, source = explain(_assessment())

    assert source == "llm"
    assert text == grounded


# --- T-10: invented numerals void the response ------------------------------

def test_explain_falls_back_when_the_model_invents_a_figure(monkeypatch):
    monkeypatch.setenv("LLM_API_KEY", "test-key")
    monkeypatch.setattr(
        llm_service,
        "_call_llm",
        lambda payload, key: "Your score is 68 and clearing this frees RM340 a month.",
    )

    text, source = explain(_assessment())

    assert source == "template"
    assert "340" not in text


def test_explain_falls_back_on_advice_shaped_language(monkeypatch):
    monkeypatch.setenv("LLM_API_KEY", "test-key")
    monkeypatch.setattr(
        llm_service,
        "_call_llm",
        lambda payload, key: "Your score is 68. You should settle the smaller plan first.",
    )

    _text, source = explain(_assessment())

    assert source == "template"


@pytest.mark.parametrize("returned", ["", "   ", None])
def test_explain_falls_back_on_an_empty_model_response(monkeypatch, returned):
    monkeypatch.setenv("LLM_API_KEY", "test-key")
    monkeypatch.setattr(llm_service, "_call_llm", lambda payload, key: returned)

    _text, source = explain(_assessment())

    assert source == "template"


def test_explain_never_raises_even_if_the_client_explodes(monkeypatch):
    monkeypatch.setenv("LLM_API_KEY", "test-key")

    def boom(payload, key):
        raise RuntimeError("connection reset")

    monkeypatch.setattr(llm_service, "_call_llm", boom)

    text, source = explain(_assessment())

    assert source == "template"
    assert "68" in text


def test_call_llm_swallows_network_failure(monkeypatch):
    def boom(*args, **kwargs):
        raise OSError("no route to host")

    monkeypatch.setattr(llm_service.urllib.request, "urlopen", boom)

    assert llm_service._call_llm(_assessment(), "test-key") == ""


# --- The guard itself --------------------------------------------------------

def test_the_deterministic_template_passes_its_own_guard():
    payload = _assessment()

    ok, reason = verify(template(payload), payload)

    assert ok, reason


def test_allowed_numerals_covers_sen_and_percentage_renderings():
    allowed = allowed_numerals(_assessment())

    assert "950" in allowed, "95000 sen must be writable as RM950"
    assert "7.78" in allowed, "a 0.0778 ratio must be writable as 7.78%"
    assert "68" in allowed
    assert "340" not in allowed


def test_unknown_numerals_ignores_thousands_separators():
    payload = {"buffer_sen": 1_234_500}

    assert unknown_numerals("You have RM12,345 left.", payload) == []


def test_banned_phrases_are_detected_case_insensitively():
    assert banned_phrases("You Should wait.") == ["you should"]
