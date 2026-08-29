"""Early-warning rules. Pure Python.

Six codes, complete set (docs/API-CONTRACT.md §3):
  HIGH_BNPL      red    bnpl_ratio > 0.15
  LOW_BUFFER     red    runway_months < 1.0
  OVERCOMMITTED  red    commitment_ratio > 0.90
  THIN_SLACK     amber  buffer_ratio < 0.10
  MULTI_COMMIT   amber  n_bnpl >= 4
  MODEL_STRESS   amber  p_stress_12m > 0.50

Documented gap, deliberately not implemented: THIN_COVERAGE at coverage < 1.0
(docs/API-CONTRACT.md §3). Do not add it without flagging the contract change.
"""


def evaluate(features: dict, p_stress_12m: float | None) -> list[dict]:
    """Return warnings as {code, level, title, detail, lever}, most severe first. May be empty."""
    warnings = []
    bnpl_ratio = features.get("bnpl_ratio", 0.0)
    runway_months = features.get("runway_months", 0.0)
    commitment_ratio = features.get("commitment_ratio", 0.0)
    buffer_ratio = features.get("buffer_ratio", 0.0)
    n_bnpl = features.get("n_bnpl", 0)

    if bnpl_ratio > 0.15:
        warnings.append(
            {
                "code": "HIGH_BNPL",
                "level": "red",
                "title": "BNPL exposure is high",
                "detail": f"Your BNPL commitments are {bnpl_ratio:.0%} of income.",
                "lever": "Clearing one plan would reduce this ratio.",
            }
        )
    if runway_months < 1.0:
        warnings.append(
            {
                "code": "LOW_BUFFER",
                "level": "red",
                "title": "Emergency buffer is thin",
                "detail": f"Your savings cover {runway_months:.1f} months of spending.",
                "lever": "Reaching one month would add roughly 5 points.",
            }
        )
    if commitment_ratio > 0.90:
        warnings.append(
            {
                "code": "OVERCOMMITTED",
                "level": "red",
                "title": "Outflows exceed 90% of income",
                "detail": f"Your commitments use {commitment_ratio:.0%} of income.",
                "lever": "Reducing fixed costs or clearing a plan would free up buffer.",
            }
        )
    if buffer_ratio < 0.10:
        warnings.append(
            {
                "code": "THIN_SLACK",
                "level": "amber",
                "title": "Monthly slack is below 10%",
                "detail": f"After all obligations you keep {buffer_ratio:.0%} of income.",
                "lever": "Even a small expense reduction would widen the margin.",
            }
        )
    if n_bnpl >= 4:
        warnings.append(
            {
                "code": "MULTI_COMMIT",
                "level": "amber",
                "title": "Multiple concurrent BNPL plans",
                "detail": f"You have {n_bnpl} active BNPL commitments.",
                "lever": "Each plan beyond three costs 3 points on your score.",
            }
        )
    if p_stress_12m is not None and p_stress_12m > 0.50:
        warnings.append(
            {
                "code": "MODEL_STRESS",
                "level": "amber",
                "title": "Elevated stress probability",
                "detail": f"The model estimates a {p_stress_12m:.0%} chance of financial stress within 12 months.",
                "lever": "Building savings or reducing commitments lowers this estimate.",
            }
        )
    return warnings
