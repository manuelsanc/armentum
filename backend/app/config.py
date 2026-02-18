"""
Application Configuration
Settings loaded from environment variables using pydantic-settings
Includes Supabase integration settings.
"""

from pydantic_settings import BaseSettings
from typing import Optional
from functools import lru_cache
import json


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/armentum"
    
    # Database Pool Settings (optimized for Supabase)
    DATABASE_POOL_SIZE: int = 3
    DATABASE_MAX_OVERFLOW: int = 2
    DATABASE_POOL_RECYCLE: int = 300
    DATABASE_POOL_TIMEOUT: int = 30
    
    # Supabase Configuration
    SUPABASE_URL: Optional[str] = None
    SUPABASE_ANON_KEY: Optional[str] = None
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = None
    
    # JWT
    SECRET_KEY: str = "your-super-secret-key-change-in-production-min-32-characters"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Email
    EMAIL_PROVIDER: str = "sendgrid"
    SENDGRID_API_KEY: Optional[str] = None
    RESEND_API_KEY: Optional[str] = None
    EMAIL_FROM: str = "noreply@armentum.com"
    
    # App URL (for email links)
    APP_URL: str = "http://localhost:5173"
    
    # CORS
    CORS_ORIGINS: str = '["http://localhost:5173","http://localhost:3000"]'
    
    # App
    DEBUG: bool = False
    ENVIRONMENT: str = "development"
    
    @property
    def cors_origins_list(self) -> list[str]:
        """Parse CORS_ORIGINS string to list"""
        try:
            return json.loads(self.CORS_ORIGINS)
        except (json.JSONDecodeError, TypeError):
            return ["http://localhost:5173", "http://localhost:3000"]
    
    @property
    def is_supabase_configured(self) -> bool:
        """Check if Supabase is properly configured"""
        return all([
            self.SUPABASE_URL,
            self.SUPABASE_ANON_KEY,
            self.SUPABASE_SERVICE_ROLE_KEY,
        ])
    
    @property
    def supabase_project_ref(self) -> Optional[str]:
        """Extract project ref from SUPABASE_URL"""
        if not self.SUPABASE_URL:
            return None
        try:
            from urllib.parse import urlparse
            parsed = urlparse(self.SUPABASE_URL)
            hostname = parsed.netloc or parsed.path
            if ".supabase.co" in hostname:
                return hostname.split(".")[0]
        except Exception:
            pass
        return None
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache
def get_settings() -> Settings:
    """Cached settings instance"""
    return Settings()


settings = get_settings()
