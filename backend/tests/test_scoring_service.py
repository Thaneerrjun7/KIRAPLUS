"""Assessment orchestration for the Dashboard API contract."""

import json

from services.scoring_service import assess


def test_assess_returns_the_complete_aisyah_dashboard_payload_without_a_model():
    with open("data/mock-data.json", encoding="utf-8") as fixture_file:
        aisyah = next(
            persona for persona in json.load(fixture_file)["personas"]
            if persona["id"] == "aisyah"
        )

    result = assess({**aisyah["profile"], "commitments": aisyah["commitments"]})

    assert result["score"] == 68
    assert result["band"] == "MODERATE RISK"
    assert [warning["code"] for warning in result["warnings"]] == ["LOW_BUFFER"]
    assert result["p_stress_12m"] is None
    assert result["engine_version"] == "1.0.0"
    assert result["disclaimer"] == "Assessment based on user-provided data. Not financial advice."
