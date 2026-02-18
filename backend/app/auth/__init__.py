"""
Authentication Module
JWT token handling, password hashing, and auth dependencies
"""

from app.auth.jwt import (
    create_access_token,
    create_refresh_token,
    verify_token,
    decode_token,
    create_verification_token,
    verify_password,
    get_password_hash,
)
from app.auth.dependencies import (
    get_current_user,
    get_current_active_user,
    require_roles,
    oauth2_scheme,
)

__all__ = [
    "create_access_token",
    "create_refresh_token",
    "verify_token",
    "decode_token",
    "create_verification_token",
    "verify_password",
    "get_password_hash",
    "get_current_user",
    "get_current_active_user",
    "require_roles",
    "oauth2_scheme",
]
