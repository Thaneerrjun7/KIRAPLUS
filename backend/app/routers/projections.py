"""Wraps services.projection_service as an HTTP route. See docs/API-CONTRACT.md §5b, §9."""
from fastapi import APIRouter, Body

from services import projection_service
from utils.projection import DEFAULT_HORIZON_MONTHS

router = APIRouter(tags=["projections"])


@router.post("/project")
def project(
    profile: dict = Body(...),
    months: int = Body(DEFAULT_HORIZON_MONTHS),
) -> dict:
    return projection_service.projection(profile, months)
