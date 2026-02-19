"""
Vercel serverless function entry point for FastAPI.
Uses Mangum as ASGI adapter for serverless environments.
"""

# Simple health check first
def handler(event, context):
    """Minimal handler for debugging"""
    import json
    
    # Handle health check without loading full app
    path = event.get("path", event.get("rawPath", "/"))
    
    if path in ["/health", "/api/health"]:
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"status": "ok", "environment": "production", "version": "1.0.0"})
        }
    
    if path in ["/", ""]:
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"name": "Armentum API", "version": "1.0.0"})
        }
    
    # For all other routes, load the full app
    from mangum import Mangum
    from app.main import app
    
    asgi_handler = Mangum(app, lifespan="off")
    return asgi_handler(event, context)
