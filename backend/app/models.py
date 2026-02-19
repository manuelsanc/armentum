"""
SQLAlchemy ORM Models
Database table definitions
"""

from sqlalchemy import Column, String, Boolean, DateTime, Date, Numeric, Text, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    nombre = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    email_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __init__(self, **kwargs):
        # Ensure default values on instantiation
        if 'id' not in kwargs:
            kwargs['id'] = uuid.uuid4()
        if 'is_active' not in kwargs:
            kwargs['is_active'] = True
        if 'email_verified' not in kwargs:
            kwargs['email_verified'] = False
        if 'created_at' not in kwargs:
            kwargs['created_at'] = datetime.utcnow()
        super().__init__(**kwargs)

    roles = relationship("UserRole", back_populates="user")
    miembro = relationship("Miembro", back_populates="user", uselist=False)


class Role(Base):
    __tablename__ = "roles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nombre = Column(String(100), unique=True, nullable=False)
    descripcion = Column(Text)
    permisos = Column(JSON, default={})
    created_at = Column(DateTime, default=datetime.utcnow)

    def __init__(self, **kwargs):
        # Ensure default values on instantiation
        if 'id' not in kwargs:
            kwargs['id'] = uuid.uuid4()
        if 'permisos' not in kwargs:
            kwargs['permisos'] = {}
        if 'created_at' not in kwargs:
            kwargs['created_at'] = datetime.utcnow()
        super().__init__(**kwargs)

    users = relationship("UserRole", back_populates="role")


class UserRole(Base):
    __tablename__ = "users_roles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role_id = Column(UUID(as_uuid=True), ForeignKey("roles.id", ondelete="CASCADE"), nullable=False)

    user = relationship("User", back_populates="roles")
    role = relationship("Role", back_populates="users")


class Miembro(Base):
    __tablename__ = "miembros"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    voz = Column(String(50), nullable=False)
    fecha_ingreso = Column(Date, nullable=False)
    estado = Column(String(50), default="activo")
    telefono = Column(String(20))
    saldo_actual = Column(Numeric(10, 2), default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __init__(self, **kwargs):
        # Ensure default values on instantiation
        if 'id' not in kwargs:
            kwargs['id'] = uuid.uuid4()
        if 'estado' not in kwargs:
            kwargs['estado'] = 'activo'
        if 'saldo_actual' not in kwargs:
            kwargs['saldo_actual'] = 0
        if 'created_at' not in kwargs:
            kwargs['created_at'] = datetime.utcnow()
        super().__init__(**kwargs)

    user = relationship("User", back_populates="miembro")
    asistencias = relationship("Asistencia", back_populates="miembro")
    cuotas = relationship("Cuota", back_populates="miembro")


class EventoPublico(Base):
    __tablename__ = "eventos_publicos"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nombre = Column(String(255), nullable=False)
    descripcion = Column(Text)
    fecha = Column(Date, nullable=False)
    hora = Column(String(10), nullable=False)
    lugar = Column(String(255), nullable=False)
    tipo = Column(String(50), nullable=False)
    estado = Column(String(50), default="planificado")
    imagen_url = Column(String(255))
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __init__(self, **kwargs):
        # Ensure default values on instantiation
        if 'id' not in kwargs:
            kwargs['id'] = uuid.uuid4()
        if 'estado' not in kwargs:
            kwargs['estado'] = 'planificado'
        if 'created_at' not in kwargs:
            kwargs['created_at'] = datetime.utcnow()
        super().__init__(**kwargs)


class Ensayo(Base):
    __tablename__ = "ensayos"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tipo = Column(String(50), nullable=False)
    nombre = Column(String(255))
    fecha = Column(Date, nullable=False)
    hora = Column(String(10), nullable=False)
    lugar = Column(String(255), nullable=False)
    cuerdas = Column(String(255))
    descripcion = Column(Text)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    asistencias = relationship("Asistencia", back_populates="ensayo")


class Asistencia(Base):
    __tablename__ = "asistencias"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    miembro_id = Column(UUID(as_uuid=True), ForeignKey("miembros.id", ondelete="CASCADE"), nullable=False)
    ensayo_id = Column(UUID(as_uuid=True), ForeignKey("ensayos.id", ondelete="CASCADE"), nullable=False)
    presente = Column(Boolean, default=True)
    justificacion = Column(Text)
    registrado_por = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    registrado_en = Column(DateTime, default=datetime.utcnow)

    def __init__(self, **kwargs):
        # Ensure default values on instantiation
        if 'id' not in kwargs:
            kwargs['id'] = uuid.uuid4()
        if 'presente' not in kwargs:
            kwargs['presente'] = True
        if 'registrado_en' not in kwargs:
            kwargs['registrado_en'] = datetime.utcnow()
        super().__init__(**kwargs)

    miembro = relationship("Miembro", back_populates="asistencias")
    ensayo = relationship("Ensayo", back_populates="asistencias")


class Cuota(Base):
    __tablename__ = "cuotas"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    miembro_id = Column(UUID(as_uuid=True), ForeignKey("miembros.id", ondelete="CASCADE"), nullable=False)
    monto = Column(Numeric(10, 2), nullable=False)
    descripcion = Column(String(255))
    tipo = Column(String(50), default="regular")
    fecha_vencimiento = Column(Date, nullable=False)
    estado = Column(String(50), default="pendiente")
    fecha_pago = Column(Date)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    def __init__(self, **kwargs):
        # Ensure default values on instantiation
        if 'id' not in kwargs:
            kwargs['id'] = uuid.uuid4()
        if 'tipo' not in kwargs:
            kwargs['tipo'] = 'regular'
        if 'estado' not in kwargs:
            kwargs['estado'] = 'pendiente'
        if 'created_at' not in kwargs:
            kwargs['created_at'] = datetime.utcnow()
        super().__init__(**kwargs)

    miembro = relationship("Miembro", back_populates="cuotas")


class Comunicado(Base):
    __tablename__ = "comunicados"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    titulo = Column(String(255), nullable=False)
    contenido = Column(Text, nullable=False)
    dirigido_a = Column(String(50))
    grupo_destino = Column(String(255))
    miembro_destino = Column(UUID(as_uuid=True))
    enviado_por = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    programado_para = Column(DateTime)
    enviado_en = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)


class Archivo(Base):
    __tablename__ = "archivos"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nombre = Column(String(255), nullable=False)
    tipo = Column(String(50), nullable=False)
    voz = Column(String(50))
    evento_id = Column(UUID(as_uuid=True), ForeignKey("eventos_publicos.id"))
    ensayo_id = Column(UUID(as_uuid=True), ForeignKey("ensayos.id"))
    url = Column(String(255), nullable=False)
    privado = Column(Boolean, default=True)
    subido_por = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    def __init__(self, **kwargs):
        # Ensure default values on instantiation
        if 'id' not in kwargs:
            kwargs['id'] = uuid.uuid4()
        if 'privado' not in kwargs:
            kwargs['privado'] = True
        if 'created_at' not in kwargs:
            kwargs['created_at'] = datetime.utcnow()
        super().__init__(**kwargs)
