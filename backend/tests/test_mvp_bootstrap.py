"""Regressions for the two defects that broke the MVP in a browser.

Both were invisible to the existing suite because the suite worked around them:
tests/test_routers.py initialises the database itself in a fixture, and
tests/test_llm_guard.py only ever passed the Assessment shape to explain().
A real browser did neither.
"""

import sqlite3

import pytest
from fastapi.testclient import TestClient

from app.main import _ensure_database
from services.llm_service import explain
from utils.explain import template
from utils.guard import verify


# --- Defect 1: `uvicorn app.main:app` never created the schema --------------

def test_a_bare_boot_creates_the_schema(tmp_path, monkeypatch):
    """POST /profiles used to 500 with `no such table: profiles` on first run."""
    db_path = tmp_path / "fresh.db"
    monkeypatch.setenv("KIRA_DB_PATH", str(db_path))

    _ensure_database()

    connection = sqlite3.connect(db_path)
    try:
        tables = {row[0] for row in connection.execute(
            "SELECT name FROM sqlite_master WHERE type = 'table'"
        )}
    finally:
        connection.close()
    assert "profiles" in tables


def test_bootstrapping_twice_does_not_destroy_an_existing_database(tmp_path, monkeypatch):
    """schema.sql has no DROP and no IF NOT EXISTS -- a second init_db() would raise."""
    db_path = tmp_path / "fresh.db"
    monkeypatch.setenv("KIRA_DB_PATH", str(db_path))
    _ensure_database()

    connection = sqlite3.connect(db_path)
    connection.execute(
        "INSERT INTO profiles (label, income_sen, fixed_expenses_sen, var_expenses_sen, "
        "savings_sen) VALUES ('keep me', 450000, 198400, 121600, 225000)"
    )
    connection.commit()
    connection.close()

    _ensure_database()

    connection = sqlite3.connect(db_path)
    try:
        rows = connection.execute("SELECT label FROM profiles").fetchall()
    finally:
        connection.close()
    assert rows == [("keep me",)]


def test_saving_a_profile_works_against_a_database_nobody_initialised(tmp_path, monkeypatch):
    """The end-to-end version of the same defect, over HTTP."""
    monkeypatch.setenv("KIRA_DB_PATH", str(tmp_path / "boot.db"))

    from app.main import app

    # `with TestClient(...)` is what runs the lifespan -- a bare TestClient(app)
    # does not, which is precisely how this defect stayed hidden.
    with TestClient(app) as client:
        response = client.post("/profiles", json={
            "label": "Fresh clone",
            "income_sen": 450000,
            "fixed_expenses_sen": 198400,
            "var_expenses_sen": 121600,
            "savings_sen": 225000,
            "loan_monthly_sen": 10000,
            "commitments": [],
        })

    assert response.status_code == 200, response.text
    assert response.json()["profile_id"]


# --- Defect 2: explain() only understood one of the two payload shapes ------

def _contract_payload():
    """Exactly what frontend/app/(app)/dashboard/page.tsx sends -- API-CONTRACT §5."""
    return {
        "score": 68,
        "band": "MODERATE RISK",
        "score_after": 68,
        "band_after": "MODERATE RISK",
        "buffer_before_sen": 95_000,
        "buffer_after_sen": 95_000,
        "currency": "MYR",
        "factors": [
            {"name": "Emergency buffer", "sub": 10.56, "weight": 15,
             "contribution": 1.58, "rank": 1},
        ],
        "warnings": ["LOW_BUFFER"],
        "p_stress_12m": None,
        "purchase": None,
    }


def _assessment_payload():
    return {
        "score": 68,
        "band": "MODERATE RISK",
        "features": {"buffer_sen": 95_000, "dsr": 0.0778,
                     "runway_months": 0.6338, "n_bnpl": 2},
        "warnings": [{"code": "LOW_BUFFER", "level": "red",
                      "title": "Emergency buffer is thin"}],
    }


@pytest.mark.parametrize("payload", [_contract_payload(), _assessment_payload()])
def test_the_template_renders_both_payload_shapes(payload):
    text = template(payload)

    assert "68" in text
    assert "RM950" in text
    assert "not financial advice" in text.lower()


@pytest.mark.parametrize("payload", [_contract_payload(), _assessment_payload()])
def test_explain_never_returns_the_unavailable_message_for_a_valid_payload(payload):
    """This message on the dashboard was the user-visible symptom."""
    text, source = explain(payload)

    assert source == "template"
    assert "currently unavailable" not in text


@pytest.mark.parametrize("payload", [_contract_payload(), _assessment_payload()])
def test_the_template_still_passes_its_own_numeral_guard(payload):
    ok, reason = verify(template(payload), payload)

    assert ok, reason


def test_the_template_names_the_purchase_when_one_is_being_simulated():
    payload = {**_contract_payload(), "score_after": 54, "buffer_after_sen": 75_000,
               "purchase": {"price_sen": 240_000, "tenure_months": 12, "monthly_sen": 20_000}}

    text = template(payload)

    assert "54" in text and "RM750" in text and "12 months" in text


def test_the_template_survives_a_payload_with_almost_nothing_in_it():
    text = template({"score": 41, "band": "HIGH RISK"})

    assert "41" in text
    assert "not financial advice" in text.lower()
