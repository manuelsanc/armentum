"""
Database Reset Script
Drops and recreates all tables. USE ONLY IN DEVELOPMENT!

WARNING: This will delete all data!
"""

import asyncio
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import text
from app.database import async_engine, Base
from app.config import settings


async def drop_all_tables():
    """Drop all tables from the database."""
    print("Dropping all tables...")
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    print("All tables dropped.")


async def disable_rls():
    """Disable RLS on all tables before dropping."""
    print("Disabling Row Level Security...")
    tables = [
        "users", "roles", "users_roles", "miembros",
        "eventos_publicos", "ensayos", "asistencias",
        "cuotas", "comunicados", "archivos"
    ]
    
    async with async_engine.begin() as conn:
        for table in tables:
            try:
                await conn.execute(text(f"ALTER TABLE {table} DISABLE ROW LEVEL SECURITY"))
            except Exception:
                pass  # Table might not exist
    print("RLS disabled.")


async def reset_database(run_seed: bool = True):
    """Reset the database completely."""
    print("=" * 60)
    print("Armentum Database Reset")
    print("=" * 60)
    print(f"Database URL: {settings.DATABASE_URL.split('@')[1] if '@' in settings.DATABASE_URL else 'configured'}")
    print(f"Environment: {settings.ENVIRONMENT}")
    print("=" * 60)
    
    if settings.ENVIRONMENT == "production":
        print("\nERROR: Cannot reset database in production environment!")
        print("Set ENVIRONMENT=development to allow this operation.")
        sys.exit(1)
    
    # Confirm operation
    print("\nWARNING: This will DELETE ALL DATA in the database!")
    response = input("Are you sure you want to continue? (yes/no): ")
    
    if response.lower() != "yes":
        print("Operation cancelled.")
        return
    
    try:
        # Step 1: Disable RLS
        await disable_rls()
        
        # Step 2: Drop all tables
        await drop_all_tables()
        
        # Step 3: Re-create everything using init_db
        from scripts.init_db import init_database
        await init_database(run_seed=run_seed)
        
    except Exception as e:
        print(f"\nError during reset: {e}")
        raise
    finally:
        await async_engine.dispose()


def main():
    """Main entry point."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Reset Armentum database (DEVELOPMENT ONLY)")
    parser.add_argument(
        "--no-seed",
        action="store_true",
        help="Skip seeding initial data after reset"
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Skip confirmation prompt"
    )
    args = parser.parse_args()
    
    if args.force:
        # Override input for non-interactive use
        import builtins
        builtins.input = lambda _: "yes"
    
    asyncio.run(reset_database(run_seed=not args.no_seed))


if __name__ == "__main__":
    main()
