#!/bin/bash
# Railway start script - runs migrations then starts server

set -e

echo "Running database migrations..."
cd /app
alembic upgrade head || echo "Migrations already applied or alembic not needed"

echo "Starting server..."
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
