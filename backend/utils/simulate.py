"""What-if arithmetic for a purchase not yet made. Pure Python."""

import copy

from errors import ValidationError

_STANDARD_TENURES = {6, 12, 18, 24}
_BAND_SEVERITY = {"LOW RISK": 0, "MODERATE RISK": 1, "HIGH RISK": 2}


def _profile_with_purchase(profile: dict, price_sen: int, tenure_months: int) -> dict:
    simulated = copy.deepcopy(profile)
    simulated.setdefault("commitments", []).append(
        {
            "commitment_id": None,
            "label": "Simulated purchase",
            "provider": "Simulator",
            "kind": "bnpl",
            "monthly_sen": round(price_sen / tenure_months),
            "outstanding_sen": price_sen,
            "months_left": tenure_months,
            "next_due": None,
        }
    )
    return simulated


def _verdict(before: dict, after: dict, deltas: dict) -> dict:
    if after["features"]["buffer_sen"] < 0:
        return {
            "level": "red",
            "headline": "Monthly buffer would be negative",
            "detail": "This purchase leaves monthly outflow above income.",
        }
    if _BAND_SEVERITY[after["band"]] > _BAND_SEVERITY[before["band"]]:
        return {
            "level": "red",
            "headline": "Risk band worsens",
            "detail": "This purchase moves the profile into a higher risk band.",
        }
    if deltas["score"] <= -10:
        return {
            "level": "amber",
            "headline": "Higher financial stress",
            "detail": f"This costs {abs(deltas['score'])} points.",
        }
    return {
        "level": "green",
        "headline": "Lower immediate impact",
        "detail": f"This changes the score by {deltas['score']} points.",
    }


def simulate(profile: dict, price_sen: int, tenure_months: int) -> dict:
    """Evaluate a hypothetical BNPL purchase without mutating ``profile``."""
    if price_sen <= 0:
        raise ValidationError("Purchase price must be greater than 0.", field="price_sen")
    if tenure_months < 1:
        raise ValidationError("Tenure must be at least 1 month.", field="tenure_months")

    from utils.scoring import kira_score

    monthly_sen = round(price_sen / tenure_months)
    before = kira_score(profile)
    after = kira_score(_profile_with_purchase(profile, price_sen, tenure_months))
    deltas = {
        "score": after["score"] - before["score"],
        "buffer_sen": after["features"]["buffer_sen"] - before["features"]["buffer_sen"],
        "commitment_ratio": round(
            after["features"]["commitment_ratio"] - before["features"]["commitment_ratio"], 4
        ),
        "bnpl_ratio": round(after["features"]["bnpl_ratio"] - before["features"]["bnpl_ratio"], 4),
        "dsr": round(after["features"]["dsr"] - before["features"]["dsr"], 4),
        "coverage": round(after["features"]["coverage"] - before["features"]["coverage"], 4),
    }

    alternatives = []
    for tenure in sorted(_STANDARD_TENURES - {tenure_months}):
        alternative = kira_score(_profile_with_purchase(profile, price_sen, tenure))
        alternatives.append(
            {
                "tenure_months": tenure,
                "monthly_sen": round(price_sen / tenure),
                "score": alternative["score"],
                "band": alternative["band"],
                "delta": alternative["score"] - before["score"],
            }
        )

    return {
        "monthly_sen": monthly_sen,
        "before": before,
        "after": after,
        "deltas": deltas,
        "band_changed": before["band"] != after["band"],
        "verdict": _verdict(before, after, deltas),
        "alternatives": alternatives,
    }
