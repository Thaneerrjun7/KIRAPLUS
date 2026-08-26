"""Wraps services.simulation_service as HTTP routes. See docs/API-CONTRACT.md §4, §9."""
from fastapi import APIRouter, Body

from services import simulation_service

router = APIRouter(tags=["simulations"])


@router.post("/simulate")
def simulate(
    profile: dict = Body(...),
    price_sen: int = Body(...),
    tenure_months: int = Body(...),
) -> dict:
    return simulation_service.simulate(profile, price_sen, tenure_months)


@router.post("/simulate/grid")
def simulate_grid(
    profile: dict = Body(...),
    price_sen: int = Body(...),
) -> list[dict]:
    return simulation_service.simulate_grid(profile, price_sen)
