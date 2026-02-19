"""
Pydantic Schemas for API Request/Response Validation
Based on API_SPECIFICATION.md
"""

from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional
from datetime import datetime, date
from uuid import UUID


# ============================================================
# USER SCHEMAS
# ============================================================

class UserBase(BaseModel):
    email: EmailStr
    nombre: str = Field(..., min_length=2, max_length=255)


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=100)
    es_admin: bool = False


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: UUID
    is_active: bool = True
    email_verified: bool = False
    roles: list[str] = []
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserUpdate(BaseModel):
    nombre: Optional[str] = Field(None, min_length=2, max_length=255)
    email: Optional[EmailStr] = None


# ============================================================
# AUTH SCHEMAS
# ============================================================

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = 1800


class TokenData(BaseModel):
    user_id: Optional[str] = None
    roles: list[str] = []


class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = 1800
    user: UserResponse


class RefreshTokenRequest(BaseModel):
    refresh_token: str


# ============================================================
# MEMBER (MIEMBRO) SCHEMAS
# ============================================================

class MiembroBase(BaseModel):
    voz: str = Field(..., pattern="^(Soprano|Alto|Tenor|Bajo)$")
    fecha_ingreso: date
    telefono: Optional[str] = Field(None, max_length=20)


class MiembroCreate(MiembroBase):
    user_id: UUID
    estado: str = Field("activo", pattern="^(activo|inactivo|suspendido)$")


class MiembroResponse(MiembroBase):
    id: UUID
    user_id: UUID
    estado: str
    saldo_actual: float = 0.0
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MiembroUpdate(BaseModel):
    voz: Optional[str] = Field(None, pattern="^(Soprano|Alto|Tenor|Bajo)$")
    estado: Optional[str] = Field(None, pattern="^(activo|inactivo|suspendido)$")
    telefono: Optional[str] = Field(None, max_length=20)


# ============================================================
# EVENT (EVENTO PUBLICO) SCHEMAS
# ============================================================

class EventoPublicoBase(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=255)
    descripcion: Optional[str] = None
    fecha: date
    hora: str = Field(..., pattern="^([01]?[0-9]|2[0-3]):[0-5][0-9]$")
    lugar: str = Field(..., min_length=2, max_length=255)
    tipo: str = Field("concierto", pattern="^(concierto|actividad|otro)$")
    estado: str = Field("planificado", pattern="^(planificado|en_curso|finalizado|cancelado)$")
    imagen_url: Optional[str] = None


class EventoPublicoCreate(EventoPublicoBase):
    pass


class EventoPublicoResponse(EventoPublicoBase):
    id: UUID
    created_by: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class EventoPublicoUpdate(BaseModel):
    nombre: Optional[str] = Field(None, min_length=2, max_length=255)
    descripcion: Optional[str] = None
    fecha: Optional[date] = None
    hora: Optional[str] = Field(None, pattern="^([01]?[0-9]|2[0-3]):[0-5][0-9]$")
    lugar: Optional[str] = Field(None, min_length=2, max_length=255)
    tipo: Optional[str] = Field(None, pattern="^(concierto|actividad|otro)$")
    estado: Optional[str] = Field(None, pattern="^(planificado|en_curso|finalizado|cancelado)$")
    imagen_url: Optional[str] = None


# ============================================================
# REHEARSAL (ENSAYO) SCHEMAS
# ============================================================

class EnsayoBase(BaseModel):
    tipo: str = Field(..., pattern="^(general|seccional|otra_actividad)$")
    nombre: Optional[str] = Field(None, max_length=255)
    fecha: date
    hora: str = Field(..., pattern="^([01]?[0-9]|2[0-3]):[0-5][0-9]$")
    lugar: str = Field(..., min_length=2, max_length=255)
    cuerdas: Optional[str] = None
    descripcion: Optional[str] = None


class EnsayoCreate(EnsayoBase):
    pass


