"""
Pytest fixtures for testing
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import Base, get_db


SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database session for each test."""
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """Create a test client with database dependency override."""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def sample_user_data():
    """Sample user data for testing."""
    return {
        "email": "test@example.com",
        "nombre": "Test User",
        "password": "securepassword123",
        "es_admin": False,
    }


@pytest.fixture
def sample_miembro_data():
    """Sample miembro data for testing."""
    from uuid import uuid4
    from datetime import date
    return {
        "user_id": str(uuid4()),
        "voz": "Soprano",
        "fecha_ingreso": str(date.today()),
        "estado": "activo",
        "telefono": "+1234567890",
    }


@pytest.fixture
def sample_evento_data():
    """Sample evento data for testing."""
    return {
        "nombre": "Concierto de Primavera",
        "descripcion": "Un concierto maravilloso",
        "fecha": "2025-06-15",
        "hora": "19:30",
        "lugar": "Teatro Municipal",
        "tipo": "concierto",
        "estado": "planificado",
    }


@pytest.fixture
def admin_user(db_session):
    """Create an admin user for testing."""
    from app.models import User, Role, UserRole
    from app.auth.jwt import get_password_hash
    from uuid import uuid4

    # Create admin role if doesn't exist
    admin_role = db_session.query(Role).filter(Role.nombre == "admin").first()
    if not admin_role:
        admin_role = Role(nombre="admin", descripcion="Administrator role")
        db_session.add(admin_role)
        db_session.flush()

    # Create admin user
    admin_user = User(
        id=uuid4(),
        email="admin@test.com",
        nombre="Admin User",
        password_hash=get_password_hash("adminpass123"),
        is_active=True,
    )
    db_session.add(admin_user)
    db_session.flush()

    # Assign admin role
    user_role = UserRole(user_id=admin_user.id, role_id=admin_role.id)
    db_session.add(user_role)
    db_session.commit()

    return admin_user


@pytest.fixture
def auth_headers(admin_user):
    """Generate auth headers for admin user."""
    from app.auth.jwt import create_access_token

    access_token = create_access_token(
        data={"sub": str(admin_user.id), "roles": ["admin"]}
    )
    return {"Authorization": f"Bearer {access_token}"}


@pytest.fixture
def test_gallery_image(db_session, admin_user):
    """Create a test gallery image."""
    from app.models import GalleryImage
    from datetime import date

    gallery_image = GalleryImage(
        titulo="Concierto de Prueba",
        descripcion="Una descripción de prueba",
        fecha=date(2024, 12, 25),
        tags=["conciertos", "navidad"],
        image_url="https://example.com/images/test_full.jpg",
        thumbnail_url="https://example.com/images/test_thumb.jpg",
        created_by=admin_user.id,
    )
    db_session.add(gallery_image)
    db_session.commit()
    db_session.refresh(gallery_image)

    return gallery_image


@pytest.fixture
def sample_ensayo_data():
    """Sample ensayo data for testing."""
    return {
        "tipo": "general",
        "nombre": "Ensayo General",
        "fecha": "2025-06-10",
        "hora": "18:00",
        "lugar": "Sala de Ensayos",
        "cuerdas": "Todas",
        "descripcion": "Ensayo para el concierto",
    }
