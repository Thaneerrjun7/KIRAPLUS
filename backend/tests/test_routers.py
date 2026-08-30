"""FastAPI transport -- docs/API-CONTRACT.md §9. Aliff's slice, not covered by T-01...T-13.

Uses FastAPI's TestClient -- no live server needed. Asserts routing and error shape only;
scoring/warning/simulation correctness is already covered by test_scoring.py / test_warnings.py /
test_simulate.py and must not be re-asserted here.
"""
import pytest
from fastapi.testclient import TestClient

from database.init_db import init_db


@pytest.fixture(autouse=True)
def fresh_db(tmp_path, monkeypatch):
    db_path = str(tmp_path / "test.db")
    init_db(db_path)
    monkeypatch.setenv("KIRA_DB_PATH", db_path)


@pytest.fixture
def client():
    from app.main import app

    return TestClient(app)


def _valid_profile():
    return {
        "label": "Test profile",
        "income_sen": 450000,
        "fixed_expenses_sen": 198400,
        "var_expenses_sen": 121600,
        "savings_sen": 225000,
        "loan_monthly_sen": 10000,
        "commitments": [],
    }


def test_health_returns_ok(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_post_profiles_persists_and_returns_profile_id(client):
    response = client.post("/profiles", json=_valid_profile())
    assert response.status_code == 200
    body = response.json()
    assert isinstance(body["profile_id"], int)
    assert "updated_at" in body


def test_post_profiles_with_invalid_income_returns_4xx_not_500(client):
    invalid = _valid_profile()
    invalid["income_sen"] = 0
    response = client.post("/profiles", json=invalid)
    assert 400 <= response.status_code < 500
    body = response.json()
    assert body["field"] == "income_sen"
    assert "Income" in body["message"]


def test_get_profile_round_trips(client):
    created = client.post("/profiles", json=_valid_profile()).json()
    response = client.get(f"/profiles/{created['profile_id']}")
    assert response.status_code == 200
    assert response.json()["income_sen"] == 450000


def test_get_unknown_profile_returns_4xx_not_500(client):
    response = client.get("/profiles/999")
    assert 400 <= response.status_code < 500


def test_get_profiles_lists_saved_profiles(client):
    created = client.post("/profiles", json=_valid_profile()).json()
    response = client.get("/profiles")
    assert response.status_code == 200
    ids = [p["profile_id"] for p in response.json()]
    assert created["profile_id"] in ids


def test_get_demo_profile_returns_unsaved_aisyah(client):
    response = client.get("/profiles/demo/aisyah")
    assert response.status_code == 200
    body = response.json()
    assert body["profile_id"] is None
    assert body["income_sen"] == 450000


def test_get_demo_profile_unknown_name_returns_4xx_not_500(client):
    response = client.get("/profiles/demo/not-a-real-persona")
    assert 400 <= response.status_code < 500


def test_post_project_returns_a_trajectory(client):
    response = client.post("/project", json={"profile": _valid_profile(), "months": 6})

    assert response.status_code == 200
    body = response.json()
    assert len(body["timeline"]) == 6
    assert body["timeline"][0]["month"] == 1


def test_post_project_with_an_impossible_horizon_returns_4xx_not_500(client):
    response = client.post("/project", json={"profile": _valid_profile(), "months": 999})

    assert 400 <= response.status_code < 500
    assert response.json()["field"] == "months"


def test_post_explain_returns_text_and_source(client):
    response = client.post(
        "/explain",
        json={"score": 68, "band": "MODERATE RISK", "features": {"buffer_sen": 95000}},
    )

    assert response.status_code == 200
    assert response.json()["source"] in {"llm", "template"}
