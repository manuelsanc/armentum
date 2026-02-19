"""Admin only APIs for members, events, rehearsals, attendance, and finance."""

from datetime import date, datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import and_, func, or_
from sqlalchemy.orm import Session

from app.auth.dependencies import require_admin
from app.auth.jwt import get_password_hash
from app.database import get_db
from app.models import (
    Asistencia,
    Cuota,
    Ensayo,
    EventoPublico,
    Miembro,
    Role,
    User,
    UserRole,
)
from app.schemas import (
    AdminAttendanceReportResponse,
    AdminAttendanceReportRecord,
    AdminFinancePaymentRequest,
    AdminFinanceReportResponse,
    AdminMemberCreate,
    AdminMemberListResponse,
    AdminMemberResponse,
    AdminMemberUpdate,
    AsistenciaCreate,
    AsistenciaResponse,
    CuotaCreate,
    CuotaResponse,
    EventoPublicoCreate,
    EventoPublicoResponse,
    EventoPublicoUpdate,
    EnsayoCreate,
    EnsayoResponse,
    EnsayoUpdate,
    Message,
)


router = APIRouter()


def _member_to_response(member: Miembro) -> AdminMemberResponse:
    user = member.user
    return AdminMemberResponse(
        id=member.id,
        nombre=user.nombre,
        email=user.email,
        voz=member.voz,
        estado=member.estado,
        fecha_ingreso=member.fecha_ingreso,
        telefono=member.telefono,
        saldo_actual=member.saldo_actual,
    )


