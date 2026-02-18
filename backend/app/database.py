"""
Database Configuration
SQLAlchemy engine and session management with Supabase optimization.
Supports both sync and async operations.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.pool import QueuePool
from app.config import settings
import urllib.parse


def get_database_url(async_driver: bool = False) -> str:
    """
    Get the database URL, converting to async format if needed.
    Handles Supabase connection string format.
    
    Args:
        async_driver: If True, returns URL with asyncpg driver
    
    Returns:
        Database connection URL
    """
    url = settings.DATABASE_URL
    
    if async_driver:
        if url.startswith("postgresql://"):
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
        elif url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+asyncpg://", 1)
    
    return url


sync_engine = create_engine(
    get_database_url(async_driver=False),
    echo=settings.DEBUG,
    future=True,
    pool_pre_ping=True,
    poolclass=QueuePool,
    pool_size=settings.DATABASE_POOL_SIZE,
    max_overflow=settings.DATABASE_MAX_OVERFLOW,
    pool_recycle=settings.DATABASE_POOL_RECYCLE,
    pool_timeout=settings.DATABASE_POOL_TIMEOUT,
    connect_args={
        "connect_timeout": 10,
        "application_name": "armentum-backend",
    },
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=sync_engine
)

async_engine = create_async_engine(
    get_database_url(async_driver=True),
    echo=settings.DEBUG,
    future=True,
    pool_pre_ping=True,
    pool_size=settings.DATABASE_POOL_SIZE,
    max_overflow=settings.DATABASE_MAX_OVERFLOW,
    pool_recycle=settings.DATABASE_POOL_RECYCLE,
    pool_timeout=settings.DATABASE_POOL_TIMEOUT,
    connect_args={
        "timeout": 10,
        "server_settings": {
            "application_name": "armentum-backend-async",
            "jit": "off",
        },
        "command_timeout": 60,
    },
)

async_session_factory = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)

Base = declarative_base()


def get_db():
    """
    Sync dependency function for database sessions.
    Yields a database session and ensures it's closed after use.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_async_db():
    """
    Async dependency function for database sessions.
    Yields an async database session and ensures it's closed after use.
    """
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db():
    """
    Initialize database - create all tables.
    Should be called on application startup.
    """
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def close_db():
    """
    Close database connections.
    Should be called on application shutdown.
    """
    await async_engine.dispose()
