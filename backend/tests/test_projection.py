"""Stage 8 -- the 6-month maturity trajectory. API-CONTRACT §5b.

Every assertion is against data/mock-data.json, so a drift in the frozen
personas fails here too, not just in test_scoring.py.
"""

import pytest

from errors import ValidationError
from services.projection_service import projection
from utils.projection import MAX_HORIZON_MONTHS, project
from utils.scoring import kira_score


@pytest.fixture
def daniel_profile(personas):
    daniel = next(persona for persona in personas if persona["id"] == "daniel")
    return {**daniel["profile"], "commitments": daniel["commitments"]}


@pytest.fixture
def farah_profile(personas):
    farah = next(persona for persona in personas if persona["id"] == "farah")
    return {**farah["profile"], "commitments": farah["commitments"]}


# --- Shape -------------------------------------------------------------------

def test_the_horizon_defines_the_timeline_length(aisyah_profile):
    assert len(project(aisyah_profile, 6)["timeline"]) == 6
    assert len(project(aisyah_profile, 3)["timeline"]) == 3


def test_the_horizon_is_clamped_rather_than_exploding(aisyah_profile):
    assert project(aisyah_profile, 999)["horizon_months"] == MAX_HORIZON_MONTHS
    assert project(aisyah_profile, 0)["horizon_months"] == 1


# --- Consistency with the frozen engine -------------------------------------

def test_month_one_reproduces_todays_score(aisyah_profile):
    result = project(aisyah_profile, 6)

    assert result["score_now"] == kira_score(aisyah_profile)["score"]
    assert result["timeline"][0]["score"] == result["score_now"]
    assert result["timeline"][0]["delta"] == 0


def test_aisyah_recovers_as_her_bnpl_plans_mature(aisyah_profile):
    result = project(aisyah_profile, 6)

    assert result["score_final"] > result["score_now"]
    assert result["delta"] == result["score_final"] - result["score_now"]
    # Her two BNPL plans have 2 and 4 months left, so month 5 is the first
    # month she pays no BNPL at all.
    assert result["months_to_bnpl_free"] == 5


def test_farah_improves_but_her_loans_outlast_the_horizon(farah_profile):
    result = project(farah_profile, 6)

    assert result["score_final"] > result["score_now"]
    assert result["months_to_bnpl_free"] is None


def test_a_debt_free_profile_is_bnpl_free_immediately(daniel_profile):
    result = project(daniel_profile, 6)

    assert result["months_to_bnpl_free"] == 1
    assert result["debt_freed_sen"] >= 0


# --- Monotonicity: adding nothing can only unwind commitments ---------------

def test_debt_never_rises_across_the_horizon(aisyah_profile, farah_profile):
    for profile in (aisyah_profile, farah_profile):
        debts = [row["debt_sen"] for row in project(profile, 12)["timeline"]]
        assert debts == sorted(debts, reverse=True)


def test_matured_commitments_are_named_when_they_drop_off(aisyah_profile):
    timeline = project(aisyah_profile, 6)["timeline"]
    named = [label for row in timeline for label in row["matured"]]

    assert named, "a maturing plan must name itself, per the tone rules"
    assert any("Uniqlo" in label for label in named)


# --- Service-layer validation ------------------------------------------------

def test_the_service_stamps_the_engine_version_and_disclaimer(aisyah_profile):
    result = projection(aisyah_profile, 6)

    assert result["engine_version"]
    assert "Not financial advice." in result["disclaimer"]
    assert "not a forecast" in result["assumptions"]


@pytest.mark.parametrize("months", [0, -1, 37, "six", True])
def test_the_service_rejects_an_impossible_horizon(aisyah_profile, months):
    with pytest.raises(ValidationError):
        projection(aisyah_profile, months)


def test_the_service_rejects_a_profile_missing_a_required_field(aisyah_profile):
    incomplete = {k: v for k, v in aisyah_profile.items() if k != "savings_sen"}

    with pytest.raises(ValidationError) as caught:
        projection(incomplete, 6)

    assert caught.value.field == "savings_sen"
