"""
Vercel serverless function - ultra simple version for debugging
"""

def handler(event, context):
    """Minimal handler"""
    import json
    
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps({
            "status": "ok",
            "message": "Hello from Armentum API",
            "path": event.get("path", "unknown")
        })
    }
