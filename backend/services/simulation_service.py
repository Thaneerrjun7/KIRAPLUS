"""Before/after simulation for a hypothetical purchase. Must never import fastapi."""

from utils.simulate import simulate as _simulate


def simulate(profile: dict, price_sen: int, tenure_months: int) -> dict:
    """Return the contract's full Simulation response."""
    return _simulate(profile, price_sen, tenure_months)


def simulate_grid(profile: dict, price_sen: int) -> list[dict]:
    """Build the slider's compact 1–36 tenure grid in one operation."""
    return [
        {
            "tenure_months": tenure_months,
            "monthly_sen": result["monthly_sen"],
            "score": result["after"]["score"],
            "band": result["after"]["band"],
            "delta": result["deltas"]["score"],
        }
        for tenure_months in range(1, 37)
        for result in [_simulate(profile, price_sen, tenure_months)]
    ]
