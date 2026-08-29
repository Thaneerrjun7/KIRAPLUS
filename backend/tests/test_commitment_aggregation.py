"""Backend aggregation of commitments and their remaining payment schedule."""

from utils.commitments import aggregate_commitments


def test_aggregate_commitments_sums_active_plans_and_builds_schedule():
    commitments = [
        {
            "kind": "bnpl",
            "monthly_sen": 15_000,
            "outstanding_sen": 45_000,
            "months_left": 3,
            "next_due": "2026-09-03",
        },
        {
            "kind": "bnpl",
            "monthly_sen": 20_000,
            "outstanding_sen": 20_000,
            "months_left": 1,
            "next_due": "2026-09-01",
        },
        {
            "kind": "loan",
            "monthly_sen": 10_000,
            "outstanding_sen": 20_000,
            "months_left": 2,
            "next_due": None,
        },
    ]

    result = aggregate_commitments(commitments)

    assert result["active_count"] == 3
    assert result["monthly_total_sen"] == 45_000
    assert result["bnpl_monthly_sen"] == 35_000
    assert result["outstanding_total_sen"] == 85_000
    assert result["next_due"] == "2026-09-01"
    assert result["by_kind"]["bnpl"] == {"count": 2, "monthly_total_sen": 35_000}
    assert result["by_kind"]["loan"] == {"count": 1, "monthly_total_sen": 10_000}
    assert result["schedule"] == [
        {"month": 1, "monthly_sen": 45_000},
        {"month": 2, "monthly_sen": 25_000},
        {"month": 3, "monthly_sen": 15_000},
    ]


def test_aggregate_commitments_handles_an_empty_list():
    result = aggregate_commitments([])

    assert result["active_count"] == 0
    assert result["monthly_total_sen"] == 0
    assert result["bnpl_monthly_sen"] == 0
    assert result["outstanding_total_sen"] == 0
    assert result["next_due"] is None
    assert result["schedule"] == []
