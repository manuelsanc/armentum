"""
Tests for ORM model instantiation
"""

import pytest
from datetime import datetime, date
from uuid import UUID

from app.models import (
    User,
    Role,
    UserRole,
    Miembro,
    EventoPublico,
    Ensayo,
    Asistencia,
    Cuota,
    Comunicado,
    Archivo,
)


class TestUserModel:
    """Tests for User model."""

    def test_user_instantiation(self):
        """Test creating a User instance."""
        user = User(
            email="test@example.com",
            password_hash="hashed_password",
            nombre="Test User",
        )
        assert user.email == "test@example.com"
        assert user.password_hash == "hashed_password"
        assert user.nombre == "Test User"
        assert user.is_active is True
        assert user.email_verified is False

    def test_user_default_values(self):
        """Test User default values."""
        user = User(
            email="test@example.com",
            password_hash="hash",
            nombre="Test",
        )
        assert user.is_active is True
        assert user.email_verified is False

    def test_user_id_is_uuid(self):
        """Test that User ID is UUID."""
        user = User(
            email="test@example.com",
            password_hash="hash",
            nombre="Test",
        )
        assert isinstance(user.id, UUID)

    def test_user_created_at_auto_set(self):
        """Test that created_at is auto-set."""
        user = User(
            email="test@example.com",
            password_hash="hash",
            nombre="Test",
        )
        assert isinstance(user.created_at, datetime)

    def test_user_tablename(self):
        """Test User table name."""
        assert User.__tablename__ == "users"


class TestRoleModel:
    """Tests for Role model."""

    def test_role_instantiation(self):
        """Test creating a Role instance."""
        role = Role(
            nombre="Admin",
            descripcion="Administrator role",
            permisos={"read": True, "write": True, "delete": True},
        )
        assert role.nombre == "Admin"
        assert role.descripcion == "Administrator role"
        assert role.permisos["read"] is True

    def test_role_default_permisos(self):
        """Test Role default permisos."""
        role = Role(nombre="User")
        assert role.permisos == {}

    def test_role_id_is_uuid(self):
        """Test that Role ID is UUID."""
        role = Role(nombre="Test Role")
        assert isinstance(role.id, UUID)

    def test_role_tablename(self):
        """Test Role table name."""
        assert Role.__tablename__ == "roles"


class TestUserRoleModel:
    """Tests for UserRole model."""

    def test_user_role_instantiation(self):
        """Test creating a UserRole instance."""
        user_id = "12345678-1234-5678-1234-567812345678"
        role_id = "87654321-4321-8765-4321-876543218765"
        user_role = UserRole(user_id=user_id, role_id=role_id)
        assert user_role.user_id == user_id
        assert user_role.role_id == role_id

    def test_user_role_tablename(self):
        """Test UserRole table name."""
        assert UserRole.__tablename__ == "users_roles"


class TestMiembroModel:
    """Tests for Miembro model."""

    def test_miembro_instantiation(self):
        """Test creating a Miembro instance."""
        user_id = "12345678-1234-5678-1234-567812345678"
        miembro = Miembro(
            user_id=user_id,
            voz="Soprano",
            fecha_ingreso=date.today(),
            estado="activo",
        )
        assert miembro.voz == "Soprano"
        assert miembro.estado == "activo"
        assert miembro.fecha_ingreso == date.today()

    def test_miembro_default_values(self):
        """Test Miembro default values."""
        user_id = "12345678-1234-5678-1234-567812345678"
        miembro = Miembro(
            user_id=user_id,
            voz="Alto",
            fecha_ingreso=date.today(),
        )
        assert miembro.estado == "activo"
        assert miembro.saldo_actual == 0

    def test_miembro_id_is_uuid(self):
        """Test that Miembro ID is UUID."""
        miembro = Miembro(
            user_id="12345678-1234-5678-1234-567812345678",
            voz="Tenor",
            fecha_ingreso=date.today(),
        )
        assert isinstance(miembro.id, UUID)

    def test_miembro_tablename(self):
        """Test Miembro table name."""
        assert Miembro.__tablename__ == "miembros"


class TestEventoPublicoModel:
    """Tests for EventoPublico model."""

    def test_evento_instantiation(self):
        """Test creating an EventoPublico instance."""
        created_by = "12345678-1234-5678-1234-567812345678"
        evento = EventoPublico(
            nombre="Concierto de Primavera",
            descripcion="Un concierto maravilloso",
            fecha=date.today(),
            hora="19:30",
            lugar="Teatro Municipal",
            tipo="concierto",
            estado="planificado",
            created_by=created_by,
        )
        assert evento.nombre == "Concierto de Primavera"
        assert evento.hora == "19:30"
        assert evento.tipo == "concierto"

    def test_evento_default_estado(self):
        """Test EventoPublico default estado."""
        evento = EventoPublico(
            nombre="Evento",
            fecha=date.today(),
            hora="19:30",
            lugar="Lugar",
            tipo="concierto",
            created_by="12345678-1234-5678-1234-567812345678",
        )
        assert evento.estado == "planificado"

    def test_evento_tablename(self):
        """Test EventoPublico table name."""
        assert EventoPublico.__tablename__ == "eventos_publicos"


