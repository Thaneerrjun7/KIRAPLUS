"""T-10 (numeral guard) and T-11 (offline mode) -- API-CONTRACT §5."""

from services.llm_service import explain


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


def test_explain_uses_the_template_when_no_api_key_is_set(monkeypatch):
    monkeypatch.delenv("LLM_API_KEY", raising=False)

    text, source = explain(_assessment())

    assert source == "template"
    assert "68" in text
    assert "RM950" in text


def test_explain_stays_local_even_when_an_api_key_is_present(monkeypatch):
    monkeypatch.setenv("LLM_API_KEY", "test-key")

    text, source = explain(_assessment())

    assert source == "template"
    assert "68" in text
