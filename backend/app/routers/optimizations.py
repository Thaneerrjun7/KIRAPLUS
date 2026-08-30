"""Wraps services.optimizer_service as an HTTP route. See docs/API-CONTRACT.md §5c, §9."""
from fastapi import APIRouter, Body

from services import optimizer_service

router = APIRouter(tags=["optimizations"])


@router.post("/optimize")
def optimize(
    profile: dict = Body(...),
    extra_sen: int = Body(0),
) -> dict:
    return optimizer_service.optimize(profile, extra_sen)