class TestEnsayoModel:
    """Tests for Ensayo model."""

    def test_ensayo_instantiation(self):
        """Test creating an Ensayo instance."""
        created_by = "12345678-1234-5678-1234-567812345678"
        ensayo = Ensayo(
            tipo="general",
            nombre="Ensayo General",
            fecha=date.today(),
            hora="18:00",
            lugar="Sala de Ensayos",
            created_by=created_by,
        )
        assert ensayo.tipo == "general"
        assert ensayo.nombre == "Ensayo General"

    def test_ensayo_tablename(self):
        """Test Ensayo table name."""
        assert Ensayo.__tablename__ == "ensayos"


class TestAsistenciaModel:
    """Tests for Asistencia model."""

    def test_asistencia_instantiation(self):
        """Test creating an Asistencia instance."""
        miembro_id = "12345678-1234-5678-1234-567812345678"
        ensayo_id = "87654321-4321-8765-4321-876543218765"
        registrado_por = "11111111-2222-3333-4444-555555555555"

        asistencia = Asistencia(
            miembro_id=miembro_id,
            ensayo_id=ensayo_id,
            presente=True,
            registrado_por=registrado_por,
        )
        assert asistencia.presente is True
        assert asistencia.miembro_id == miembro_id

    def test_asistencia_default_values(self):
        """Test Asistencia default values."""
        asistencia = Asistencia(
            miembro_id="12345678-1234-5678-1234-567812345678",
            ensayo_id="87654321-4321-8765-4321-876543218765",
            registrado_por="11111111-2222-3333-4444-555555555555",
        )
        assert asistencia.presente is True
        assert isinstance(asistencia.registrado_en, datetime)

    def test_asistencia_tablename(self):
        """Test Asistencia table name."""
        assert Asistencia.__tablename__ == "asistencias"


class TestCuotaModel:
    """Tests for Cuota model."""

    def test_cuota_instantiation(self):
        """Test creating a Cuota instance."""
        miembro_id = "12345678-1234-5678-1234-567812345678"
        created_by = "87654321-4321-8765-4321-876543218765"

        cuota = Cuota(
            miembro_id=miembro_id,
            monto=100.50,
            descripcion="Cuota mensual",
            tipo="regular",
            fecha_vencimiento=date.today(),
            created_by=created_by,
        )
        assert cuota.monto == 100.50
        assert cuota.tipo == "regular"

    def test_cuota_default_estado(self):
        """Test Cuota default estado."""
        cuota = Cuota(
            miembro_id="12345678-1234-5678-1234-567812345678",
            monto=100,
            fecha_vencimiento=date.today(),
            created_by="87654321-4321-8765-4321-876543218765",
        )
        assert cuota.estado == "pendiente"

    def test_cuota_tablename(self):
        """Test Cuota table name."""
        assert Cuota.__tablename__ == "cuotas"


class TestComunicadoModel:
    """Tests for Comunicado model."""

    def test_comunicado_instantiation(self):
        """Test creating a Comunicado instance."""
        enviado_por = "12345678-1234-5678-1234-567812345678"

        comunicado = Comunicado(
            titulo="Aviso Importante",
            contenido="Este es el contenido del comunicado.",
            enviado_por=enviado_por,
        )
        assert comunicado.titulo == "Aviso Importante"
        assert comunicado.contenido == "Este es el contenido del comunicado."

    def test_comunicado_tablename(self):
        """Test Comunicado table name."""
        assert Comunicado.__tablename__ == "comunicados"


class TestArchivoModel:
    """Tests for Archivo model."""

    def test_archivo_instantiation(self):
        """Test creating an Archivo instance."""
        subido_por = "12345678-1234-5678-1234-567812345678"

        archivo = Archivo(
            nombre="Partitura.pdf",
            tipo="partitura",
            url="https://example.com/file.pdf",
            subido_por=subido_por,
        )
        assert archivo.nombre == "Partitura.pdf"
        assert archivo.tipo == "partitura"

    def test_archivo_default_privado(self):
        """Test Archivo default privado value."""
        archivo = Archivo(
            nombre="File",
            tipo="otro",
            url="https://example.com/file",
            subido_por="12345678-1234-5678-1234-567812345678",
        )
        assert archivo.privado is True

    def test_archivo_tablename(self):
        """Test Archivo table name."""
        assert Archivo.__tablename__ == "archivos"
