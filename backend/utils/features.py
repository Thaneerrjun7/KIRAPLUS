"""Feature derivation. Pure Python, zero third-party imports, no I/O.

See docs/API-CONTRACT.md §1 and docs/MASTER-PACKAGE.md Part II §10 for the
11 derived features and their exact definitions.
"""


def derive(profile: dict) -> dict:
    """Derive debt, outflow, buffer_sen, dsr, bnpl_ratio, buffer_ratio,
    runway_months, coverage, savings_months, commitment_ratio, n_bnpl.

    All monetary inputs and outputs are integer sen.
    """
    raise NotImplementedError
