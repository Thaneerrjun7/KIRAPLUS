"""What-if arithmetic for a purchase not yet made. Pure Python.

See docs/API-CONTRACT.md §4. monthly_sen = round(price_sen / tenure_months).
Raises ValidationError if price_sen <= 0 or tenure_months < 1 -- do not clamp
silently. alternatives always covers {6, 12, 18, 24} minus the requested tenure.
"""


def simulate(profile: dict, price_sen: int, tenure_months: int) -> dict:
    """Return monthly_sen, before, after, deltas, band_changed, verdict, alternatives."""
    raise NotImplementedError
