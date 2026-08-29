"""T-08 -- simulator correctness (docs/API-CONTRACT.md §4, §7)."""

import pytest

from errors import ValidationError
from services.simulation_service import simulate, simulate_grid


def test_simulate_matches_the_frozen_aisyah_phone_fixture(aisyah_profile):
    result = simulate(aisyah_profile, price_sen=240_000, tenure_months=12)

    assert result["monthly_sen"] == 20_000
    assert result["before"]["score"] == 68
    assert result["after"]["score"] == 54
    assert result["deltas"]["score"] == -14
    assert result["deltas"]["buffer_sen"] == -20_000
    assert result["band_changed"] is False
    assert result["verdict"]["level"] == "amber"
    assert {item["tenure_months"] for item in result["alternatives"]} == {6, 18, 24}


def test_simulate_rejects_non_positive_price_and_tenure(aisyah_profile):
    with pytest.raises(ValidationError):
        simulate(aisyah_profile, price_sen=0, tenure_months=12)
    with pytest.raises(ValidationError):
        simulate(aisyah_profile, price_sen=240_000, tenure_months=0)


def test_simulate_grid_returns_all_slider_tenures(aisyah_profile):
    grid = simulate_grid(aisyah_profile, price_sen=240_000)

    assert len(grid) == 36
    assert grid[11]["tenure_months"] == 12
    assert grid[11]["score"] == 54
