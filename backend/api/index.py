"""
Vercel/Railway serverless function entry point for FastAPI.
Uses Mangum as ASGI adapter for serverless environments.
"""
from mangum import Mangum
from app.main import app

# Handler for serverless environments
handler = Mangum(app, lifespan="off")