class EnsayoResponse(EnsayoBase):
    id: UUID
    created_by: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class EnsayoUpdate(BaseModel):
    tipo: Optional[str] = Field(None, pattern="^(general|seccional|otra_actividad)$")
    nombre: Optional[str] = Field(None, max_length=255)
    fecha: Optional[date] = None
    hora: Optional[str] = Field(None, pattern="^([01]?[0-9]|2[0-3]):[0-5][0-9]$")
    lugar: Optional[str] = Field(None, min_length=2, max_length=255)
    cuerdas: Optional[str] = None
    descripcion: Optional[str] = None


# ============================================================
# ATTENDANCE (ASISTENCIA) SCHEMAS
# ============================================================

class AsistenciaBase(BaseModel):
    presente: bool = True
    justificacion: Optional[str] = None


class AsistenciaCreate(AsistenciaBase):
    miembro_id: UUID
    ensayo_id: UUID


class AsistenciaResponse(AsistenciaBase):
    id: UUID
    miembro_id: UUID
    ensayo_id: UUID
    registrado_por: UUID
    registrado_en: datetime

    model_config = ConfigDict(from_attributes=True)


class AsistenciaUpdate(BaseModel):
    presente: Optional[bool] = None
    justificacion: Optional[str] = None


# ============================================================
# FINANCE (CUOTA) SCHEMAS
# ============================================================

class CuotaBase(BaseModel):
    monto: float = Field(..., gt=0)
    descripcion: Optional[str] = Field(None, max_length=255)
    tipo: str = Field("regular", pattern="^(regular|extraordinaria)$")
    fecha_vencimiento: date


class CuotaCreate(CuotaBase):
    miembro_id: UUID


class CuotaResponse(CuotaBase):
    id: UUID
    miembro_id: UUID
    estado: str
    fecha_pago: Optional[date] = None
    created_by: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CuotaUpdate(BaseModel):
    monto: Optional[float] = Field(None, gt=0)
    descripcion: Optional[str] = Field(None, max_length=255)
    tipo: Optional[str] = Field(None, pattern="^(regular|extraordinaria)$")
    fecha_vencimiento: Optional[date] = None
    estado: Optional[str] = Field(None, pattern="^(pendiente|pagado|atrasado)$")
    fecha_pago: Optional[date] = None


# ============================================================
# COMMUNICATION (COMUNICADO) SCHEMAS
# ============================================================

class ComunicadoBase(BaseModel):
    titulo: str = Field(..., min_length=2, max_length=255)
    contenido: str = Field(..., min_length=1)
    dirigido_a: Optional[str] = Field(None, pattern="^(todos|grupo|individual)$")
    grupo_destino: Optional[str] = None
    miembro_destino: Optional[UUID] = None
    programado_para: Optional[datetime] = None


class ComunicadoCreate(ComunicadoBase):
    pass


class ComunicadoResponse(ComunicadoBase):
    id: UUID
    enviado_por: UUID
    enviado_en: Optional[datetime] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================
# FILE (ARCHIVO) SCHEMAS
# ============================================================

class ArchivoBase(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=255)
    tipo: str = Field(..., pattern="^(partitura|grabacion|otro)$")
    voz: Optional[str] = Field(None, pattern="^(Soprano|Alto|Tenor|Bajo)$")
    evento_id: Optional[UUID] = None
    ensayo_id: Optional[UUID] = None
    privado: bool = True


class ArchivoCreate(ArchivoBase):
    url: str


class ArchivoResponse(ArchivoBase):
    id: UUID
    url: str
    subido_por: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================
# ROLE SCHEMAS
# ============================================================

class RoleBase(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=100)
    descripcion: Optional[str] = None


class RoleCreate(RoleBase):
    permisos: dict = {}


class RoleResponse(RoleBase):
    id: UUID
    permisos: dict
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================
# COMMON SCHEMAS
# ============================================================

class Message(BaseModel):
    message: str


class PaginatedResponse(BaseModel):
    total: int
    page: int
    per_page: int
    has_next: bool
 
# ============================================================
# PUBLIC PAGES (PÁGINAS) SCHEMAS
# ============================================================
class PageResponse(BaseModel):
    slug: str
    title: str
    content: str
