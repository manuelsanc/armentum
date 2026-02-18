"""
Database utilities for Supabase integration.
Provides Supabase client and health check functions.
"""

from typing import Optional
from app.config import settings


_supabase_client: Optional[object] = None


def get_supabase_client():
    """
    Get or create a Supabase client instance.
    Uses the service role key for backend admin operations.
    
    Returns:
        Supabase client instance or None if not configured
    
    Usage:
        client = get_supabase_client()
        if client:
            result = client.auth.admin.list_users()
    """
    global _supabase_client
    
    if _supabase_client is not None:
        return _supabase_client
    
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
        return None
    
    try:
        from supabase import create_client, Client
        
        _supabase_client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_ROLE_KEY,
            options={
                "auto_refresh_token": False,
                "persist_session": False,
            }
        )
        return _supabase_client
    except ImportError:
        return None


def get_supabase_anon_client():
    """
    Get a Supabase client with anon key for public operations.
    Use this for client-side-like operations that respect RLS policies.
    
    Returns:
        Supabase client instance with anon key or None if not configured
    """
    if not settings.SUPABASE_URL or not settings.SUPABASE_ANON_KEY:
        return None
    
    try:
        from supabase import create_client, Client
        
        return create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_ANON_KEY,
        )
    except ImportError:
        return None


async def check_database_health_async() -> dict:
    """
    Async health check for the database connection.
    
    Returns:
        dict with status and details
    """
    from sqlalchemy import text
    from sqlalchemy.ext.asyncio import AsyncSession
    from app.database import async_session_factory
    
    result = {
        "status": "unhealthy",
        "database": "postgresql",
        "provider": "supabase" if "supabase" in settings.DATABASE_URL else "local",
        "details": {}
    }
    
    try:
        async with async_session_factory() as session:
            async with session.begin():
                db_result = await session.execute(text("SELECT 1"))
                db_result.fetchone()
                
                pool_result = await session.execute(
                    text("SELECT count(*) FROM pg_stat_activity WHERE datname = current_database()")
                )
                active_connections = pool_result.scalar()
                
                result["status"] = "healthy"
                result["details"]["active_connections"] = active_connections
                result["details"]["message"] = "Database connection successful"
                
    except Exception as e:
        result["details"]["error"] = str(e)
    
    return result


def check_database_health() -> dict:
    """
    Sync health check for the database connection.
    
    Returns:
        dict with status and details
    """
    from sqlalchemy import text
    from app.database import SessionLocal
    
    result = {
        "status": "unhealthy",
        "database": "postgresql",
        "provider": "supabase" if "supabase" in settings.DATABASE_URL else "local",
        "details": {}
    }
    
    try:
        db = SessionLocal()
        try:
            db.execute(text("SELECT 1"))
            
            active_connections = db.execute(
                text("SELECT count(*) FROM pg_stat_activity WHERE datname = current_database()")
            ).scalar()
            
            result["status"] = "healthy"
            result["details"]["active_connections"] = active_connections
            result["details"]["message"] = "Database connection successful"
        finally:
            db.close()
            
    except Exception as e:
        result["details"]["error"] = str(e)
    
    return result


def check_supabase_connection() -> dict:
    """
    Check Supabase API connectivity.
    
    Returns:
        dict with status and details
    """
    result = {
        "status": "unhealthy",
        "provider": "supabase",
        "details": {}
    }
    
    client = get_supabase_client()
    
    if client is None:
        result["details"]["error"] = "Supabase client not configured or supabase-py not installed"
        result["details"]["hint"] = "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment"
        return result
    
    try:
        client.auth.get_session()
        result["status"] = "healthy"
        result["details"]["message"] = "Supabase API connection successful"
    except Exception as e:
        result["details"]["error"] = str(e)
    
    return result
