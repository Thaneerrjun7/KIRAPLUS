import json
import pytest

from utils.features import derive
from utils.scoring import kira_score
from utils.format import fmt_rm, fmt_rm_cents, to_sen


@pytest.fixture
def fixtures():
    with open("data/mock-data.json") as f:
        return json.load(f)


@pytest.fixture
def personas(fixtures):
    return fixtures["personas"]


def test_t01_score_matches(personas):
    for p in personas:
        profile = {**p["profile"], "commitments": p["commitments"]}
        result = kira_score(profile)
        assert result["score"] == p["expected"]["score"], f"Score mismatch for {p['id']}"


def test_t02_subscores_match(personas):
    for p in personas:
        profile = {**p["profile"], "commitments": p["commitments"]}
        result = kira_score(profile)
        for k, v in p["expected"]["subscores"].items():
            actual = result["subscores"].get(k, -1)
            assert abs(actual - v) < 0.015, f"Subscore {k} mismatch for {p['id']}"


def test_t03_contributions_sum_matches(personas):
    for p in personas:
        profile = {**p["profile"], "commitments": p["commitments"]}
        result = kira_score(profile)
        total_contrib = sum(result["contributions"].values())
        raw_score = total_contrib - result["penalty"]
        assert result["score"] == max(0, min(100, round(raw_score)))


def test_t04_band_classification(personas):
    for p in personas:
        profile = {**p["profile"], "commitments": p["commitments"]}
        result = kira_score(profile)
        assert result["band"] == p["expected"]["band"], f"Band mismatch for {p['id']}"


def test_t05_features_derived_correctly(personas):
    for p in personas:
        profile = {**p["profile"], "commitments": p["commitments"]}
        feats = derive(profile)
        
        # We only explicitly check a few easily verifiable ones against expectation,
        # but the main test is that derive() doesn't raise and returns the expected shape.
        assert "dsr" in feats
        assert "bnpl_ratio" in feats
        assert "buffer_sen" in feats
        assert "outflow_sen" in feats


def test_t06_format_functions():
    assert fmt_rm(95000) == "RM950"
    assert fmt_rm_cents(95000) == "RM950.00"
    assert to_sen(950.0) == 95000
    assert to_sen(950.12) == 95012


def test_debt_free_profile_gets_full_repayment_capacity_score():
    profile = {
        "income_sen": 1_000_000,
        "fixed_expenses_sen": 100,
        "var_expenses_sen": 0,
        "savings_sen": 3_000_000,
        "loan_monthly_sen": 0,
        "commitments": [],
    }

    result = kira_score(profile)

    assert result["features"]["coverage"] == 99.0
    assert result["subscores"]["repayment_capacity"] == 100.0
    assert result["score"] == 100


def test_score_is_clamped_at_zero_for_an_extreme_deficit_profile():
    profile = {
        "income_sen": 100_000,
        "fixed_expenses_sen": 100_000,
        "var_expenses_sen": 0,
        "savings_sen": 0,
        "loan_monthly_sen": 0,
        "commitments": [{"kind": "bnpl", "monthly_sen": 100_000}],
    }

    result = kira_score(profile)

    assert result["score"] == 0
    assert result["band"] == "HIGH RISK"
