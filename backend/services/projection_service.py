"""The single entry point the UI calls for a trajectory. Must never import fastapi.

Thin on purpose: validation lives here, arithmetic lives in utils/projection.py,
exactly as scoring_service sits on utils/scoring. See docs/API-CONTRACT.md §5b.
"""

from errors import ValidationError
from utils.projection import DEFAULT_HORIZON_MONTHS, MAX_HORIZON_MONTHS, project
from utils.scoring import ENGINE_VERSION

_REQUIRED_FIELDS = ("income_sen", "fixed_expenses_sen", "var_expenses_sen", "savings_sen")


def projection(profile: dict, months: int = DEFAULT_HORIZON_MONTHS) -> dict:
    """Return the Projection dict for ``profile`` over ``months`` months."""
    if not isinstance(profile, dict):
        raise ValidationError("Profile must be an object.", field="profile")

    for field in _REQUIRED_FIELDS:
        if field not in profile:
            raise ValidationError(f"Missing required field: {field}.", field=field)

    if not isinstance(months, int) or isinstance(months, bool):
        raise ValidationError("months must be a whole number.", field="months")
    if months < 1 or months > MAX_HORIZON_MONTHS:
        raise ValidationError(
            f"months must be between 1 and {MAX_HORIZON_MONTHS}.", field="months"
        )

    result = project(profile, months)
    result["engine_version"] = ENGINE_VERSION
    result["disclaimer"] = (
        "Projection based on user-provided data and the commitments you already "
        "have. Not financial advice."
    )
    return result
