# KIRA+ backend image. Built by .github/workflows/deploy-backend.yml, pushed to GHCR,
# pulled and run on the deploy target -- never built or cloned there. See
# DEPLOYMENT-CHECKLIST.md (untracked, local) for the full pipeline.
#
# Build context is the REPO ROOT (`docker build -f backend/Dockerfile .`), not backend/ --
# services/profile_service.py resolves data/mock-data.json two directories above itself,
# so the fixture file has to be copied in from outside backend/ too.
FROM python:3.12-slim

WORKDIR /app

COPY backend/requirements.txt backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY backend/app/ backend/app/
COPY backend/services/ backend/services/
COPY backend/utils/ backend/utils/
COPY backend/models/ backend/models/
COPY backend/database/ backend/database/
COPY backend/prompts/ backend/prompts/
COPY backend/errors.py backend/errors.py
COPY backend/docker-entrypoint.sh backend/docker-entrypoint.sh

# Mirrors the repo layout (data/ as a sibling of backend/) so
# services/profile_service.py's `../../data/mock-data.json` resolves exactly
# as it does outside Docker, with no path changes to application code.
COPY data/ data/

WORKDIR /app/backend
RUN chmod +x docker-entrypoint.sh

# KIRA_DB_PATH (set at `docker run` time) points into a volume mounted here.
# Deliberately NOT /app/data -- that's the baked-in fixture dir above, and a
# volume mounted over it would shadow mock-data.json at runtime.
RUN mkdir -p /data

EXPOSE 8000
ENTRYPOINT ["./docker-entrypoint.sh"]
