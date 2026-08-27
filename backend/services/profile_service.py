"""Profile CRUD orchestration. Must never import fastapi.

See docs/API-CONTRACT.md §2. This is the only module that touches the
profiles / commitments tables.
"""
import json
import os
import sqlite3
from datetime import datetime, timezone

from errors import ValidationError

_DEMO_NAMES = {"aisyah", "daniel", "weijian", "farah"}
_MOCK_DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "data", "mock-data.json")


def _connect() -> sqlite3.Connection:
    db_path = os.environ.get("KIRA_DB_PATH", "database/kira.db")
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def _validate(profile: dict) -> None:
    if profile["income_sen"] <= 0:
        raise ValidationError("Income must be greater than 0.", field="income_sen")
    for field in ("fixed_expenses_sen", "var_expenses_sen", "savings_sen", "loan_monthly_sen"):
        if profile.get(field, 0) < 0:
            raise ValidationError(f"{field} cannot be negative.", field=field)
    if profile["fixed_expenses_sen"] + profile["var_expenses_sen"] > 10 * profile["income_sen"]:
        raise ValidationError(
            "Expenses look implausibly high — please check.", field="fixed_expenses_sen"
        )
    for commitment in profile.get("commitments", []):
        for field in ("monthly_sen", "outstanding_sen"):
            if commitment.get(field, 0) < 0:
                raise ValidationError(f"{field} cannot be negative.", field=field)
        months_left = commitment.get("months_left", 0)
        if not (0 <= months_left <= 120):
            raise ValidationError(
                "Tenure must be between 0 and 120 months.", field="months_left"
            )


def save_profile(profile: dict) -> dict:
    """Validate, persist, return {profile_id, updated_at}.

    Upserts: an incoming profile_id updates that profile in place (replacing its commitments
    wholesale), profile_id=None inserts a new one. Raises ValidationError before touching the
    database, and if an incoming profile_id doesn't exist.
    """
    _validate(profile)
    now = datetime.now(timezone.utc).isoformat()
    conn = _connect()
    try:
        profile_id = profile.get("profile_id")
        if profile_id is None:
            cur = conn.execute(
                """INSERT INTO profiles
                   (label, income_sen, fixed_expenses_sen, var_expenses_sen, savings_sen,
                    loan_monthly_sen, is_demo, updated_at)
                   VALUES (?, ?, ?, ?, ?, ?, 0, ?)""",
                (
                    profile.get("label", ""),
                    profile["income_sen"],
                    profile["fixed_expenses_sen"],
                    profile["var_expenses_sen"],
                    profile["savings_sen"],
                    profile.get("loan_monthly_sen", 0),
                    now,
                ),
            )
            profile_id = cur.lastrowid
        else:
            cur = conn.execute(
                """UPDATE profiles
                   SET label = ?, income_sen = ?, fixed_expenses_sen = ?, var_expenses_sen = ?,
                       savings_sen = ?, loan_monthly_sen = ?, updated_at = ?
                   WHERE profile_id = ?""",
                (
                    profile.get("label", ""),
                    profile["income_sen"],
                    profile["fixed_expenses_sen"],
                    profile["var_expenses_sen"],
                    profile["savings_sen"],
                    profile.get("loan_monthly_sen", 0),
                    now,
                    profile_id,
                ),
            )
            if cur.rowcount == 0:
                raise ValidationError(f"Profile {profile_id} not found.", field="profile_id")
            conn.execute("DELETE FROM commitments WHERE profile_id = ?", (profile_id,))
        for commitment in profile.get("commitments", []):
            conn.execute(
                """INSERT INTO commitments
                   (profile_id, label, provider, kind, monthly_sen, outstanding_sen,
                    months_left, next_due)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    profile_id,
                    commitment["label"],
                    commitment.get("provider", ""),
                    commitment["kind"],
                    commitment["monthly_sen"],
                    commitment.get("outstanding_sen", 0),
                    commitment.get("months_left", 0),
                    commitment.get("next_due"),
                ),
            )
        conn.commit()
        return {"profile_id": profile_id, "updated_at": now}
    finally:
        conn.close()


def load_profile(profile_id: int) -> dict:
    conn = _connect()
    try:
        row = conn.execute(
            "SELECT * FROM profiles WHERE profile_id = ?", (profile_id,)
        ).fetchone()
        if row is None:
            raise ValidationError(f"Profile {profile_id} not found.", field="profile_id")
        commitments = conn.execute(
            "SELECT * FROM commitments WHERE profile_id = ?", (profile_id,)
        ).fetchall()
        return _row_to_profile(row, commitments)
    finally:
        conn.close()


def list_profiles() -> list[dict]:
    """Return [{profile_id, label, is_demo, updated_at}, ...]."""
    conn = _connect()
    try:
        rows = conn.execute(
            "SELECT profile_id, label, is_demo, updated_at FROM profiles ORDER BY updated_at DESC"
        ).fetchall()
        return [
            {
                "profile_id": row["profile_id"],
                "label": row["label"],
                "is_demo": bool(row["is_demo"]),
                "updated_at": row["updated_at"],
            }
            for row in rows
        ]
    finally:
        conn.close()


def load_demo(name: str) -> dict:
    """name in {"aisyah", "daniel", "weijian", "farah"}, read from data/mock-data.json.

    Returns an unsaved Profile with profile_id = None.
    """
    if name not in _DEMO_NAMES:
        raise ValidationError(f"Unknown demo persona: {name}.", field="name")
    with open(_MOCK_DATA_PATH, "r", encoding="utf-8") as f:
        mock_data = json.load(f)
    persona = next(p for p in mock_data["personas"] if p["id"] == name)
    profile = dict(persona["profile"])
    profile["profile_id"] = None
    profile["label"] = persona["label"]
    profile["commitments"] = persona["commitments"]
    return profile


def _row_to_profile(row: sqlite3.Row, commitments: list[sqlite3.Row]) -> dict:
    return {
        "profile_id": row["profile_id"],
        "label": row["label"],
        "income_sen": row["income_sen"],
        "fixed_expenses_sen": row["fixed_expenses_sen"],
        "var_expenses_sen": row["var_expenses_sen"],
        "savings_sen": row["savings_sen"],
        "loan_monthly_sen": row["loan_monthly_sen"],
        "commitments": [
            {
                "commitment_id": c["commitment_id"],
                "label": c["label"],
                "provider": c["provider"],
                "kind": c["kind"],
                "monthly_sen": c["monthly_sen"],
                "outstanding_sen": c["outstanding_sen"],
                "months_left": c["months_left"],
                "next_due": c["next_due"],
            }
            for c in commitments
        ],
    }
