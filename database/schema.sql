-- KIRA+ schema. All monetary columns are INTEGER sen per docs/API-CONTRACT.md §0.
-- No migrations: init_db.py drops and recreates. No production data exists.

CREATE TABLE profiles (
    profile_id         INTEGER PRIMARY KEY AUTOINCREMENT,
    label              TEXT    NOT NULL,
    income_sen         INTEGER NOT NULL CHECK (income_sen > 0),
    fixed_expenses_sen INTEGER NOT NULL CHECK (fixed_expenses_sen >= 0),
    var_expenses_sen   INTEGER NOT NULL CHECK (var_expenses_sen >= 0),
    savings_sen        INTEGER NOT NULL CHECK (savings_sen >= 0),
    loan_monthly_sen   INTEGER NOT NULL DEFAULT 0 CHECK (loan_monthly_sen >= 0),
    is_demo            INTEGER NOT NULL DEFAULT 0,
    created_at         TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at         TEXT    NOT NULL DEFAULT (datetime('now')),
    CHECK (fixed_expenses_sen + var_expenses_sen <= 10 * income_sen)
);

CREATE TABLE commitments (
    commitment_id  INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id     INTEGER NOT NULL REFERENCES profiles(profile_id) ON DELETE CASCADE,
    label          TEXT    NOT NULL,
    provider       TEXT    NOT NULL DEFAULT '',
    kind           TEXT    NOT NULL CHECK (kind IN ('bnpl','loan','card','other')),
    monthly_sen    INTEGER NOT NULL CHECK (monthly_sen >= 0),
    outstanding_sen INTEGER NOT NULL DEFAULT 0 CHECK (outstanding_sen >= 0),
    months_left    INTEGER NOT NULL DEFAULT 0 CHECK (months_left BETWEEN 0 AND 120),
    next_due       TEXT
);

CREATE TABLE assessments (
    assessment_id  INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id     INTEGER NOT NULL REFERENCES profiles(profile_id) ON DELETE CASCADE,
    score          INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
    band           TEXT    NOT NULL,
    features_json  TEXT    NOT NULL,
    subscores_json TEXT    NOT NULL,
    p_stress       REAL,
    engine_version TEXT    NOT NULL,
    created_at     TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE simulations (
    simulation_id  INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id     INTEGER NOT NULL REFERENCES profiles(profile_id) ON DELETE CASCADE,
    price_sen      INTEGER NOT NULL CHECK (price_sen > 0),
    tenure_months  INTEGER NOT NULL CHECK (tenure_months >= 1),
    score_before   INTEGER NOT NULL,
    score_after    INTEGER NOT NULL,
    created_at     TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_commitments_profile ON commitments(profile_id);
CREATE INDEX idx_assessments_profile ON assessments(profile_id, created_at DESC);
