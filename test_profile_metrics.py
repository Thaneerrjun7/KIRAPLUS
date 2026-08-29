"""Core financial-profile metric coverage.

The public contract expresses monetary values as integer sen.  These tests
exercise the Stage 1 calculations without adding a competing profile API.
"""

from utils.features import derive


def _profile(**overrides):
    profile = {
        "income_sen": 500_000,
        "fixed_expenses_sen": 200_000,
        "var_expenses_sen": 100_000,
        "savings_sen": 400_000,
        "loan_monthly_sen": 0,
        "commitments": [
            {"kind": "bnpl", "monthly_sen": 50_000},
            {"kind": "loan", "monthly_sen": 50_000},
        ],
    }
    profile.update(overrides)
    return profile


def test_derive_calculates_surplus_debt_ratio_and_emergency_buffer():
    metrics = derive(_profile())

    assert metrics["debt_sen"] == 100_000
    assert metrics["outflow_sen"] == 400_000
    assert metrics["buffer_sen"] == 100_000
    assert metrics["dsr"] == 0.2
    assert metrics["runway_months"] == 1.0
    assert metrics["bnpl_monthly_sen"] == 50_000
    assert metrics["n_bnpl"] == 1


def test_derive_reports_a_negative_surplus_for_deficit_cash_flow():
    metrics = derive(
        _profile(
            income_sen=100_000,
            fixed_expenses_sen=70_000,
            var_expenses_sen=30_000,
            savings_sen=50_000,
            commitments=[{"kind": "bnpl", "monthly_sen": 10_000}],
        )
    )

    assert metrics["buffer_sen"] == -10_000
    assert metrics["buffer_ratio"] == -0.1
    assert metrics["commitment_ratio"] == 1.1


def test_derive_handles_zero_income_and_empty_commitments_safely():
    metrics = derive(
        _profile(
            income_sen=0,
            fixed_expenses_sen=0,
            var_expenses_sen=0,
            savings_sen=0,
            commitments=[],
        )
    )

    assert metrics["debt_sen"] == 0
    assert metrics["buffer_sen"] == 0
    assert metrics["dsr"] == 0.0
    assert metrics["bnpl_ratio"] == 0.0
    assert metrics["buffer_ratio"] == 0.0
    assert metrics["commitment_ratio"] == 0.0
    assert metrics["n_bnpl"] == 0
