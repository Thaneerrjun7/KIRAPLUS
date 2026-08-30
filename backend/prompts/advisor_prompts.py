"""Prompt templates for the Stage 7 AI Financial Assistant.

The model is a *narrator*, never a calculator and never an adviser. Everything
numeric it is allowed to say has already been computed by utils/scoring.py and
handed to it in the payload; utils/guard.py enforces that afterwards, so this
file is the polite request and the guard is the lock on the door.

Tone rules come from docs/HANDOFF.md §17: consequence, not judgement.
"""

BANNED_PHRASES = (
    "you cannot afford",
    "you can't afford",
    "you should",
    "we recommend",
    "i recommend",
    "bad decision",
    "you must",
)

SYSTEM_PROMPT = """You are KIRA+, a financial-health explainer for Malaysian consumers.

Your only job is to restate an assessment that has ALREADY been calculated, in plain,
warm, everyday English a 25-year-old Malaysian would find easy to read.

Absolute rules:
1. NEVER perform arithmetic. Never add, subtract, divide, average or round anything.
   Every number you write must appear verbatim in the data given to you. If a number
   is not in the data, do not write it -- describe it in words instead.
2. NEVER give advice, recommendations, instructions or verdicts. State consequences
   only. Say what the figures mean, not what the reader ought to do.
3. NEVER use these phrases: "you cannot afford", "you should", "we recommend",
   "bad decision", "you must".
4. NEVER mention credit scores, CTOS, CCRIS, loan approval or credit eligibility.
   KIRA+ does not predict them.
5. Use Malaysian framing: ringgit as RM, months as months, BNPL as BNPL.
6. Write 3 to 5 sentences. No headings, no bullet points, no markdown, no emoji.
7. End with the sentence: "This is not financial advice."

You are describing the reader's own figures back to them so they can decide for
themselves. That is the entire product."""


def _fmt_factor(factor: dict) -> str:
    name = factor.get("name", "factor")
    sub = factor.get("sub")
    weight = factor.get("weight")
    contribution = factor.get("contribution")
    return f"- {name}: sub-score {sub}, weight {weight}, contributes {contribution}"


def build_user_prompt(payload: dict) -> str:
    """Render the payload as a flat, unambiguous block of facts.

    Deliberately not JSON: a prose-ish block keeps the model from echoing raw
    keys, and keeps every figure on its own labelled line so a truncated
    response can still be checked numeral-by-numeral by utils.guard.
    """
    lines = ["Here is the assessment. Explain it. Use only these numbers.", ""]

    if "score" in payload:
        lines.append(f"KIRA Score: {payload['score']} out of 100")
    if "band" in payload:
        lines.append(f"Risk band: {payload['band']}")
    if "score_after" in payload:
        lines.append(f"Score if this purchase goes ahead: {payload['score_after']}")
    if "band_after" in payload:
        lines.append(f"Risk band after: {payload['band_after']}")

    features = payload.get("features") or {}
    if features:
        lines.append("")
        lines.append("Monthly figures:")
        if "buffer_sen" in features:
            lines.append(f"- money left after every obligation: {features['buffer_sen']} sen")
        if "dsr" in features:
            lines.append(f"- share of income going to debt repayment: {features['dsr']}")
        if "runway_months" in features:
            lines.append(f"- months of expenses savings would cover: {features['runway_months']}")
        if "n_bnpl" in features:
            lines.append(f"- active BNPL plans: {features['n_bnpl']}")

    for key, label in (
        ("buffer_before_sen", "money left each month now"),
        ("buffer_after_sen", "money left each month after the purchase"),
    ):
        if key in payload:
            lines.append(f"- {label}: {payload[key]} sen")

    purchase = payload.get("purchase") or {}
    if purchase:
        lines.append("")
        lines.append("The purchase being considered:")
        for key, label in (
            ("price_sen", "price"),
            ("tenure_months", "instalment months"),
            ("monthly_sen", "monthly instalment"),
        ):
            if key in purchase:
                lines.append(f"- {label}: {purchase[key]}")

    factors = payload.get("factors") or []
    if factors:
        lines.append("")
        lines.append("Score factors, biggest first:")
        lines.extend(_fmt_factor(factor) for factor in factors)

    warnings = payload.get("warnings") or []
    if warnings:
        lines.append("")
        lines.append("Warnings that fired:")
        for warning in warnings:
            if isinstance(warning, dict):
                lines.append(f"- [{warning.get('level', 'amber')}] {warning.get('title', '')}")
            else:
                lines.append(f"- {warning}")

    return "\n".join(lines)
