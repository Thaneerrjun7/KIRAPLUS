"""profile_service CRUD -- docs/API-CONTRACT.md §2. Aliff's slice, not covered by T-01...T-13.

Persona fixtures come from data/mock-data.json.
"""
import os

import pytest

from database.init_db import init_db
from errors import ValidationError
from services import profile_service


@pytest.fixture(autouse=True)
def fresh_db(tmp_path, monkeypatch):
    db_path = str(tmp_path / "test.db")
    init_db(db_path)
    monkeypatch.setenv("KIRA_DB_PATH", db_path)


def _valid_profile(**overrides):
    profile = {
        "label": "Test profile",
        "income_sen": 450000,
        "fixed_expenses_sen": 198400,
        "var_expenses_sen": 121600,
        "savings_sen": 225000,
        "loan_monthly_sen": 10000,
        "commitments": [
            {
                "label": "Apparel",
                "provider": "Atome",
                "kind": "bnpl",
                "monthly_sen": 15000,
                "outstanding_sen": 30000,
                "months_left": 2,
                "next_due": "2026-09-03",
            }
        ],
    }
    profile.update(overrides)
    return profile


def test_save_profile_rejects_non_positive_income():
    with pytest.raises(ValidationError):
        profile_service.save_profile(_valid_profile(income_sen=0))


def test_save_profile_rejects_negative_money_field():
    with pytest.raises(ValidationError):
        profile_service.save_profile(_valid_profile(savings_sen=-1))


def test_save_profile_rejects_implausible_expenses():
    with pytest.raises(ValidationError):
        profile_service.save_profile(
            _valid_profile(income_sen=1000, fixed_expenses_sen=6000, var_expenses_sen=6000)
        )


def test_save_profile_rejects_out_of_range_tenure():
    profile = _valid_profile()
    profile["commitments"][0]["months_left"] = 121
    with pytest.raises(ValidationError):
        profile_service.save_profile(profile)


def test_save_profile_returns_profile_id_and_updated_at():
    result = profile_service.save_profile(_valid_profile())
    assert isinstance(result["profile_id"], int)
    assert isinstance(result["updated_at"], str)


def test_load_profile_round_trips_saved_profile():
    saved = profile_service.save_profile(_valid_profile())
    loaded = profile_service.load_profile(saved["profile_id"])
    assert loaded["income_sen"] == 450000
    assert loaded["savings_sen"] == 225000
    assert len(loaded["commitments"]) == 1
    assert loaded["commitments"][0]["kind"] == "bnpl"
    assert loaded["commitments"][0]["monthly_sen"] == 15000


def test_load_profile_unknown_id_raises_validation_error():
    with pytest.raises(ValidationError):
        profile_service.load_profile(999)


def test_list_profiles_returns_saved_profiles():
    saved = profile_service.save_profile(_valid_profile(label="Aisyah demo"))
    profiles = profile_service.list_profiles()
    ids = [p["profile_id"] for p in profiles]
    assert saved["profile_id"] in ids
    entry = next(p for p in profiles if p["profile_id"] == saved["profile_id"])
    assert entry["label"] == "Aisyah demo"
    assert entry["is_demo"] is False


def test_load_demo_returns_unsaved_aisyah_matching_fixtures():
    profile = profile_service.load_demo("aisyah")
    assert profile["profile_id"] is None
    assert profile["income_sen"] == 450000
    assert profile["savings_sen"] == 225000
    assert len(profile["commitments"]) == 3


def test_load_demo_unknown_name_raises_validation_error():
    with pytest.raises(ValidationError):
        profile_service.load_demo("not-a-real-persona")
