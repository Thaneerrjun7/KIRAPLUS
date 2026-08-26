"""Early-warning rules. Pure Python.

Six codes, complete set (docs/API-CONTRACT.md §3):
  HIGH_BNPL      red    bnpl_ratio > 0.15
  LOW_BUFFER     red    runway_months < 1.0
  OVERCOMMITTED  red    commitment_ratio > 0.90
  THIN_SLACK     amber  buffer_ratio < 0.10
  MULTI_COMMIT   amber  n_bnpl >= 4
  MODEL_STRESS   amber  p_stress_12m > 0.50

Documented gap, deliberately not implemented: THIN_COVERAGE at coverage < 1.0
(docs/API-CONTRACT.md §3). Do not add it without flagging the contract change.
"""


def evaluate(features: dict, p_stress_12m: float | None) -> list[dict]:
    """Return warnings as {code, level, title, detail, lever}, most severe first. May be empty."""
    raise NotImplementedError
