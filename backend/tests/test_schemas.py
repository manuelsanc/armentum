"""
Tests for Pydantic schema validation
"""

import pytest
from pydantic import ValidationError
from datetime import date, datetime
from uuid import uuid4

from app.schemas import (
    UserCreate,
    UserLogin,
    UserUpdate,
    UserResponse,
    Token,
    TokenData,
    MiembroCreate,
    MiembroUpdate,
    EventoPublicoCreate,
    EventoPublicoUpdate,
    EnsayoCreate,
    EnsayoUpdate,
    AsistenciaCreate,
    AsistenciaUpdate,
    CuotaCreate,
    CuotaUpdate,
    ComunicadoCreate,
    ArchivoCreate,
    RoleCreate,
)


class TestUserSchemas:
    """Tests for User-related schemas."""

    def test_user_create_valid(self):
        """Test valid UserCreate schema."""
        user = UserCreate(
            email="test@example.com",
            nombre="Test User",
            password="securepassword123",
        )
        assert user.email == "test@example.com"
        assert user.nombre == "Test User"
        assert user.password == "securepassword123"
        assert user.es_admin is False

    def test_user_create_with_admin_flag(self):
        """Test UserCreate with admin flag."""
        user = UserCreate(
            email="admin@example.com",
            nombre="Admin User",
            password="adminpassword123",
            es_admin=True,
        )
        assert user.es_admin is True

    def test_user_create_invalid_email(self):
        """Test UserCreate with invalid email."""
        with pytest.raises(ValidationError) as exc_info:
            UserCreate(
                email="invalid-email",
                nombre="Test User",
                password="securepassword123",
            )
        assert "email" in str(exc_info.value)

    def test_user_create_short_password(self):
        """Test UserCreate with password too short."""
        with pytest.raises(ValidationError) as exc_info:
            UserCreate(
                email="test@example.com",
                nombre="Test User",
                password="short",
            )
        assert "password" in str(exc_info.value)

    def test_user_create_short_nombre(self):
        """Test UserCreate with nombre too short."""
        with pytest.raises(ValidationError) as exc_info:
            UserCreate(
                email="test@example.com",
                nombre="X",
                password="securepassword123",
            )
        assert "nombre" in str(exc_info.value)

    def test_user_create_missing_fields(self):
        """Test UserCreate with missing required fields."""
        with pytest.raises(ValidationError):
            UserCreate()
        with pytest.raises(ValidationError):
            UserCreate(email="test@example.com")

    def test_user_login_valid(self):
        """Test valid UserLogin schema."""
        login = UserLogin(
            email="test@example.com",
            password="securepassword123",
        )
        assert login.email == "test@example.com"
        assert login.password == "securepassword123"

    def test_user_login_invalid_email(self):
        """Test UserLogin with invalid email."""
        with pytest.raises(ValidationError):
            UserLogin(email="not-an-email", password="password123")

    def test_user_update_partial(self):
        """Test UserUpdate with partial data."""
        update = UserUpdate(nombre="New Name")
        assert update.nombre == "New Name"
        assert update.email is None

    def test_user_update_invalid_nombre(self):
        """Test UserUpdate with invalid nombre."""
        with pytest.raises(ValidationError):
            UserUpdate(nombre="X")


class TestAuthSchemas:
    """Tests for Auth-related schemas."""

    def test_token_valid(self):
        """Test valid Token schema."""
        token = Token(
            access_token="access_token_value",
            refresh_token="refresh_token_value",
        )
        assert token.access_token == "access_token_value"
        assert token.refresh_token == "refresh_token_value"
        assert token.token_type == "bearer"
        assert token.expires_in == 1800

    def test_token_data_valid(self):
        """Test valid TokenData schema."""
        token_data = TokenData(user_id="123", roles=["admin", "user"])
        assert token_data.user_id == "123"
        assert token_data.roles == ["admin", "user"]

    def test_token_data_empty(self):
        """Test TokenData with empty values."""
        token_data = TokenData()
        assert token_data.user_id is None
        assert token_data.roles == []


