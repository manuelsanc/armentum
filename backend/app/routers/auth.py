"""
Authentication Router
Handles user registration, login, token refresh, and email verification
"""

from datetime import datetime
from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.database import get_db
from app.models import User, Role, UserRole
from app.schemas import (
    UserCreate,
    UserLogin,
    UserResponse,
    Token,
    LoginResponse,
    RefreshTokenRequest,
    Message,
)
from app.auth.jwt import (
    create_access_token,
    create_refresh_token,
    verify_token,
    verify_password,
    get_password_hash,
    create_verification_token,
)
from app.auth.dependencies import get_current_active_user, get_user_roles
from app.exceptions import (
    EmailAlreadyExistsError,
    AuthenticationError,
    InactiveUserError,
    InvalidTokenError,
)
from app.services.email_service import email_service
from app.config import settings
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


def _get_user_roles(user: User, db: Session) -> list[str]:
    """Helper to get user roles."""
    return get_user_roles(user, db)


def _send_verification_email_task(email: str, token: str):
    """Background task to send verification email."""
    import asyncio
    asyncio.run(email_service.send_verification_email(email, token))


@router.post("/register", response_model=LoginResponse, status_code=status.HTTP_201_CREATED)
def register(
    user_data: UserCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Register a new user.
    
    - Validates email uniqueness
    - Hashes password
    - Creates user with default 'corista' role
    - Sends verification email (or logs URL in development)
    - Returns tokens and user data
    """
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise EmailAlreadyExistsError()
    
    hashed_password = get_password_hash(user_data.password)
    
    is_dev_mode = settings.ENVIRONMENT == "development"
    new_user = User(
        email=user_data.email,
        password_hash=hashed_password,
        nombre=user_data.nombre,
        is_active=True,
        email_verified=is_dev_mode,
    )
    
    db.add(new_user)
    db.flush()
    
    role_name = "admin" if user_data.es_admin else "corista"
    role = db.query(Role).filter(Role.nombre == role_name).first()
    
    if not role:
        default_role = db.query(Role).filter(Role.nombre == "corista").first()
        if default_role:
            user_role = UserRole(user_id=new_user.id, role_id=default_role.id)
            db.add(user_role)
    else:
        user_role = UserRole(user_id=new_user.id, role_id=role.id)
        db.add(user_role)
    
    db.commit()
    db.refresh(new_user)
    
    verification_token = create_verification_token(new_user.email)
    
    if settings.ENVIRONMENT == "development":
        verify_url = f"{settings.APP_URL}/verify-email?token={verification_token}"
        logger.info(f"DEV MODE - Verification URL for {new_user.email}: {verify_url}")
    else:
        background_tasks.add_task(
            _send_verification_email_task,
            new_user.email,
            verification_token
        )
    
    user_roles = _get_user_roles(new_user, db)
    
    access_token = create_access_token(
        data={"sub": str(new_user.id), "roles": user_roles}
    )
    refresh_token = create_refresh_token(data={"sub": str(new_user.id)})
    
    return LoginResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserResponse(
            id=new_user.id,
            email=new_user.email,
            nombre=new_user.nombre,
            is_active=new_user.is_active,
            email_verified=new_user.email_verified,
            roles=user_roles,
            created_at=new_user.created_at,
        )
    )


@router.post("/login", response_model=LoginResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate user and return tokens.
    
    - Verifies email and password
    - Checks if user is active
    - Generates access and refresh tokens
    - Returns tokens and user data
    """
    user = db.query(User).filter(User.email == credentials.email).first()
    
    if not user:
        raise AuthenticationError("Incorrect email or password")
    
    if not verify_password(credentials.password, user.password_hash):
        raise AuthenticationError("Incorrect email or password")
    
    if not user.is_active:
        raise InactiveUserError()
    
    user_roles = _get_user_roles(user, db)
    
    access_token = create_access_token(
        data={"sub": str(user.id), "roles": user_roles}
    )
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    return LoginResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserResponse(
            id=user.id,
            email=user.email,
            nombre=user.nombre,
            is_active=user.is_active,
            email_verified=user.email_verified,
            roles=user_roles,
            created_at=user.created_at,
        )
    )


@router.post("/refresh", response_model=Token)
def refresh_token(request: RefreshTokenRequest, db: Session = Depends(get_db)):
    """
    Refresh access token using refresh token.
    
    - Validates refresh token
    - Generates new access token
    - Returns new tokens
    """
    try:
        token_data = verify_token(request.refresh_token, token_type="refresh")
    except InvalidTokenError:
        raise AuthenticationError("Invalid refresh token")
    
    # Convert token user_id string to UUID for querying
    try:
        token_user_id = UUID(token_data.user_id)
    except (ValueError, TypeError):
        raise AuthenticationError("Invalid user id in token")
    user = db.query(User).filter(User.id == token_user_id).first()
    
    if not user:
        raise AuthenticationError("User not found")
    
    if not user.is_active:
        raise InactiveUserError()
    
    user_roles = _get_user_roles(user, db)
    
    access_token = create_access_token(
        data={"sub": str(user.id), "roles": user_roles}
    )
    new_refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    return Token(
        access_token=access_token,
        refresh_token=new_refresh_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.get("/verify/{token}", response_model=Message)
def verify_email(token: str, db: Session = Depends(get_db)):
    """
    Verify user email address.
    
    - Validates verification token
    - Marks user email as verified
    - Returns success message
    """
    try:
        token_data = verify_token(token, token_type="verification")
    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token"
        )
    
    user = db.query(User).filter(User.email == token_data.user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if user.email_verified:
        return Message(message="Email already verified")
    
    user.email_verified = True
    user.updated_at = datetime.utcnow()
    db.commit()
    
    return Message(message="Email verified successfully")


@router.get("/me", response_model=UserResponse)
def get_current_user_info(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get current authenticated user information.
    
    - Requires valid authentication
    - Returns user data with roles
    """
    user_roles = _get_user_roles(current_user, db)
    
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        nombre=current_user.nombre,
        is_active=current_user.is_active,
        email_verified=current_user.email_verified,
        roles=user_roles,
        created_at=current_user.created_at,
    )


@router.post("/logout", response_model=Message)
def logout(current_user: User = Depends(get_current_active_user)):
    """
    Logout user (client should discard tokens).
    
    Note: With stateless JWT, server-side logout requires
    a token blacklist. This endpoint exists for consistency
    and future token blacklist implementation.
    """
    return Message(message="Successfully logged out")
