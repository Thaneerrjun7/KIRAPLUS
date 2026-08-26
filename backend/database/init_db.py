"""Create (dropping and recreating) the KIRA+ SQLite database from schema.sql.

No migrations -- no production data exists. See docs/MASTER-PACKAGE.md Part II §8.
"""
import os
import sqlite3

SCHEMA_PATH = os.path.join(os.path.dirname(__file__), "schema.sql")
DB_PATH = os.environ.get("KIRA_DB_PATH", os.path.join(os.path.dirname(__file__), "kira.db"))


def init_db(db_path: str = DB_PATH, schema_path: str = SCHEMA_PATH) -> None:
    with open(schema_path, "r", encoding="utf-8") as f:
        schema = f.read()
    conn = sqlite3.connect(db_path)
    try:
        conn.executescript(schema)
        conn.commit()
    finally:
        conn.close()


if __name__ == "__main__":
    init_db()
    print(f"Initialised {DB_PATH}")
