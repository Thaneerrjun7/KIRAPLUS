"""Wraps services.profile_service as HTTP routes. See docs/API-CONTRACT.md §2."""
from fastapi import APIRouter

from services import profile_service

router = APIRouter(prefix="/profiles", tags=["profiles"])


@router.post("")
def save_profile(profile: dict) -> dict:
    return profile_service.save_profile(profile)


@router.get("/{profile_id}")
def load_profile(profile_id: int) -> dict:
    return profile_service.load_profile(profile_id)


@router.get("")
def list_profiles() -> list[dict]:
    return profile_service.list_profiles()


@router.get("/demo/{name}")
def load_demo(name: str) -> dict:
    return profile_service.load_demo(name)
