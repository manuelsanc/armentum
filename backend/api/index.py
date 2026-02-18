"""
Vercel serverless function entry point for FastAPI.
Uses Mangum as ASGI adapter for serverless environments.
"""
from mangum import Mangum
from app.main import app

# Vercel expects a handler function
handler = Mangum(app, lifespan="off")
