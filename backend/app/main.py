"""
Armentum API - Main Application
FastAPI application for coral management
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import auth
from app.routers import public
from app.routers import members
from app.routers import admin
from fastapi import Request
from fastapi.responses import JSONResponse
from app.exceptions import ArmentumException

app = FastAPI(
    title="Armentum API",
    description="API para gestión de Estudio Coral",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global exception handler for custom Armentum exceptions
@app.exception_handler(ArmentumException)
async def armentum_exception_handler(request: Request, exc: ArmentumException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message}
    )


# Health Check Endpoint
@app.get("/health", tags=["health"])
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "ok",
        "environment": settings.ENVIRONMENT,
        "version": "1.0.0"
    }


@app.get("/", tags=["root"])
async def root():
    """Root endpoint - API information"""
    return {
        "name": "Armentum API",
        "description": "API para gestión de Estudio Coral",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }


app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(public.router, prefix="/api", tags=["public"])
app.include_router(members.router, prefix="/api", tags=["members"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
# app.include_router(users.router, prefix="/api/users", tags=["users"])
# app.include_router(events.router, prefix="/api/events", tags=["events"])
# app.include_router(attendance.router, prefix="/api/attendance", tags=["attendance"])
# app.include_router(finances.router, prefix="/api/finances", tags=["finances"])
# app.include_router(communications.router, prefix="/api/communications", tags=["communications"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
