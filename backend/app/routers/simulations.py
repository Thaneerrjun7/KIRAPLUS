"""Wraps services.simulation_service.simulate as an HTTP route. See docs/API-CONTRACT.md §4."""
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
