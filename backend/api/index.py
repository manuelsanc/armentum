"""
Vercel serverless function entry point for FastAPI.
This file is required for Vercel to run FastAPI as a serverless function.
"""
from app.main import app

# Vercel expects a handler function
handler = app
