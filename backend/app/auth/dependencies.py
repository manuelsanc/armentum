"""
Authentication Dependencies
FastAPI dependencies for authentication and authorization
"""

from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.models import User, UserRole, Role
from app.auth.jwt import verify_token
from app.exceptions import (
    AuthenticationError,
    InvalidTokenError,
    UserNotFoundError,
    InactiveUserError,
    InsufficientPermissionsError,
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Get the current authenticated user from the JWT token.
    
    Args:
        token: JWT access token
        db: Database session
    
    Returns:
        User object
    
    Raises:
        AuthenticationError: If token is invalid
        UserNotFoundError: If user doesn't exist
    """
    credentials_exception = AuthenticationError("Could not validate credentials")
    
    try:
        token_data = verify_token(token, token_type="access")
    except (InvalidTokenError, Exception):
        raise credentials_exception
    
    # Convert token user_id string to UUID for querying
    try:
        token_user_id = UUID(token_data.user_id)
    except (ValueError, TypeError):
        raise AuthenticationError("Invalid token")
    user = db.query(User).filter(User.id == token_user_id).first()
    
    if user is None:
        raise UserNotFoundError("User not found")
    
    return user


def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Get the current active user.
    
    Args:
        current_user: User from get_current_user dependency
    
    Returns:
        Active User object
    
    Raises:
        InactiveUserError: If user is inactive
    """
    if not current_user.is_active:
        raise InactiveUserError("Inactive user")
    
    return current_user


def get_user_roles(user: User, db: Session) -> list[str]:
    """
    Get list of role names for a user.
    
    Args:
        user: User object
        db: Database session
    
    Returns:
        List of role names
    """
    user_roles = (
        db.query(Role.nombre)
        .join(UserRole, Role.id == UserRole.role_id)
        .filter(UserRole.user_id == user.id)
        .all()
    )
    return [role.nombre for role in user_roles]


def require_roles(required_roles: list[str]):
    """
    Dependency factory that checks if user has required roles.
    
    Args:
        required_roles: List of role names required to access the endpoint
    
    Returns:
        Dependency function that validates user roles
    
    Usage:
        @router.get("/admin-only", dependencies=[Depends(require_roles(["admin"]))])
    """
    async def role_checker(
        current_user: User = Depends(get_current_active_user),
        db: Session = Depends(get_db)
    ) -> User:
        user_roles = get_user_roles(current_user, db)
        
        if not any(role in user_roles for role in required_roles):
            raise InsufficientPermissionsError(
                f"Required roles: {', '.join(required_roles)}"
            )
        
        return current_user

    return role_checker


require_admin = require_roles(["admin"])


def get_optional_user(
    token: Optional[str] = Depends(OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """
    Get current user if authenticated, otherwise return None.
    Useful for endpoints that have different behavior for authenticated users.
    
    Args:
        token: Optional JWT access token
        db: Database session
    
    Returns:
        User object if authenticated, None otherwise
    """
    if token is None:
        return None
    
    try:
        token_data = verify_token(token, token_type="access")
        try:
            token_user_id = UUID(token_data.user_id)
        except (ValueError, TypeError):
            return None
        user = db.query(User).filter(User.id == token_user_id).first()
        return user
    except Exception:
        return None
