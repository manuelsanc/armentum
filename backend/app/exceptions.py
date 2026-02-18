"""
Custom Exceptions for Armentum API
"""

from fastapi import HTTPException, status


class ArmentumException(Exception):
    """Base exception for Armentum API."""
    def __init__(self, message: str, status_code: int = status.HTTP_400_BAD_REQUEST):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class AuthenticationError(ArmentumException):
    """Raised when authentication fails."""
    def __init__(self, message: str = "Could not validate credentials"):
        super().__init__(message, status.HTTP_401_UNAUTHORIZED)


class TokenExpiredError(AuthenticationError):
    """Raised when a token has expired."""
    def __init__(self, message: str = "Token has expired"):
        super().__init__(message)


class InvalidTokenError(AuthenticationError):
    """Raised when a token is invalid."""
    def __init__(self, message: str = "Invalid token"):
        super().__init__(message)


class UserNotFoundError(ArmentumException):
    """Raised when a user is not found."""
    def __init__(self, message: str = "User not found"):
        super().__init__(message, status.HTTP_404_NOT_FOUND)


class EmailAlreadyExistsError(ArmentumException):
    """Raised when trying to register with an existing email."""
    def __init__(self, message: str = "Email already registered"):
        super().__init__(message, status.HTTP_400_BAD_REQUEST)


class InactiveUserError(ArmentumException):
    """Raised when an inactive user tries to authenticate."""
    def __init__(self, message: str = "User account is inactive"):
        super().__init__(message, status.HTTP_403_FORBIDDEN)


class InsufficientPermissionsError(ArmentumException):
    """Raised when user lacks required permissions."""
    def __init__(self, message: str = "Insufficient permissions"):
        super().__init__(message, status.HTTP_403_FORBIDDEN)


class RoleNotFoundError(ArmentumException):
    """Raised when a role is not found."""
    def __init__(self, message: str = "Role not found"):
        super().__init__(message, status.HTTP_404_NOT_FOUND)


class EmailNotVerifiedError(ArmentumException):
    """Raised when email verification is required."""
    def __init__(self, message: str = "Email not verified"):
        super().__init__(message, status.HTTP_403_FORBIDDEN)
