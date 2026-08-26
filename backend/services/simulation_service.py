"""Before/after simulation for a hypothetical purchase. Must never import fastapi.

See docs/API-CONTRACT.md §4, §9.
"""


def simulate(profile: dict, price_sen: int, tenure_months: int) -> dict:
    """Return the Simulation dict: monthly_sen, before, after, deltas,
    band_changed, verdict, alternatives.
    """
    raise NotImplementedError


def simulate_grid(profile: dict, price_sen: int) -> list[dict]:
    """Run simulate() for tenure_months 1..36, return the reduced fields per tenure.

    Lets the frontend fetch once and read grid[tenure - 1] locally while the
    tenure slider is dragged, instead of one request per slider position. Same
    maths as simulate(), just batched -- see docs/API-CONTRACT.md §9.

    Returns [{"tenure_months", "monthly_sen", "score", "band", "delta"}, ...].
    """
    raise NotImplementedError
