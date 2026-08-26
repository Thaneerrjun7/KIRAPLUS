"""Wraps services.llm_service.explain as an HTTP route. See docs/API-CONTRACT.md §5."""
from fastapi import APIRouter

from services import llm_service

router = APIRouter(tags=["explanations"])


@router.post("/explain")
def explain(payload: dict) -> dict:
    text, source = llm_service.explain(payload)
    return {"text": text, "source": source}
