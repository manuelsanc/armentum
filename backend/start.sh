#!/bin/bash
# Render start script - runs migrations then starts server

set -e

echo "Running database migrations..."
alembic upgrade head || echo "Migrations already applied or not needed"

echo "Starting server..."
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
