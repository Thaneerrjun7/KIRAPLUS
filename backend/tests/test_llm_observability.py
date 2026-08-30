"""Observability for the LLM call path.

_call_llm() and explain() are required to never raise (see services/llm_service.py's
own docstring guarantees) -- but until now every failure was swallowed into a bare
"" with zero logging, which made it impossible to tell from outside whether a
production /explain response fell back to the template because of a missing key,
a rejected key, a wrong model id, a timeout, or utils.guard rejecting a genuinely
grounded response. These tests pin down that every failure path now logs enough
to diagnose it, without ever logging the API key itself.
"""

import io
import logging
import urllib.error

from services import llm_service
from services.llm_service import explain


def _assessment():
    return {
        "score": 68,
        "band": "MODERATE RISK",
        "buffer_before_sen": 95_000,
        "buffer_after_sen": 95_000,
        "warnings": ["LOW_BUFFER"],
    }


def test_call_llm_logs_http_error_status_and_body(monkeypatch, caplog):
    monkeypatch.setenv("LLM_BASE_URL", "https://generativelanguage.googleapis.com/v1beta/openai")
    monkeypatch.setenv("LLM_MODEL", "gemini-2.0-flash")

    def boom(*args, **kwargs):
        raise urllib.error.HTTPError(
            url="https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
            code=401,
            msg="Unauthorized",
            hdrs=None,
            fp=io.BytesIO(b'{"error": {"message": "API key not valid"}}'),
        )

    monkeypatch.setattr(llm_service.urllib.request, "urlopen", boom)

    with caplog.at_level(logging.WARNING, logger="services.llm_service"):
        result = llm_service._call_llm(_assessment(), "test-key")

    assert result == ""
    assert any(
        "401" in record.message and "API key not valid" in record.message
        for record in caplog.records
    ), [r.message for r in caplog.records]


def test_call_llm_logs_other_network_failures_with_exception_type(monkeypatch, caplog):
    def boom(*args, **kwargs):
        raise OSError("no route to host")

    monkeypatch.setattr(llm_service.urllib.request, "urlopen", boom)

    with caplog.at_level(logging.WARNING, logger="services.llm_service"):
        result = llm_service._call_llm(_assessment(), "test-key")

    assert result == ""
    assert any(
        "OSError" in record.message and "no route to host" in record.message
        for record in caplog.records
    ), [r.message for r in caplog.records]


def test_call_llm_never_logs_the_api_key_value(monkeypatch, caplog):
    secret_key = "sk-this-must-never-appear-in-logs"

    def boom(*args, **kwargs):
        raise OSError("timed out")

    monkeypatch.setattr(llm_service.urllib.request, "urlopen", boom)

    with caplog.at_level(logging.WARNING, logger="services.llm_service"):
        llm_service._call_llm(_assessment(), secret_key)

    for record in caplog.records:
        assert secret_key not in record.message


def test_explain_logs_the_guard_rejection_reason(monkeypatch, caplog):
    monkeypatch.setenv("LLM_API_KEY", "test-key")
    monkeypatch.setattr(
        llm_service,
        "_call_llm",
        lambda payload, key: "Your score is 68 and clearing this frees RM340 a month.",
    )

    with caplog.at_level(logging.INFO, logger="services.llm_service"):
        _text, source = explain(_assessment())

    assert source == "template"
    assert any(
        "invented numerals" in record.message and "340" in record.message
        for record in caplog.records
    ), [r.message for r in caplog.records]


def test_explain_does_not_log_a_warning_when_no_api_key_is_set(monkeypatch, caplog):
    # T-11: no key is the normal/expected case, not a failure -- it must stay quiet.
    monkeypatch.delenv("LLM_API_KEY", raising=False)

    with caplog.at_level(logging.WARNING, logger="services.llm_service"):
        explain(_assessment())

    assert caplog.records == []
