"""KIRA Score engine. Pure Python, zero third-party imports.

This module must never import a web framework (fastapi or otherwise) -- if
it does, the engine can no longer be tested without launching the app.

Weights, anchors and the penalty formula are specified in
docs/MASTER-PACKAGE.md Part II §12 and docs/API-CONTRACT.md §3. Persona
fixtures (docs/API-CONTRACT.md §7, data/mock-data.json): aisyah=68,
daniel=94, weijian=41, farah=17.
"""

ENGINE_VERSION = "1.0.0"

# Six-factor weights and linear interpolation anchors.
# Each tuple: (factor_name, weight, feature_key, zero_at, full_at, inverse)
#   inverse=True  → lower feature value is better (e.g. debt ratio)
#   inverse=False → higher feature value is better (e.g. buffer ratio)
FACTORS = [
    ("debt_burden",        25, "dsr",            0.45, 0.05, True),
    ("bnpl_exposure",      20, "bnpl_ratio",     0.20, 0.02, True),
    ("disposable_income",  20, "buffer_ratio",   0.00, 0.30, False),
    ("emergency_buffer",   15, "runway_months",  0.00, 6.00, False),
    ("repayment_capacity", 12, "coverage",       0.00, 2.00, False),
    ("savings_resilience",  8, "savings_months",  0.00, 3.00, False),
]

# BNPL stacking penalty: 3 points per active BNPL plan beyond the third.
PENALTY_PER_EXCESS_BNPL = 3.0
PENALTY_BNPL_THRESHOLD = 3

# Band boundaries (score is an integer 0-100).
_LOW_RISK_MIN = 70
_MODERATE_RISK_MIN = 45


def band(score: int) -> str:
    """LOW RISK if score >= 70, MODERATE RISK if 45 <= score < 70, else HIGH RISK."""
    if score >= _LOW_RISK_MIN:
        return "LOW RISK"
    if score >= _MODERATE_RISK_MIN:
        return "MODERATE RISK"
    return "HIGH RISK"


def _subscore(value: float, zero_at: float, full_at: float, inverse: bool) -> float:
    """Linear interpolation clamped to [0, 100], rounded to 2dp.

    For inverse factors (lower is better): subscore = (zero_at - value) / (zero_at - full_at)
    For direct factors (higher is better): subscore = (value - zero_at) / (full_at - zero_at)
    """
    if inverse:
        denom = zero_at - full_at
        raw = (zero_at - value) / denom if denom != 0 else 0.0
    else:
        denom = full_at - zero_at
        raw = (value - zero_at) / denom if denom != 0 else 0.0
    clamped = max(0.0, min(1.0, raw))
    return round(clamped * 100, 2)


def kira_score(profile: dict) -> dict:
    """Return {score, band, features, subscores, contributions, penalty}.

    Calls features.derive() internally to get the 11 derived features,
    then computes subscores via linear interpolation, weighted contributions,
    BNPL stacking penalty, and final integer score.
    """
    from utils.features import derive

    feats = derive(profile)

    # Use full-precision feature values for subscore computation.
    # Recompute ratios without rounding to avoid 4dp truncation error.
    income = profile["income_sen"]
    fixed = profile["fixed_expenses_sen"]
    var = profile["var_expenses_sen"]
    savings = profile["savings_sen"]
    commitments = profile.get("commitments", [])

    bnpl_monthly = sum(c["monthly_sen"] for c in commitments if c["kind"] == "bnpl")
    n_bnpl = len([c for c in commitments if c["kind"] == "bnpl"])
    debt = sum(c["monthly_sen"] for c in commitments)
    outflow = fixed + var + debt
    buffer = income - outflow

    # Full-precision ratios for subscore computation
    precise = {
        "dsr": debt / income if income > 0 else 0.0,
        "bnpl_ratio": bnpl_monthly / income if income > 0 else 0.0,
        "buffer_ratio": buffer / income if income > 0 else 0.0,
        "runway_months": savings / outflow if outflow > 0 else 0.0,
        # No current debt means repayment capacity is fully satisfied.
        "coverage": buffer / debt if debt > 0 else 99.0,
        "savings_months": savings / income if income > 0 else 0.0,
    }

    subscores = {}
    contributions = {}
    weighted_total = 0.0

    for name, weight, fkey, zero_at, full_at, inverse in FACTORS:
        val = precise[fkey]
        sub = _subscore(val, zero_at, full_at, inverse)
        contrib = weight * sub / 100
        subscores[name] = sub
        contributions[name] = round(contrib, 2)
        weighted_total += contrib

    # BNPL stacking penalty
    penalty = PENALTY_PER_EXCESS_BNPL * max(0, n_bnpl - PENALTY_BNPL_THRESHOLD)

    # Final score: round to nearest integer, clamp to [0, 100]
    raw_score = weighted_total - penalty
    final_score = max(0, min(100, round(raw_score)))

    return {
        "score": final_score,
        "band": band(final_score),
        "penalty": penalty,
        "features": feats,
        "subscores": subscores,
        "contributions": contributions,
        "engine_version": ENGINE_VERSION,
    }
