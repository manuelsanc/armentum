"""
Database Initialization Script
Creates tables, runs migrations, and seeds initial data.
"""

import asyncio
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import text
from app.database import async_engine, Base
from app.config import settings


async def create_tables():
    """Create all tables from SQLAlchemy models."""
    print("Creating tables from SQLAlchemy models...")
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Tables created successfully.")


async def run_sql_file(filepath: str, description: str):
    """Execute a SQL file against the database."""
    print(f"Running {description}...")
    sql_path = Path(__file__).parent.parent / "migrations" / "sql" / filepath
    
    if not sql_path.exists():
        print(f"  Warning: {sql_path} not found, skipping.")
        return
    
    with open(sql_path, "r") as f:
        sql_content = f.read()
    
    async with async_engine.begin() as conn:
        # Split by semicolons and execute each statement
        statements = [s.strip() for s in sql_content.split(";") if s.strip()]
        for statement in statements:
            if statement and not statement.startswith("--"):
                try:
                    await conn.execute(text(statement))
                except Exception as e:
                    print(f"  Warning: {e}")
    
    print(f"  {description} completed.")


async def init_database(run_seed: bool = True):
    """Initialize the database with all tables and seed data."""
    print("=" * 60)
    print("Armentum Database Initialization")
    print("=" * 60)
    print(f"Database URL: {settings.DATABASE_URL.split('@')[1] if '@' in settings.DATABASE_URL else 'configured'}")
    print(f"Environment: {settings.ENVIRONMENT}")
    print("=" * 60)
    
    try:
        # Step 1: Create tables
        await create_tables()
        
        # Step 2: Run indexes and constraints
        await run_sql_file("indexes_constraints.sql", "Indexes and Constraints")
        
        # Step 3: Run RLS policies
        await run_sql_file("rls_policies.sql", "Row Level Security Policies")
        
        # Step 4: Run seed data (optional)
        if run_seed:
            await run_sql_file("seed_data.sql", "Seed Data")
        
        print("=" * 60)
        print("Database initialization completed successfully!")
        print("=" * 60)
        
        if run_seed:
            print("\nDefault admin credentials:")
            print("  Email: admin@armentum.local")
            print("  Password: Admin123!")
            print("\nIMPORTANT: Change the admin password after first login!")
        
    except Exception as e:
        print(f"\nError during initialization: {e}")
        raise
    finally:
        await async_engine.dispose()


def main():
    """Main entry point."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Initialize Armentum database")
    parser.add_argument(
        "--no-seed",
        action="store_true",
        help="Skip seeding initial data"
    )
    args = parser.parse_args()
    
    asyncio.run(init_database(run_seed=not args.no_seed))


if __name__ == "__main__":
    main()
