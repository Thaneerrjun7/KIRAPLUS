"""Shared test fixtures.

data/mock-data.json lives at the repo root, one level above backend/ -- resolved here relative to
this file so it's found regardless of CWD (both `cd backend && pytest -q`, per docs/HANDOFF.md's
documented workflow, and CI's `working-directory: backend` land on backend/ as CWD, where the bare
relative path "data/mock-data.json" does not resolve).
"""
import json
from pathlib import Path

import pytest

MOCK_DATA_PATH = Path(__file__).resolve().parent.parent.parent / "data" / "mock-data.json"


@pytest.fixture
def mock_data() -> dict:
    with open(MOCK_DATA_PATH, encoding="utf-8") as fixture_file:
        return json.load(fixture_file)


@pytest.fixture
def personas(mock_data) -> list[dict]:
    return mock_data["personas"]


@pytest.fixture
def aisyah_profile(personas) -> dict:
    aisyah = next(persona for persona in personas if persona["id"] == "aisyah")
    return {**aisyah["profile"], "commitments": aisyah["commitments"]}
