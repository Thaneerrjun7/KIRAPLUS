"""The only sen<->ringgit conversion point in the codebase. See docs/API-CONTRACT.md §0.

Nothing outside the presentation layer may call these.
"""


def fmt_rm(sen: int) -> str:
    """95000 -> "RM950\""""
    return f"RM{sen // 100}"


def fmt_rm_cents(sen: int) -> str:
    """95000 -> "RM950.00\""""
    return f"RM{sen / 100:.2f}"


def to_sen(ringgit: float) -> int:
    """950.0 -> 95000, banker-safe."""
    return round(ringgit * 100)
