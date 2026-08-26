"""Before/after simulation for a hypothetical purchase. Must never import streamlit.

See docs/API-CONTRACT.md §4.
"""


def simulate(profile: dict, price_sen: int, tenure_months: int) -> dict:
    """Return the Simulation dict: monthly_sen, before, after, deltas,
    band_changed, verdict, alternatives.
    """
    raise NotImplementedError
