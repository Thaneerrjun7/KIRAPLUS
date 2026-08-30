"""Stage 9 -- debt payoff ordering. Pure Python, zero third-party imports, no I/O.

Must never import a web framework, same rule as utils/scoring.py.

Two orderings, computed side by side and returned together:

- **Avalanche** clears the highest interest rate first. It is the cheaper order
  whenever the rates actually differ.
- **Snowball** clears the smallest outstanding balance first. It is never
  cheaper, but it retires a whole commitment sooner, which is the only thing
  that reduces the *number* of things the user is tracking.

This module deliberately does not pick one. docs/HANDOFF.md §17 bans
recommendation language outright -- "we recommend" and "you should" are banned
strings in this codebase. Both plans are returned with their real costs
attached and the user chooses. Stating that avalanche costs RM120 less is a
consequence; telling somebody which to pick is advice, and KIRA+ does not give
advice.

Note on APR: Malaysian BNPL is overwhelmingly 0% interest, so ``apr`` is an
optional per-commitment field defaulting to 0.0. When every rate is zero the
two orderings cost exactly the same, and avalanche degenerates into snowball
by its documented tie-break. The response says so rather than implying a
saving that isn't there.
"""

# A payoff that hasn't finished by here is reported as unresolved rather than
# looped forever -- a commitment whose payment is below its monthly interest
# never clears, and that is a real state worth surfacing, not a hang.
MAX_MONTHS = 600


def _apr(commitment: dict) -> float:
    try:
        return max(0.0, float(commitment.get("apr", 0.0) or 0.0))
    except (TypeError, ValueError):
        return 0.0


def _order(commitments: list, strategy: str) -> list:
    """Priority order for the extra payment. Ties break deterministically."""
    if strategy == "avalanche":
        # Highest rate first; equal rates fall back to the smaller balance so
        # the ordering is stable and, at 0% across the board, sensible.
        key = lambda c: (-_apr(c), c.get("outstanding_sen", 0), c.get("commitment_id", 0))
    else:
        key = lambda c: (c.get("outstanding_sen", 0), -_apr(c), c.get("commitment_id", 0))
    return sorted(commitments, key=key)


def _run(commitments: list, extra_sen: int, strategy: str) -> dict:
    """Month-by-month payoff simulation for one ordering."""
    ordered = _order(commitments, strategy)
    balances = {c["commitment_id"]: c.get("outstanding_sen", 0) for c in ordered}
    labels = {
        c["commitment_id"]: c.get("label") or c.get("provider") or f"commitment {c['commitment_id']}"
        for c in ordered
    }

    total_paid_sen = 0
    interest_paid_sen = 0
    cleared_at = {}
    timeline = []
    month = 0

    while any(balance > 0 for balance in balances.values()) and month < MAX_MONTHS:
        month += 1
        paid_this_month = 0
        cleared_this_month = []

        # Interest first, on whatever is still outstanding.
        for commitment in ordered:
            cid = commitment["commitment_id"]
            if balances[cid] <= 0:
                continue
            monthly_interest = int(round(balances[cid] * _apr(commitment) / 12))
            balances[cid] += monthly_interest
            interest_paid_sen += monthly_interest

        # Contractual minimums.
        for commitment in ordered:
            cid = commitment["commitment_id"]
            if balances[cid] <= 0:
                continue
            payment = min(commitment.get("monthly_sen", 0), balances[cid])
            balances[cid] -= payment
            paid_this_month += payment
            if balances[cid] <= 0 and cid not in cleared_at:
                cleared_at[cid] = month
                cleared_this_month.append(labels[cid])

        # Everything freed up, plus the user's own extra, onto the head of the
        # order -- this is the whole mechanism, and it is one loop.
        spare = extra_sen + sum(
            commitment.get("monthly_sen", 0)
            for commitment in ordered
            if balances[commitment["commitment_id"]] <= 0
        )
        for commitment in ordered:
            if spare <= 0:
                break
            cid = commitment["commitment_id"]
            if balances[cid] <= 0:
                continue
            payment = min(spare, balances[cid])
            balances[cid] -= payment
            spare -= payment
            paid_this_month += payment
            if balances[cid] <= 0 and cid not in cleared_at:
                cleared_at[cid] = month
                cleared_this_month.append(labels[cid])

        total_paid_sen += paid_this_month
        timeline.append(
            {
                "month": month,
                "paid_sen": paid_this_month,
                "remaining_sen": sum(max(0, b) for b in balances.values()),
                "cleared": cleared_this_month,
            }
        )

    resolved = all(balance <= 0 for balance in balances.values())

    return {
        "strategy": strategy,
        "order": [
            {
                "commitment_id": commitment["commitment_id"],
                "label": labels[commitment["commitment_id"]],
                "provider": commitment.get("provider"),
                "kind": commitment.get("kind"),
                "outstanding_sen": commitment.get("outstanding_sen", 0),
                "monthly_sen": commitment.get("monthly_sen", 0),
                "apr": _apr(commitment),
                "cleared_in_month": cleared_at.get(commitment["commitment_id"]),
            }
            for commitment in ordered
        ],
        "months_to_debt_free": month if resolved else None,
        "total_paid_sen": total_paid_sen,
        "interest_paid_sen": interest_paid_sen,
        "timeline": timeline,
    }


def optimise(profile: dict, extra_sen: int = 0) -> dict:
    """Return both payoff orderings with their real costs, and no verdict."""
    commitments = [
        commitment
        for commitment in (profile.get("commitments") or [])
        if commitment.get("outstanding_sen", 0) > 0
    ]

    if not commitments:
        return {
            "extra_sen": extra_sen,
            "has_debt": False,
            "strategies": {},
            "difference": {"months": 0, "interest_sen": 0},
            "note": "There are no outstanding commitments to order.",
        }

    avalanche = _run(commitments, extra_sen, "avalanche")
    snowball = _run(commitments, extra_sen, "snowball")

    rates = {_apr(commitment) for commitment in commitments}
    all_zero = rates == {0.0}

    if all_zero:
        note = (
            "Every commitment here is at 0% interest, so the two orders cost "
            "exactly the same. The only difference is which commitment "
            "disappears from the list first."
        )
    else:
        note = (
            "Avalanche clears the highest rate first and costs less in "
            "interest. Snowball clears the smallest balance first and retires "
            "a commitment sooner. Both figures are shown; the choice is yours."
        )

    def _months(plan):
        return plan["months_to_debt_free"]

    month_difference = (
        _months(snowball) - _months(avalanche)
        if _months(snowball) is not None and _months(avalanche) is not None
        else None
    )

    return {
        "extra_sen": extra_sen,
        "has_debt": True,
        "all_zero_interest": all_zero,
        "strategies": {"avalanche": avalanche, "snowball": snowball},
        "difference": {
            "months": month_difference,
            "interest_sen": snowball["interest_paid_sen"] - avalanche["interest_paid_sen"],
        },
        "note": note,
    }