@router.get("/members", response_model=AdminMemberListResponse)
def list_members(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    search: Optional[str] = Query(None, min_length=1),
    estado: Optional[str] = Query(
        None,
        pattern="^(activo|inactivo|suspendido)$",
    ),
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    query = db.query(Miembro).join(User)
    if estado:
        query = query.filter(Miembro.estado == estado)
    if search:
        term = f"%{search.lower()}%"
        query = query.filter(
            or_(
                func.lower(User.nombre).like(term),
                func.lower(User.email).like(term),
            )
        )
    total = query.count()
    members = (
        query.order_by(Miembro.fecha_ingreso.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return AdminMemberListResponse(
        total=total,
        limit=limit,
        offset=offset,
        members=[_member_to_response(member) for member in members],
    )


@router.get("/events", response_model=dict)
def list_events(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    """List all public events with pagination."""
    offset = (page - 1) * limit
    total = db.query(EventoPublico).count()
    events = (
        db.query(EventoPublico)
        .order_by(EventoPublico.fecha.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return {
        "events": [
            {
                "id": str(e.id),
                "nombre": e.nombre,
                "descripcion": e.descripcion,
                "fecha": str(e.fecha),
                "hora": e.hora,
                "lugar": e.lugar,
                "tipo": e.tipo,
                "estado": e.estado,
                "imagen_url": e.imagen_url,
                "created_at": e.created_at.isoformat() if e.created_at else None,
            }
            for e in events
        ],
        "total": total,
    }


@router.get("/rehearsals", response_model=dict)
def list_rehearsals(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    """List all rehearsals with pagination."""
    offset = (page - 1) * limit
    total = db.query(Ensayo).count()
    rehearsals = (
        db.query(Ensayo)
        .order_by(Ensayo.fecha.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return {
        "rehearsals": [
            {
                "id": str(r.id),
                "titulo": r.nombre,
                "descripcion": r.descripcion,
                "fecha": str(r.fecha),
                "horaInicio": r.hora,
                "horaFin": None,
                "lugar": r.lugar,
                "estado": "scheduled",
                "tipo": r.tipo,
                "cuerdas": r.cuerdas,
                "created_at": r.created_at.isoformat() if r.created_at else None,
            }
            for r in rehearsals
        ],
        "total": total,
    }


@router.post(
    "/members",
    response_model=AdminMemberResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_member(
    payload: AdminMemberCreate,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    existing_user = db.query(User).filter(User.email == payload.email).first()
    if existing_user and existing_user.miembro:
        raise HTTPException(status_code=400, detail="Member already exists")

    if not existing_user:
        user = User(
            email=payload.email,
            password_hash=get_password_hash(payload.password),
            nombre=payload.nombre,
            is_active=True,
        )
        db.add(user)
        db.flush()
    else:
        user = existing_user
        user.nombre = payload.nombre

    corista_role = db.query(Role).filter(Role.nombre == "corista").first()
    if not corista_role:
        corista_role = Role(nombre="corista", descripcion="Rol corista")
        db.add(corista_role)
        db.flush()

    has_role = db.query(UserRole).filter(
        UserRole.user_id == user.id,
        UserRole.role_id == corista_role.id,
    ).first()
    if not has_role:
        db.add(UserRole(user_id=user.id, role_id=corista_role.id))

    miembro = Miembro(
        user_id=user.id,
        voz=payload.voz,
        fecha_ingreso=payload.fecha_ingreso,
        telefono=payload.telefono,
    )
    db.add(miembro)
    db.commit()
    db.refresh(miembro)
    return _member_to_response(miembro)


@router.put("/members/{member_id}", response_model=AdminMemberResponse)
def update_member(
    member_id: UUID,
    payload: AdminMemberUpdate,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    member = db.query(Miembro).filter(Miembro.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    if payload.voz is not None:
        member.voz = payload.voz
    if payload.estado is not None:
        member.estado = payload.estado
    if payload.telefono is not None:
        member.telefono = payload.telefono
    if payload.saldo_actual is not None:
        member.saldo_actual = payload.saldo_actual
    db.commit()
    db.refresh(member)
    return _member_to_response(member)


@router.delete("/members/{member_id}", response_model=Message)
def delete_member(
    member_id: UUID,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    member = db.query(Miembro).filter(Miembro.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    member.estado = "inactivo"
    db.commit()
    return Message(message="Member marked as inactive")


@router.post(
    "/events",
    response_model=EventoPublicoResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_event(
    payload: EventoPublicoCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin),
):
    event = EventoPublico(**payload.model_dump(), created_by=current_admin.id)
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


@router.get("/events/{event_id}", response_model=dict)
def get_event(
    event_id: UUID,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    """Get a specific event by ID."""
    event = db.query(EventoPublico).filter(EventoPublico.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return {
        "id": str(event.id),
        "nombre": event.nombre,
        "descripcion": event.descripcion,
        "fecha": str(event.fecha),
        "hora": event.hora,
        "lugar": event.lugar,
        "tipo": event.tipo,
        "estado": event.estado,
        "imagen_url": event.imagen_url,
        "created_at": event.created_at.isoformat() if event.created_at else None,
    }


@router.put("/events/{event_id}", response_model=EventoPublicoResponse)
def update_event(
    event_id: UUID,
    payload: EventoPublicoUpdate,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    event = db.query(EventoPublico).filter(EventoPublico.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(event, field, value)
    db.commit()
    db.refresh(event)
    return event


@router.delete("/events/{event_id}", response_model=Message)
def delete_event(
    event_id: UUID,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    event = db.query(EventoPublico).filter(EventoPublico.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(event)
    db.commit()
    return Message(message="Event deleted")


@router.post(
    "/rehearsals",
    response_model=EnsayoResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_rehearsal(
    payload: EnsayoCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin),
):
    rehearsal = Ensayo(**payload.model_dump(), created_by=current_admin.id)
    db.add(rehearsal)
    db.commit()
    db.refresh(rehearsal)
    return rehearsal


@router.put("/rehearsals/{rehearsal_id}", response_model=EnsayoResponse)
def update_rehearsal(
    rehearsal_id: UUID,
    payload: EnsayoUpdate,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    rehearsal = db.query(Ensayo).filter(Ensayo.id == rehearsal_id).first()
    if not rehearsal:
        raise HTTPException(status_code=404, detail="Rehearsal not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(rehearsal, field, value)
    db.commit()
    db.refresh(rehearsal)
    return rehearsal


@router.delete("/rehearsals/{rehearsal_id}", response_model=Message)
def delete_rehearsal(
    rehearsal_id: UUID,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    rehearsal = db.query(Ensayo).filter(Ensayo.id == rehearsal_id).first()
    if not rehearsal:
        raise HTTPException(status_code=404, detail="Rehearsal not found")
    db.delete(rehearsal)
    db.commit()
    return Message(message="Rehearsal deleted")


@router.get("/rehearsals/{rehearsal_id}", response_model=dict)
def get_rehearsal(
    rehearsal_id: UUID,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    """Get a specific rehearsal by ID."""
    rehearsal = db.query(Ensayo).filter(Ensayo.id == rehearsal_id).first()
    if not rehearsal:
        raise HTTPException(status_code=404, detail="Rehearsal not found")
    return {
        "id": str(rehearsal.id),
        "titulo": rehearsal.nombre,
        "descripcion": rehearsal.descripcion,
        "fecha": str(rehearsal.fecha),
        "horaInicio": rehearsal.hora,
        "horaFin": None,
        "lugar": rehearsal.lugar,
        "estado": "scheduled",
        "tipo": rehearsal.tipo,
        "cuerdas": rehearsal.cuerdas,
        "created_at": rehearsal.created_at.isoformat() if rehearsal.created_at else None,
    }


@router.get("/rehearsals/{rehearsal_id}/attendance", response_model=list)
def get_rehearsal_attendance(
    rehearsal_id: UUID,
    voz: Optional[str] = Query(None, description="Filtrar por tipo de voz"),
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    """Get all attendance records for a specific rehearsal, optionally filtered by voice."""
    rehearsal = db.query(Ensayo).filter(Ensayo.id == rehearsal_id).first()
    if not rehearsal:
        raise HTTPException(status_code=404, detail="Rehearsal not found")
    
    # Get all members with their attendance for this rehearsal
    query = db.query(Miembro).join(User).filter(Miembro.estado == "activo")
    if voz:
        query = query.filter(Miembro.voz == voz)
    members = query.all()
    
    attendances = db.query(Asistencia).filter(Asistencia.ensayo_id == rehearsal_id).all()
    attendance_map = {str(a.miembro_id): a for a in attendances}
    
    result = []
    for member in members:
        attendance = attendance_map.get(str(member.id))
        result.append({
            "id": str(attendance.id) if attendance else str(member.id),
            "userId": member.user.nombre,
            "nombre": member.user.nombre,
            "voz": member.voz,
            "miembro_id": str(member.id),
            "ensayo_id": str(rehearsal_id),
            "presente": attendance.presente if attendance else False,
            "justificacion": attendance.justificacion if attendance else None,
            "registrado_en": attendance.registrado_en.isoformat() if attendance and attendance.registrado_en else None,
        })
    return result


# Request body for attendance update
from pydantic import BaseModel


class AttendanceUpdateRequest(BaseModel):
    presente: bool = True
    justificacion: Optional[str] = None


@router.put("/rehearsals/{rehearsal_id}/attendance/{attendance_id}", response_model=dict)
def update_rehearsal_attendance(
    rehearsal_id: UUID,
    attendance_id: UUID,
    payload: AttendanceUpdateRequest,
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin),
):
    """Update attendance for a specific member in a rehearsal."""
    # Verify rehearsal exists
    rehearsal = db.query(Ensayo).filter(Ensayo.id == rehearsal_id).first()
    if not rehearsal:
        raise HTTPException(status_code=404, detail="Rehearsal not found")
    
    # Verify member exists
    member = db.query(Miembro).filter(Miembro.id == attendance_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    # Try to find existing attendance record
    attendance = db.query(Asistencia).filter(
        Asistencia.ensayo_id == rehearsal_id,
        Asistencia.miembro_id == attendance_id,
    ).first()
    
    if attendance:
        attendance.presente = payload.presente
        attendance.justificacion = payload.justificacion
        attendance.registrado_por = current_admin.id
        attendance.registrado_en = datetime.utcnow()
    else:
        # Create new attendance record
        attendance = Asistencia(
            miembro_id=attendance_id,
            ensayo_id=rehearsal_id,
            presente=payload.presente,
            justificacion=payload.justificacion,
            registrado_por=current_admin.id,
        )
        db.add(attendance)
    
    db.commit()
    db.refresh(attendance)
    return {
        "id": str(attendance.id),
        "presente": attendance.presente,
        "justificacion": attendance.justificacion,
    }
    
    db.commit()
    db.refresh(attendance)
    return {
        "id": str(attendance.id),
        "presente": attendance.presente,
        "justificacion": attendance.justificacion,
    }


@router.post(
    "/attendance",
    response_model=AsistenciaResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_attendance(
    payload: AsistenciaCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin),
):
    member = db.query(Miembro).filter(Miembro.id == payload.miembro_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    rehearsal = db.query(Ensayo).filter(Ensayo.id == payload.ensayo_id).first()
    if not rehearsal:
        raise HTTPException(status_code=404, detail="Rehearsal not found")
    attendance = (
        db.query(Asistencia)
        .filter(
            Asistencia.miembro_id == payload.miembro_id,
            Asistencia.ensayo_id == payload.ensayo_id,
        )
        .first()
    )
    if attendance:
        attendance.presente = payload.presente
        attendance.justificacion = payload.justificacion
        attendance.registrado_por = current_admin.id
        attendance.registrado_en = datetime.utcnow()
    else:
        attendance = Asistencia(
            miembro_id=payload.miembro_id,
            ensayo_id=payload.ensayo_id,
            presente=payload.presente,
            justificacion=payload.justificacion,
            registrado_por=current_admin.id,
        )
        db.add(attendance)
    db.commit()
    db.refresh(attendance)
    return attendance


@router.get(
    "/attendance/reports",
    response_model=AdminAttendanceReportResponse,
)
def attendance_reports(
    ensayo_id: Optional[UUID] = Query(None),
    miembro_id: Optional[UUID] = Query(None),
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    query = db.query(Asistencia).join(Miembro).join(Ensayo)
    if ensayo_id:
        query = query.filter(Asistencia.ensayo_id == ensayo_id)
    if miembro_id:
        query = query.filter(Asistencia.miembro_id == miembro_id)
    records = query.order_by(Asistencia.registrado_en.desc()).all()
    total = len(records)
    present_count = sum(1 for record in records if record.presente)
    absent_count = total - present_count
    porcentaje = float((present_count / total) * 100) if total else 0.0
    structured = []
    for record in records:
        structured.append(
            AdminAttendanceReportRecord(
                id=record.id,
                miembro_id=record.miembro_id,
                miembro_nombre=record.miembro.user.nombre,
                ensayo_id=record.ensayo_id,
                ensayo_nombre=record.ensayo.nombre,
                presente=record.presente,
                justificacion=record.justificacion,
                registrado_en=record.registrado_en,
            )
        )
    return AdminAttendanceReportResponse(
        total=total,
        presentes=present_count,
        ausentes=absent_count,
        porcentaje_presencia=porcentaje,
        records=structured,
    )


@router.post(
    "/finance/dues",
    response_model=CuotaResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_due(
    payload: CuotaCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin),
):
    member = db.query(Miembro).filter(Miembro.id == payload.miembro_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    cuota = Cuota(
        miembro_id=payload.miembro_id,
        monto=payload.monto,
        descripcion=payload.descripcion,
        tipo=payload.tipo,
        fecha_vencimiento=payload.fecha_vencimiento,
        estado="pendiente",
        created_by=current_admin.id,
        fecha_pago=None,
    )
    db.add(cuota)
    db.commit()
    db.refresh(cuota)
    return cuota


@router.get("/finance/cuotas", response_model=dict)
def list_cuotas(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[str] = Query(None, pattern="^(pendiente|pagada|vencida)$"),
    memberId: Optional[UUID] = Query(None),
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    """List all cuotas with pagination and filters."""
    offset = (page - 1) * limit
    query = db.query(Cuota).join(Miembro).join(User, Miembro.user_id == User.id)
    if status:
        query = query.filter(Cuota.estado == status)
    if memberId:
        query = query.filter(Cuota.miembro_id == memberId)
    total = query.count()
    cuotas = (
        query
        .order_by(Cuota.fecha_vencimiento.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return {
        "cuotas": [
            {
                "id": str(c.id),
                "userId": str(c.miembro_id),
                "miembro_id": str(c.miembro_id),
                "miembro_nombre": c.miembro.user.nombre if c.miembro and c.miembro.user else "Desconocido",
                "monto": float(c.monto),
                "descripcion": c.descripcion,
                "tipo": c.tipo,
                "vencimiento": str(c.fecha_vencimiento),
                "fecha_vencimiento": str(c.fecha_vencimiento),
                "estado": c.estado,
                "fecha_pago": str(c.fecha_pago) if c.fecha_pago else None,
                "created_at": c.created_at.isoformat() if c.created_at else None,
            }
            for c in cuotas
        ],
        "total": total,
    }


@router.get("/finance/summary", response_model=dict)
def get_finance_summary(
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    """Get financial summary for admin dashboard."""
    total_pagado = db.query(func.sum(Cuota.monto)).filter(
        Cuota.estado == "pagada"
    ).scalar() or Decimal(0)
    
    # Pendientes: solo las que no han vencido
    total_pendiente = db.query(func.sum(Cuota.monto)).filter(
        Cuota.estado == "pendiente",
        Cuota.fecha_vencimiento >= date.today()
    ).scalar() or Decimal(0)
    
    # Vencidas: las que tienen estado "vencida" o pendientes con fecha pasada
    total_vencido = db.query(func.sum(Cuota.monto)).filter(
        or_(
            Cuota.estado == "vencida",
            and_(Cuota.estado == "pendiente", Cuota.fecha_vencimiento < date.today())
        )
    ).scalar() or Decimal(0)
    
    return {
        "totalIngresos": float(total_pagado),
        "totalPendiente": float(total_pendiente),
        "totalVencido": float(total_vencido),
    }


@router.post(
    "/finance/cuotas/{cuota_id}/pay",
    response_model=dict,
)
def mark_cuota_as_paid(
    cuota_id: UUID,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    """Mark a cuota as paid."""
    cuota = db.query(Cuota).filter(Cuota.id == cuota_id).first()
    if not cuota:
        raise HTTPException(status_code=404, detail="Cuota not found")
    cuota.estado = "pagada"
    cuota.fecha_pago = date.today()
    db.commit()
    db.refresh(cuota)
    return {
        "id": str(cuota.id),
        "estado": cuota.estado,
        "fecha_pago": str(cuota.fecha_pago),
    }


@router.put(
    "/finance/payments",
    response_model=CuotaResponse,
)
def register_payment(
    payload: AdminFinancePaymentRequest,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    cuota = db.query(Cuota).filter(Cuota.id == payload.cuota_id).first()
    if not cuota:
        raise HTTPException(status_code=404, detail="Cuota not found")
    cuota.estado = "pagada"
    cuota.fecha_pago = payload.fecha_pago
    db.commit()
    db.refresh(cuota)
    return cuota


@router.get(
    "/finance/reports",
    response_model=AdminFinanceReportResponse,
)
def finance_reports(
    desde: Optional[date] = Query(None),
    hasta: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    query = db.query(Cuota)
    if desde:
        query = query.filter(Cuota.fecha_vencimiento >= desde)
    if hasta:
        query = query.filter(Cuota.fecha_vencimiento <= hasta)
    cuotas = query.order_by(Cuota.fecha_vencimiento.asc()).all()
    def _sum_estado(estado: str) -> float:
        total = sum((cuota.monto for cuota in cuotas if cuota.estado == estado), Decimal(0))
        return float(total)
    return AdminFinanceReportResponse(
        total_ingresos=_sum_estado("pagada"),
        total_pendiente=_sum_estado("pendiente"),
        total_vencido=_sum_estado("vencida"),
        cuotas=cuotas,
    )
