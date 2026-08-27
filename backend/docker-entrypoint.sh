#!/bin/sh
set -e

# database/init_db.py has no DROP/IF-NOT-EXISTS guard -- it raises
# sqlite3.OperationalError on a table that already exists, so only run it the
# first time this volume is empty. Safe to re-run this entrypoint on every
# container start/redeploy without wiping or crashing an existing DB.
if [ ! -f "$KIRA_DB_PATH" ]; then
  python database/init_db.py
fi

exec uvicorn app.main:app --host 0.0.0.0 --port 8000
