"""Stage 9 -- payoff ordering. API-CONTRACT §5c.

Asserted against data/mock-data.json, so persona drift fails here too.
"""

import pytest

from errors import ValidationError
from services.optimizer_service import MAX_EXTRA_SEN, optimize
from utils.optimizer import optimise


@pytest.fixture
def farah_profile(personas):
    farah = next(persona for persona in personas if persona["id"] == "farah")
    return {**farah["profile"], "commitments": farah["commitments"]}


@pytest.fixture
def interest_bearing_profile(farah_profile):
    """Farah, but with one commitment carrying a real card rate."""
    commitments = [dict(commitment) for commitment in farah_profile["commitments"]]
    largest = max(commitments, key=lambda c: c["outstanding_sen"])
    largest["apr"] = 0.18
    return {**farah_profile, "commitments": commitments}


# --- Both orderings, never a verdict ----------------------------------------

def test_both_strategies_are_returned(farah_profile):
    result = optimise(farah_profile, extra_sen=10_000)

    assert set(result["strategies"]) == {"avalanche", "snowball"}
    assert result["has_debt"] is True


def test_no_recommendation_language_appears_anywhere(farah_profile):
    """docs/HANDOFF.md §17 -- these are banned strings in this codebase."""
    import json

    rendered = json.dumps(optimize(farah_profile, 10_000)).lower()

    for banned in ("we recommend", "you should", "you cannot afford", "bad decision"):
        assert banned not in rendered


# --- The orderings actually differ in the documented way --------------------

def test_snowball_clears_the_smallest_balance_first(farah_profile):
    order = optimise(farah_profile, 0)["strategies"]["snowball"]["order"]
    balances = [item["outstanding_sen"] for item in order]

    assert balances == sorted(balances)


def test_avalanche_puts_the_highest_rate_first(interest_bearing_profile):
    order = optimise(interest_bearing_profile, 0)["strategies"]["avalanche"]["order"]

    assert order[0]["apr"] == 0.18


def test_avalanche_never_costs_more_interest_than_snowball(interest_bearing_profile):
    result = optimise(interest_bearing_profile, extra_sen=5_000)

    avalanche = result["strategies"]["avalanche"]["interest_paid_sen"]
    snowball = result["strategies"]["snowball"]["interest_paid_sen"]
    assert avalanche <= snowball
    assert result["difference"]["interest_sen"] == snowball - avalanche


def test_at_zero_percent_the_two_orders_cost_the_same(farah_profile):
    result = optimise(farah_profile, extra_sen=10_000)

    assert result["all_zero_interest"] is True
    assert result["difference"]["interest_sen"] == 0
    assert "same" in result["note"]


# --- The payoff itself -------------------------------------------------------

def test_extra_payment_shortens_the_payoff(farah_profile):
    without = optimise(farah_profile, 0)["strategies"]["snowball"]["months_to_debt_free"]
    with_extra = optimise(farah_profile, 50_000)["strategies"]["snowball"]["months_to_debt_free"]

    assert with_extra < without


def test_every_commitment_is_cleared_and_dated(farah_profile):
    plan = optimise(farah_profile, 10_000)["strategies"]["avalanche"]

    assert plan["months_to_debt_free"] is not None
    assert all(item["cleared_in_month"] is not None for item in plan["order"])
    assert plan["timeline"][-1]["remaining_sen"] == 0


def test_a_debt_free_profile_returns_nothing_to_order(personas):
    daniel = next(persona for persona in personas if persona["id"] == "daniel")
    profile = {**daniel["profile"], "commitments": []}

    result = optimise(profile, 0)

    assert result["has_debt"] is False
    assert result["strategies"] == {}


# --- Validation --------------------------------------------------------------

@pytest.mark.parametrize("extra", [-1, "100", 1.5, True, MAX_EXTRA_SEN + 1])
def test_the_service_rejects_an_impossible_extra_payment(farah_profile, extra):
    with pytest.raises(ValidationError) as caught:
        optimize(farah_profile, extra)

    assert caught.value.field == "extra_sen"


def test_the_service_stamps_the_engine_version_and_disclaimer(farah_profile):
    result = optimize(farah_profile, 0)

    assert result["engine_version"]
    assert "Not financial advice." in result["disclaimer"]


# --- commitment_id is int | None and is never a safe dict key ---------------

def test_two_unsaved_commitments_sharing_a_null_id_stay_separate(farah_profile):
    """Regression: balances/labels used to be keyed by commitment_id, so two
    commitments both `commitment_id: None` (e.g. unsaved drafts) collapsed
    into one shared balance instead of being paid off independently."""
    profile = {
        **farah_profile,
        "commitments": [
            {"commitment_id": None, "label": "A", "kind": "bnpl",
             "monthly_sen": 5_000, "outstanding_sen": 10_000, "apr": 0.0},
            {"commitment_id": None, "label": "B", "kind": "bnpl",
             "monthly_sen": 1_000, "outstanding_sen": 100_000, "apr": 0.0},
        ],
    }

    result = optimise(profile, extra_sen=0)

    order = result["strategies"]["snowball"]["order"]
    assert len(order) == 2
    outstanding = {item["label"]: item["outstanding_sen"] for item in order}
    assert outstanding == {"A": 10_000, "B": 100_000}
    # A is the smaller balance -- it must clear on its own, well before B.
    cleared = {item["label"]: item["cleared_in_month"] for item in order}
    assert cleared["A"] is not None and cleared["A"] < cleared["B"]


def test_the_service_rejects_a_non_object_commitment(farah_profile):
    profile = {**farah_profile, "commitments": ["not a commitment"]}

    with pytest.raises(ValidationError) as caught:
        optimize(profile, 0)

    assert caught.value.field == "commitments"


def test_the_service_rejects_a_negative_commitment_monthly_sen(farah_profile):
    commitments = [dict(commitment) for commitment in farah_profile["commitments"]]
    commitments[0]["monthly_sen"] = -1
    profile = {**farah_profile, "commitments": commitments}

    with pytest.raises(ValidationError) as caught:
        optimize(profile, 0)

    assert caught.value.field == "monthly_sen"