class TestMiembroSchemas:
    """Tests for Miembro-related schemas."""

    def test_miembro_create_valid(self):
        """Test valid MiembroCreate schema."""
        user_id = uuid4()
        miembro = MiembroCreate(
            user_id=user_id,
            voz="Soprano",
            fecha_ingreso=date.today(),
        )
        assert miembro.user_id == user_id
        assert miembro.voz == "Soprano"
        assert miembro.estado == "activo"

    def test_miembro_create_invalid_voz(self):
        """Test MiembroCreate with invalid voz."""
        with pytest.raises(ValidationError) as exc_info:
            MiembroCreate(
                user_id=uuid4(),
                voz="InvalidVoice",
                fecha_ingreso=date.today(),
            )
        assert "voz" in str(exc_info.value)

    def test_miembro_create_invalid_estado(self):
        """Test MiembroCreate with invalid estado."""
        with pytest.raises(ValidationError) as exc_info:
            MiembroCreate(
                user_id=uuid4(),
                voz="Alto",
                fecha_ingreso=date.today(),
                estado="invalid_state",
            )
        assert "estado" in str(exc_info.value)

    def test_miembro_create_all_voz_types(self):
        """Test MiembroCreate with all valid voz types."""
        for voz in ["Soprano", "Alto", "Tenor", "Bajo"]:
            miembro = MiembroCreate(
                user_id=uuid4(),
                voz=voz,
                fecha_ingreso=date.today(),
            )
            assert miembro.voz == voz

    def test_miembro_update_partial(self):
        """Test MiembroUpdate with partial data."""
        update = MiembroUpdate(voz="Tenor")
        assert update.voz == "Tenor"
        assert update.estado is None


class TestEventoSchemas:
    """Tests for Evento-related schemas."""

    def test_evento_create_valid(self):
        """Test valid EventoPublicoCreate schema."""
        evento = EventoPublicoCreate(
            nombre="Concierto de Primavera",
            fecha=date.today(),
            hora="19:30",
            lugar="Teatro Municipal",
        )
        assert evento.nombre == "Concierto de Primavera"
        assert evento.hora == "19:30"
        assert evento.tipo == "concierto"

    def test_evento_create_invalid_hora(self):
        """Test EventoPublicoCreate with invalid hora format."""
        with pytest.raises(ValidationError) as exc_info:
            EventoPublicoCreate(
                nombre="Evento",
                fecha=date.today(),
                hora="25:00",
                lugar="Lugar",
            )
        assert "hora" in str(exc_info.value)

    def test_evento_create_invalid_tipo(self):
        """Test EventoPublicoCreate with invalid tipo."""
        with pytest.raises(ValidationError) as exc_info:
            EventoPublicoCreate(
                nombre="Evento",
                fecha=date.today(),
                hora="19:30",
                lugar="Lugar",
                tipo="invalid_type",
            )
        assert "tipo" in str(exc_info.value)

    def test_evento_create_all_tipos(self):
        """Test EventoPublicoCreate with all valid tipos."""
        for tipo in ["concierto", "actividad", "otro"]:
            evento = EventoPublicoCreate(
                nombre="Evento",
                fecha=date.today(),
                hora="19:30",
                lugar="Lugar",
                tipo=tipo,
            )
            assert evento.tipo == tipo


class TestEnsayoSchemas:
    """Tests for Ensayo-related schemas."""

    def test_ensayo_create_valid(self):
        """Test valid EnsayoCreate schema."""
        ensayo = EnsayoCreate(
            tipo="general",
            fecha=date.today(),
            hora="18:00",
            lugar="Sala de Ensayos",
        )
        assert ensayo.tipo == "general"
        assert ensayo.lugar == "Sala de Ensayos"

    def test_ensayo_create_invalid_tipo(self):
        """Test EnsayoCreate with invalid tipo."""
        with pytest.raises(ValidationError) as exc_info:
            EnsayoCreate(
                tipo="invalid_tipo",
                fecha=date.today(),
                hora="18:00",
                lugar="Lugar",
            )
        assert "tipo" in str(exc_info.value)

    def test_ensayo_create_all_tipos(self):
        """Test EnsayoCreate with all valid tipos."""
        for tipo in ["general", "seccional", "otra_actividad"]:
            ensayo = EnsayoCreate(
                tipo=tipo,
                fecha=date.today(),
                hora="18:00",
                lugar="Lugar",
            )
            assert ensayo.tipo == tipo


class TestAsistenciaSchemas:
    """Tests for Asistencia-related schemas."""

    def test_asistencia_create_valid(self):
        """Test valid AsistenciaCreate schema."""
        miembro_id = uuid4()
        ensayo_id = uuid4()
        asistencia = AsistenciaCreate(
            miembro_id=miembro_id,
            ensayo_id=ensayo_id,
            presente=True,
        )
        assert asistencia.presente is True
        assert asistencia.miembro_id == miembro_id

    def test_asistencia_create_with_justificacion(self):
        """Test AsistenciaCreate with justification."""
        asistencia = AsistenciaCreate(
            miembro_id=uuid4(),
            ensayo_id=uuid4(),
            presente=False,
            justificacion="Enfermedad",
        )
        assert asistencia.presente is False
        assert asistencia.justificacion == "Enfermedad"

    def test_asistencia_update_partial(self):
        """Test AsistenciaUpdate with partial data."""
        update = AsistenciaUpdate(presente=False)
        assert update.presente is False
        assert update.justificacion is None


