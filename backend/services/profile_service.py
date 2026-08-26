"""Profile CRUD orchestration. Must never import fastapi.

See docs/API-CONTRACT.md §2. This is the only module that touches the
profiles / commitments tables.
"""


def save_profile(profile: dict) -> dict:
    """Validate, persist, return {profile_id, updated_at}.

    Cascades commitment inserts. Raises ValidationError before touching the database.
    """
    raise NotImplementedError


def load_profile(profile_id: int) -> dict:
    raise NotImplementedError


def list_profiles() -> list[dict]:
    """Return [{profile_id, label, is_demo, updated_at}, ...]."""
    raise NotImplementedError


def load_demo(name: str) -> dict:
    """name in {"aisyah", "daniel", "weijian", "farah"}, read from data/mock-data.json.

    Returns an unsaved Profile with profile_id = None.
    """
    raise NotImplementedError
