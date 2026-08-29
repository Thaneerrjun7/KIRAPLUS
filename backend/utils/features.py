"""Feature derivation. Pure Python, zero third-party imports, no I/O.

See docs/API-CONTRACT.md §1 and docs/MASTER-PACKAGE.md Part II §10 for the
11 derived features and their exact definitions.
"""


def derive(profile: dict) -> dict:
    """Derive debt, outflow, buffer_sen, dsr, bnpl_ratio, buffer_ratio,
    runway_months, coverage, savings_months, commitment_ratio, n_bnpl.

    All monetary inputs and outputs are integer sen.
    """
    income = profile["income_sen"]
    fixed = profile["fixed_expenses_sen"]
    var = profile["var_expenses_sen"]
    savings = profile["savings_sen"]
    commitments = profile.get("commitments", [])

    # Derived from commitments list — never stored fields (API-CONTRACT §1)
    bnpl_monthly_sen = sum(
        c["monthly_sen"] for c in commitments if c["kind"] == "bnpl"
    )
    n_bnpl = len([c for c in commitments if c["kind"] == "bnpl"])

    # Total monthly debt service = sum of ALL commitment monthly payments
    debt_sen = sum(c["monthly_sen"] for c in commitments)

    # Total monthly outflow
    outflow_sen = fixed + var + debt_sen

    # Monthly buffer (what's left after everything is paid)
    buffer_sen = income - outflow_sen

    # Ratios — guard against division by zero
    dsr = debt_sen / income if income > 0 else 0.0
    bnpl_ratio = bnpl_monthly_sen / income if income > 0 else 0.0
    buffer_ratio = buffer_sen / income if income > 0 else 0.0
    runway_months = savings / outflow_sen if outflow_sen > 0 else 0.0
    # A debt-free profile has no repayment shortfall. Use the documented
    # sentinel so the capped repayment-capacity subscore is the full 100.
    coverage = buffer_sen / debt_sen if debt_sen > 0 else 99.0
    savings_months = savings / income if income > 0 else 0.0
    commitment_ratio = outflow_sen / income if income > 0 else 0.0

    return {
        "debt_sen": debt_sen,
        "outflow_sen": outflow_sen,
        "buffer_sen": buffer_sen,
        "dsr": round(dsr, 4),
        "bnpl_ratio": round(bnpl_ratio, 4),
        "buffer_ratio": round(buffer_ratio, 4),
        "runway_months": round(runway_months, 4),
        "coverage": round(coverage, 4),
        "savings_months": round(savings_months, 4),
        "commitment_ratio": round(commitment_ratio, 4),
        "bnpl_monthly_sen": bnpl_monthly_sen,
        "n_bnpl": n_bnpl,
    }
