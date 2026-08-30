"""T-09 -- warning triggers (docs/API-CONTRACT.md §3, §7)."""

from utils.scoring import kira_score
from utils.warnings import evaluate


def test_fixture_warning_codes_match_the_frozen_personas(personas):
    for persona in personas:
        profile = {**persona["profile"], "commitments": persona["commitments"]}
        warnings = evaluate(kira_score(profile)["features"], p_stress_12m=None)

        assert [warning["code"] for warning in warnings] == persona["expected"]["warning_codes"]


def test_warning_order_is_red_before_amber_and_model_stress_is_last():
    warnings = evaluate(
        {
            "bnpl_ratio": 0.16,
            "runway_months": 0.5,
            "commitment_ratio": 0.91,
            "buffer_ratio": 0.09,
            "n_bnpl": 4,
        },
        p_stress_12m=0.51,
    )

    assert [warning["code"] for warning in warnings] == [
        "HIGH_BNPL",
        "LOW_BUFFER",
        "OVERCOMMITTED",
        "THIN_SLACK",
        "MULTI_COMMIT",
        "MODEL_STRESS",
    ]
