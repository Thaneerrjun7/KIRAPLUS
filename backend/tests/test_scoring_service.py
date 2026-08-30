"""Assessment orchestration for the Dashboard API contract."""

from services.scoring_service import assess


def test_assess_returns_the_complete_aisyah_dashboard_payload_without_a_model(aisyah_profile):
    result = assess(aisyah_profile)

    assert result["score"] == 68
    assert result["band"] == "MODERATE RISK"
    assert [warning["code"] for warning in result["warnings"]] == ["LOW_BUFFER"]
    assert result["p_stress_12m"] is None
    assert result["engine_version"] == "1.0.0"
    assert result["disclaimer"] == "Assessment based on user-provided data. Not financial advice."