class TestCuotaSchemas:
    """Tests for Cuota-related schemas."""

    def test_cuota_create_valid(self):
        """Test valid CuotaCreate schema."""
        cuota = CuotaCreate(
            miembro_id=uuid4(),
            monto=100.50,
            fecha_vencimiento=date.today(),
        )
        assert cuota.monto == 100.50
        assert cuota.tipo == "regular"

    def test_cuota_create_zero_monto(self):
        """Test CuotaCreate with zero monto (invalid)."""
        with pytest.raises(ValidationError) as exc_info:
            CuotaCreate(
                miembro_id=uuid4(),
                monto=0,
                fecha_vencimiento=date.today(),
            )
        assert "monto" in str(exc_info.value)

    def test_cuota_create_negative_monto(self):
        """Test CuotaCreate with negative monto (invalid)."""
        with pytest.raises(ValidationError) as exc_info:
            CuotaCreate(
                miembro_id=uuid4(),
                monto=-10,
                fecha_vencimiento=date.today(),
            )
        assert "monto" in str(exc_info.value)

    def test_cuota_create_invalid_tipo(self):
        """Test CuotaCreate with invalid tipo."""
        with pytest.raises(ValidationError) as exc_info:
            CuotaCreate(
                miembro_id=uuid4(),
                monto=100,
                fecha_vencimiento=date.today(),
                tipo="invalid",
            )
        assert "tipo" in str(exc_info.value)


class TestComunicadoSchemas:
    """Tests for Comunicado-related schemas."""

    def test_comunicado_create_valid(self):
        """Test valid ComunicadoCreate schema."""
        comunicado = ComunicadoCreate(
            titulo="Aviso Importante",
            contenido="Este es el contenido del comunicado.",
        )
        assert comunicado.titulo == "Aviso Importante"
        assert comunicado.contenido == "Este es el contenido del comunicado."

    def test_comunicado_create_short_titulo(self):
        """Test ComunicadoCreate with short titulo."""
        with pytest.raises(ValidationError) as exc_info:
            ComunicadoCreate(titulo="X", contenido="Contenido")
        assert "titulo" in str(exc_info.value)

    def test_comunicado_create_empty_contenido(self):
        """Test ComunicadoCreate with empty contenido."""
        with pytest.raises(ValidationError) as exc_info:
            ComunicadoCreate(titulo="Titulo", contenido="")
        assert "contenido" in str(exc_info.value)

    def test_comunicado_create_invalid_dirigido_a(self):
        """Test ComunicadoCreate with invalid dirigido_a."""
        with pytest.raises(ValidationError) as exc_info:
            ComunicadoCreate(
                titulo="Titulo",
                contenido="Contenido",
                dirigido_a="invalid_option",
            )
        assert "dirigido_a" in str(exc_info.value)


class TestArchivoSchemas:
    """Tests for Archivo-related schemas."""

    def test_archivo_create_valid(self):
        """Test valid ArchivoCreate schema."""
        archivo = ArchivoCreate(
            nombre="Partitura.pdf",
            tipo="partitura",
            url="https://example.com/file.pdf",
        )
        assert archivo.nombre == "Partitura.pdf"
        assert archivo.tipo == "partitura"
        assert archivo.privado is True

    def test_archivo_create_invalid_tipo(self):
        """Test ArchivoCreate with invalid tipo."""
        with pytest.raises(ValidationError) as exc_info:
            ArchivoCreate(
                nombre="File",
                tipo="invalid_tipo",
                url="https://example.com/file",
            )
        assert "tipo" in str(exc_info.value)

    def test_archivo_create_with_voz(self):
        """Test ArchivoCreate with voz specified."""
        archivo = ArchivoCreate(
            nombre="Partitura Soprano.pdf",
            tipo="partitura",
            url="https://example.com/file.pdf",
            voz="Soprano",
        )
        assert archivo.voz == "Soprano"


class TestRoleSchemas:
    """Tests for Role-related schemas."""

    def test_role_create_valid(self):
        """Test valid RoleCreate schema."""
        role = RoleCreate(
            nombre="Admin",
            descripcion="Administrator role",
            permisos={"read": True, "write": True},
        )
        assert role.nombre == "Admin"
        assert role.permisos == {"read": True, "write": True}

    def test_role_create_short_nombre(self):
        """Test RoleCreate with short nombre."""
        with pytest.raises(ValidationError) as exc_info:
            RoleCreate(nombre="X")
        assert "nombre" in str(exc_info.value)

    def test_role_create_default_permisos(self):
        """Test RoleCreate with default permisos."""
        role = RoleCreate(nombre="User")
        assert role.permisos == {}
