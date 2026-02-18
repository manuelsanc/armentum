"""
Tests for Authentication endpoints
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import jwt

from app.main import app
from app.database import get_db, Base
from app.models import User, Role, UserRole
from app.auth.jwt import (
    create_access_token,
    create_refresh_token,
    create_verification_token,
    get_password_hash,
    verify_password,
)
from app.config import settings


class TestPasswordHashing:
    """Tests for password hashing functions."""
    
    def test_password_hash_creates_different_hashes(self):
        """Test that same password creates different hashes."""
        password = "testpassword123"
        hash1 = get_password_hash(password)
        hash2 = get_password_hash(password)
        assert hash1 != hash2
    
    def test_verify_password_correct(self):
        """Test verifying correct password."""
        password = "testpassword123"
        hashed = get_password_hash(password)
        assert verify_password(password, hashed) is True
    
    def test_verify_password_incorrect(self):
        """Test verifying incorrect password."""
        password = "testpassword123"
        hashed = get_password_hash(password)
        assert verify_password("wrongpassword", hashed) is False


class TestJWTTokens:
    """Tests for JWT token creation and validation."""
    
    def test_create_access_token(self):
        """Test creating access token."""
        data = {"sub": "test-user-id", "roles": ["corista"]}
        token = create_access_token(data)
        assert token is not None
        assert isinstance(token, str)
    
    def test_create_refresh_token(self):
        """Test creating refresh token."""
        data = {"sub": "test-user-id"}
        token = create_refresh_token(data)
        assert token is not None
        assert isinstance(token, str)
    
    def test_access_token_contains_correct_data(self):
        """Test that access token contains correct payload."""
        data = {"sub": "test-user-id", "roles": ["admin", "corista"]}
        token = create_access_token(data)
        
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        
        assert payload["sub"] == "test-user-id"
        assert payload["roles"] == ["admin", "corista"]
        assert payload["type"] == "access"
        assert "exp" in payload
    
    def test_refresh_token_contains_correct_data(self):
        """Test that refresh token contains correct payload."""
        data = {"sub": "test-user-id"}
        token = create_refresh_token(data)
        
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        
        assert payload["sub"] == "test-user-id"
        assert payload["type"] == "refresh"
        assert "exp" in payload
    
    def test_create_verification_token(self):
        """Test creating verification token."""
        email = "test@example.com"
        token = create_verification_token(email)
        
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        
        assert payload["sub"] == email
        assert payload["type"] == "verification"


class TestRegisterEndpoint:
    """Tests for POST /api/auth/register endpoint."""
    
    def test_register_success(self, client, db_session, sample_user_data):
        """Test successful user registration."""
        role = Role(nombre="corista", descripcion="Default role")
        db_session.add(role)
        db_session.commit()
        
        response = client.post("/api/auth/register", json=sample_user_data)
        
        assert response.status_code == 201
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert "user" in data
        assert data["user"]["email"] == sample_user_data["email"]
        assert data["user"]["nombre"] == sample_user_data["nombre"]
    
    def test_register_duplicate_email(self, client, db_session, sample_user_data):
        """Test registration with duplicate email fails."""
        role = Role(nombre="corista", descripcion="Default role")
        db_session.add(role)
        db_session.commit()
        
        client.post("/api/auth/register", json=sample_user_data)
        
        response = client.post("/api/auth/register", json=sample_user_data)
        
        assert response.status_code == 400
        assert "already registered" in response.json()["detail"].lower()
    
    def test_register_creates_default_role(self, client, db_session, sample_user_data):
        """Test that registration assigns default 'corista' role."""
        role = Role(nombre="corista", descripcion="Default role")
        db_session.add(role)
        db_session.commit()
        
        response = client.post("/api/auth/register", json=sample_user_data)
        
        assert response.status_code == 201
        data = response.json()
        assert "corista" in data["user"]["roles"]
    
    def test_register_invalid_email(self, client, db_session):
        """Test registration with invalid email fails."""
        invalid_data = {
            "email": "not-an-email",
            "nombre": "Test User",
            "password": "securepassword123"
        }
        
        response = client.post("/api/auth/register", json=invalid_data)
        
        assert response.status_code == 422
    
    def test_register_short_password(self, client, db_session):
        """Test registration with short password fails."""
        short_password_data = {
            "email": "test@example.com",
            "nombre": "Test User",
            "password": "short"
        }
        
        response = client.post("/api/auth/register", json=short_password_data)
        
        assert response.status_code == 422


class TestLoginEndpoint:
    """Tests for POST /api/auth/login endpoint."""
    
    @pytest.fixture
    def registered_user(self, db_session):
        """Create a registered user for login tests."""
        role = Role(nombre="corista", descripcion="Default role")
        db_session.add(role)
        db_session.commit()
        
        user = User(
            email="login@example.com",
            password_hash=get_password_hash("correctpassword"),
            nombre="Login User",
            is_active=True,
            email_verified=True,
        )
        db_session.add(user)
        db_session.flush()
        
        user_role = UserRole(user_id=user.id, role_id=role.id)
        db_session.add(user_role)
        db_session.commit()
        db_session.refresh(user)
        
        return user
    
    def test_login_success(self, client, registered_user):
        """Test successful login."""
        response = client.post("/api/auth/login", json={
            "email": "login@example.com",
            "password": "correctpassword"
        })
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["user"]["email"] == "login@example.com"
    
    def test_login_wrong_password(self, client, registered_user):
        """Test login with wrong password fails."""
        response = client.post("/api/auth/login", json={
            "email": "login@example.com",
            "password": "wrongpassword"
        })
        
        assert response.status_code == 401
    
    def test_login_nonexistent_user(self, client):
        """Test login with non-existent user fails."""
        response = client.post("/api/auth/login", json={
            "email": "nonexistent@example.com",
            "password": "anypassword"
        })
        
        assert response.status_code == 401
    
    def test_login_inactive_user(self, client, db_session):
        """Test login with inactive user fails."""
        role = Role(nombre="corista", descripcion="Default role")
        db_session.add(role)
        db_session.commit()
        
        user = User(
            email="inactive@example.com",
            password_hash=get_password_hash("password123"),
            nombre="Inactive User",
            is_active=False,
            email_verified=True,
        )
        db_session.add(user)
        db_session.commit()
        
        response = client.post("/api/auth/login", json={
            "email": "inactive@example.com",
            "password": "password123"
        })
        
        assert response.status_code == 403


class TestRefreshTokenEndpoint:
    """Tests for POST /api/auth/refresh endpoint."""
    
    @pytest.fixture
    def user_with_tokens(self, db_session):
        """Create a user and return refresh token."""
        role = Role(nombre="corista", descripcion="Default role")
        db_session.add(role)
        db_session.commit()
        
        user = User(
            email="refresh@example.com",
            password_hash=get_password_hash("password123"),
            nombre="Refresh User",
            is_active=True,
            email_verified=True,
        )
        db_session.add(user)
        db_session.flush()
        
        user_role = UserRole(user_id=user.id, role_id=role.id)
        db_session.add(user_role)
        db_session.commit()
        
        refresh_token = create_refresh_token(data={"sub": str(user.id)})
        
        return user, refresh_token
    
    def test_refresh_token_success(self, client, user_with_tokens):
        """Test successful token refresh."""
        user, refresh_token = user_with_tokens
        
        response = client.post("/api/auth/refresh", json={
            "refresh_token": refresh_token
        })
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
    
    def test_refresh_token_invalid(self, client):
        """Test refresh with invalid token fails."""
        response = client.post("/api/auth/refresh", json={
            "refresh_token": "invalid.token.here"
        })
        
        assert response.status_code == 401
    
    def test_refresh_token_with_access_token_fails(self, client, db_session):
        """Test that using access token as refresh token fails."""
        role = Role(nombre="corista", descripcion="Default role")
        db_session.add(role)
        db_session.commit()
        
        user = User(
            email="test@example.com",
            password_hash=get_password_hash("password123"),
            nombre="Test User",
            is_active=True,
            email_verified=True,
        )
        db_session.add(user)
        db_session.commit()
        
        access_token = create_access_token(data={"sub": str(user.id), "roles": []})
        
        response = client.post("/api/auth/refresh", json={
            "refresh_token": access_token
        })
        
        assert response.status_code == 401


class TestVerifyEmailEndpoint:
    """Tests for GET /api/auth/verify/{token} endpoint."""
    
    def test_verify_email_success(self, client, db_session):
        """Test successful email verification."""
        user = User(
            email="verify@example.com",
            password_hash=get_password_hash("password123"),
            nombre="Verify User",
            is_active=True,
            email_verified=False,
        )
        db_session.add(user)
        db_session.commit()
        
        token = create_verification_token("verify@example.com")
        
        response = client.get(f"/api/auth/verify/{token}")
        
        assert response.status_code == 200
        assert "verified successfully" in response.json()["message"].lower()
        
        db_session.refresh(user)
        assert user.email_verified is True
    
    def test_verify_email_already_verified(self, client, db_session):
        """Test verifying already verified email."""
        user = User(
            email="already@example.com",
            password_hash=get_password_hash("password123"),
            nombre="Already User",
            is_active=True,
            email_verified=True,
        )
        db_session.add(user)
        db_session.commit()
        
        token = create_verification_token("already@example.com")
        
        response = client.get(f"/api/auth/verify/{token}")
        
        assert response.status_code == 200
    
    def test_verify_email_invalid_token(self, client):
        """Test verification with invalid token."""
        response = client.get("/api/auth/verify/invalid.token.here")
        
        assert response.status_code == 400


class TestGetCurrentUser:
    """Tests for GET /api/auth/me endpoint."""
    
    @pytest.fixture
    def authenticated_user(self, db_session):
        """Create an authenticated user with token."""
        role = Role(nombre="corista", descripcion="Default role")
        db_session.add(role)
        db_session.commit()
        
        user = User(
            email="me@example.com",
            password_hash=get_password_hash("password123"),
            nombre="Me User",
            is_active=True,
            email_verified=True,
        )
        db_session.add(user)
        db_session.flush()
        
        user_role = UserRole(user_id=user.id, role_id=role.id)
        db_session.add(user_role)
        db_session.commit()
        
        access_token = create_access_token(
            data={"sub": str(user.id), "roles": ["corista"]}
        )
        
        return user, access_token
    
    def test_get_me_success(self, client, authenticated_user):
        """Test getting current user info."""
        user, token = authenticated_user
        
        response = client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "me@example.com"
        assert data["nombre"] == "Me User"
    
    def test_get_me_no_token(self, client):
        """Test getting current user without token fails."""
        response = client.get("/api/auth/me")
        
        assert response.status_code == 401
    
    def test_get_me_invalid_token(self, client):
        """Test getting current user with invalid token fails."""
        response = client.get(
            "/api/auth/me",
            headers={"Authorization": "Bearer invalid.token.here"}
        )
        
        assert response.status_code == 401


class TestLogoutEndpoint:
    """Tests for POST /api/auth/logout endpoint."""
    
    def test_logout_success(self, client, db_session):
        """Test successful logout."""
        role = Role(nombre="corista", descripcion="Default role")
        db_session.add(role)
        db_session.commit()
        
        user = User(
            email="logout@example.com",
            password_hash=get_password_hash("password123"),
            nombre="Logout User",
            is_active=True,
            email_verified=True,
        )
        db_session.add(user)
        db_session.flush()
        
        user_role = UserRole(user_id=user.id, role_id=role.id)
        db_session.add(user_role)
        db_session.commit()
        
        access_token = create_access_token(
            data={"sub": str(user.id), "roles": ["corista"]}
        )
        
        response = client.post(
            "/api/auth/logout",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        
        assert response.status_code == 200
        assert "logged out" in response.json()["message"].lower()


class TestProtectedEndpoints:
    """Tests for role-based access control."""
    
    @pytest.fixture
    def admin_user(self, db_session):
        """Create an admin user."""
        admin_role = Role(nombre="admin", descripcion="Administrator")
        corista_role = Role(nombre="corista", descripcion="Corista")
        db_session.add_all([admin_role, corista_role])
        db_session.commit()
        
        user = User(
            email="admin@example.com",
            password_hash=get_password_hash("password123"),
            nombre="Admin User",
            is_active=True,
            email_verified=True,
        )
        db_session.add(user)
        db_session.flush()
        
        user_role = UserRole(user_id=user.id, role_id=admin_role.id)
        db_session.add(user_role)
        db_session.commit()
        
        access_token = create_access_token(
            data={"sub": str(user.id), "roles": ["admin"]}
        )
        
        return user, access_token
    
    @pytest.fixture
    def regular_user(self, db_session):
        """Create a regular user (corista)."""
        corista_role = Role(nombre="corista", descripcion="Corista")
        db_session.add(corista_role)
        db_session.commit()
        
        user = User(
            email="regular@example.com",
            password_hash=get_password_hash("password123"),
            nombre="Regular User",
            is_active=True,
            email_verified=True,
        )
        db_session.add(user)
        db_session.flush()
        
        user_role = UserRole(user_id=user.id, role_id=corista_role.id)
        db_session.add(user_role)
        db_session.commit()
        
        access_token = create_access_token(
            data={"sub": str(user.id), "roles": ["corista"]}
        )
        
        return user, access_token
    
    def test_me_endpoint_accessible_by_regular_user(self, client, regular_user):
        """Test that regular user can access /me endpoint."""
        user, token = regular_user
        
        response = client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 200
