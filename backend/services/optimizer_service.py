"""The single entry point the UI calls for a payoff ordering. Must never import fastapi.

Validation here, arithmetic in utils/optimizer.py -- the same split
scoring_service/utils.scoring and projection_service/utils.projection already use.
See docs/API-CONTRACT.md §5c.
"""

from errors import ValidationError
from utils.optimizer import optimise
from utils.scoring import ENGINE_VERSION

# A million ringgit of spare cash a month is not a budgeting question, it is a
# typo. Bound it rather than simulating it.
MAX_EXTRA_SEN = 100_000_000


def optimize(profile: dict, extra_sen: int = 0) -> dict:
    """Return both payoff orderings for ``profile`` with ``extra_sen`` spare each month."""
    if not isinstance(profile, dict):
        raise ValidationError("Profile must be an object.", field="profile")

    if not isinstance(extra_sen, int) or isinstance(extra_sen, bool):
        raise ValidationError("extra_sen must be a whole number of sen.", field="extra_sen")
    if extra_sen < 0:
        raise ValidationError("extra_sen cannot be negative.", field="extra_sen")
    if extra_sen > MAX_EXTRA_SEN:
        raise ValidationError(
            f"extra_sen cannot exceed {MAX_EXTRA_SEN} sen.", field="extra_sen"
        )

    commitments = profile.get("commitments")
    if commitments is not None and not isinstance(commitments, list):
        raise ValidationError("commitments must be a list.", field="commitments")

    result = optimise(profile, extra_sen)
    result["engine_version"] = ENGINE_VERSION
    result["disclaimer"] = (
        "Both orderings are shown with their costs so you can choose. "
        "Not financial advice."
    )
    return result
