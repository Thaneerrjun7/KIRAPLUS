"""Pure aggregation for the Profile contract's commitment list.

All monetary fields are integer sen. This utility deliberately accepts the
existing ``Profile.commitments`` shape and introduces no separate API surface.
"""

_KINDS = ("bnpl", "loan", "card", "other")


def aggregate_commitments(commitments: list[dict]) -> dict:
    """Return totals, kind breakdown, earliest due date and monthly schedule.

    A commitment contributes to month ``n`` while ``months_left >= n``. Items
    with zero months remaining still appear in today's totals, but have no
    future scheduled payment.
    """
    by_kind = {
        kind: {"count": 0, "monthly_total_sen": 0}
        for kind in _KINDS
    }
    monthly_total_sen = 0
    outstanding_total_sen = 0
    bnpl_monthly_sen = 0
    next_due = None
    max_months = 0

    for commitment in commitments:
        kind = commitment["kind"]
        monthly_sen = commitment["monthly_sen"]
        outstanding_sen = commitment.get("outstanding_sen", 0)
        months_left = commitment.get("months_left", 0)

        monthly_total_sen += monthly_sen
        outstanding_total_sen += outstanding_sen
        by_kind[kind]["count"] += 1
        by_kind[kind]["monthly_total_sen"] += monthly_sen
        if kind == "bnpl":
            bnpl_monthly_sen += monthly_sen

        due = commitment.get("next_due")
        if due and (next_due is None or due < next_due):
            next_due = due
        max_months = max(max_months, months_left)

    schedule = [
        {
            "month": month,
            "monthly_sen": sum(
                commitment["monthly_sen"]
                for commitment in commitments
                if commitment.get("months_left", 0) >= month
            ),
        }
        for month in range(1, max_months + 1)
    ]

    return {
        "active_count": len(commitments),
        "monthly_total_sen": monthly_total_sen,
        "bnpl_monthly_sen": bnpl_monthly_sen,
        "outstanding_total_sen": outstanding_total_sen,
        "next_due": next_due,
        "by_kind": by_kind,
        "schedule": schedule,
    }
