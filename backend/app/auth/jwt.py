"""
JWT Token Handling
Token generation, validation, and decoding using python-jose
"""

from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.config import settings
from app.schemas import TokenData
from app.exceptions import InvalidTokenError, TokenExpiredError

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Generate a password hash."""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token.
    
    Args:
        data: Payload data to encode in the token
        expires_delta: Optional custom expiration time
    
    Returns:
        Encoded JWT token string
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({
        "exp": expire,
        "type": "access",
        "iat": datetime.utcnow(),
    })
    
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def create_refresh_token(data: dict) -> str:
    """
    Create a JWT refresh token.
    
    Args:
        data: Payload data to encode in the token (typically user_id)
    
    Returns:
        Encoded JWT refresh token string
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    
    to_encode.update({
        "exp": expire,
        "type": "refresh",
        "iat": datetime.utcnow(),
    })
    
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def create_verification_token(email: str, hours: int = 24) -> str:
    """
    Create an email verification token.
    
    Args:
        email: User's email address
        hours: Token validity period in hours
    
    Returns:
        Encoded JWT verification token
    """
    expire = datetime.utcnow() + timedelta(hours=hours)
    
    to_encode = {
        "sub": email,
        "exp": expire,
        "type": "verification",
        "iat": datetime.utcnow(),
    }
    
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def verify_token(token: str, token_type: str = "access") -> TokenData:
    """
    Verify and decode a JWT token.
    
    Args:
        token: JWT token string to verify
        token_type: Expected token type (access, refresh, verification)
    
    Returns:
        TokenData with user_id and roles
    
    Raises:
        InvalidTokenError: If token is invalid or wrong type
        TokenExpiredError: If token has expired
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        
        if payload.get("type") != token_type:
            raise InvalidTokenError(f"Invalid token type. Expected {token_type}")
        
        user_id: str = payload.get("sub")
        roles: list = payload.get("roles", [])
        
        if user_id is None:
            raise InvalidTokenError("Token missing user identifier")
        
        return TokenData(user_id=user_id, roles=roles)
    
    except jwt.ExpiredSignatureError:
        raise TokenExpiredError()
    except JWTError as e:
        raise InvalidTokenError(f"Invalid token: {str(e)}")


def decode_token(token: str) -> dict:
    """
    Decode a JWT token without verification.
    Useful for extracting payload data when validation isn't needed.
    
    Args:
        token: JWT token string
    
    Returns:
        Decoded token payload as dict
    
    Raises:
        InvalidTokenError: If token cannot be decoded
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError as e:
        raise InvalidTokenError(f"Invalid token: {str(e)}")
