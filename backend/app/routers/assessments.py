"""Wraps services.scoring_service.assess as an HTTP route. See docs/API-CONTRACT.md §3."""
from fastapi import APIRouter

from services import scoring_service

router = APIRouter(tags=["assessments"])


@router.post("/assess")
def assess(profile: dict) -> dict:
    return scoring_service.assess(profile)
