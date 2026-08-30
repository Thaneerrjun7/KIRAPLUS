"""Stage 8 -- month-by-month trajectory as existing commitments mature.

Pure Python, zero third-party imports, no I/O. Must never import a web
framework: like utils/scoring.py, this has to be testable without launching
the app.

The point of this module is the other half of the product's sentence. The
simulator answers "what does this new purchase cost me?"; the projection
answers "what do I get back, and when, if I add nothing?" Both are consequence,
neither is advice.

Method, stated plainly so a judge can reproduce it by hand:

1. A commitment with ``months_left = k`` is still being paid in months 1..k and
   is gone from month k+1 onward.
2. Each month is scored by the *same* frozen engine (utils.scoring.kira_score)
   on a profile whose commitment list is that month's surviving commitments.
3. Unspent buffer accumulates into savings, floored at zero. Nothing else about
   the household is assumed to change -- no raises, no inflation, no new
   spending. This is a maturity schedule, not a forecast, and the docstring
   says so because the slide deck must say so too.
"""

from utils.scoring import kira_score

DEFAULT_HORIZON_MONTHS = 6
MAX_HORIZON_MONTHS = 36


def _surviving(commitments: list, month: int) -> list:
    """Commitments still being paid in ``month`` (1-indexed, 1 = next month)."""
    return [c for c in commitments if c.get("months_left", 0) >= month]


def _matured_in(commitments: list, month: int) -> list:
    """Labels of the commitments that finished at the end of the previous month."""
    return [
        c.get("label") or c.get("provider") or f"commitment {c.get('commitment_id', '?')}"
        for c in commitments
        if c.get("months_left", 0) == month - 1 and c.get("months_left", 0) > 0
    ]


def project(profile: dict, months: int = DEFAULT_HORIZON_MONTHS) -> dict:
    """Return the trajectory of score, buffer and savings over ``months`` months."""
    horizon = max(1, min(int(months), MAX_HORIZON_MONTHS))
    commitments = profile.get("commitments", []) or []

    baseline = kira_score(profile)
    score_now = baseline["score"]
    debt_now_sen = baseline["features"]["debt_sen"]

    savings_sen = profile.get("savings_sen", 0)
    timeline = []

    for month in range(1, horizon + 1):
        month_profile = {
            **profile,
            "savings_sen": savings_sen,
            "commitments": _surviving(commitments, month),
        }
        scored = kira_score(month_profile)
        features = scored["features"]

        timeline.append(
            {
                "month": month,
                "active_commitments": len(month_profile["commitments"]),
                "debt_sen": features["debt_sen"],
                "bnpl_monthly_sen": features["bnpl_monthly_sen"],
                "n_bnpl": features["n_bnpl"],
                "buffer_sen": features["buffer_sen"],
                "savings_sen": savings_sen,
                "runway_months": features["runway_months"],
                "score": scored["score"],
                "band": scored["band"],
                "delta": scored["score"] - score_now,
                "matured": _matured_in(commitments, month),
            }
        )

        # Unspent buffer accrues; a deficit eats savings but never goes negative.
        savings_sen = max(0, savings_sen + features["buffer_sen"])

    final = timeline[-1]
    bnpl_free_month = next(
        (row["month"] for row in timeline if row["n_bnpl"] == 0), None
    )

    return {
        "horizon_months": horizon,
        "score_now": score_now,
        "band_now": baseline["band"],
        "score_final": final["score"],
        "band_final": final["band"],
        "delta": final["delta"],
        "debt_freed_sen": debt_now_sen - final["debt_sen"],
        "months_to_bnpl_free": bnpl_free_month,
        "timeline": timeline,
        "assumptions": (
            "Income, fixed expenses and variable expenses are held constant. "
            "No new commitments are added. Unspent monthly buffer accumulates "
            "into savings. This is a maturity schedule of commitments you "
            "already have, not a forecast."
        ),
    }
