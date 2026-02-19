"""
Private APIs for corista zone: members, rehearsals, attendance, finance
"""
from typing import List, Optional
from datetime import date
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.dependencies import get_current_user
from app.models import Miembro, Cuota, Ensayo, Asistencia
from app.schemas import (
    MemberProfileResponse,
    MemberProfileUpdate,
    RehearsalResponse,
    RehearsalDetailResponse,
    AttendanceResponse,
    AttendanceStatsResponse,
    CuotaResponse,
    FinanceSummaryResponse,
)

router = APIRouter()

# ==========================================
# Members: Profile endpoints (T037-T038)
# ==========================================

@router.get("/members/me", response_model=MemberProfileResponse)
def get_my_profile(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Retrieve profile of the authenticated member.
    """
    member = db.query(Miembro).filter(Miembro.user_id == current_user.id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member profile not found")
    user = member.user
    return {
        "id": member.id,
        "email": user.email,
        "nombre": user.nombre,
        "voz": member.voz,
        "fecha_ingreso": member.fecha_ingreso,
        "estado": member.estado,
        "telefono": member.telefono,
        "saldo_actual": member.saldo_actual,
    }

@router.put("/members/me", response_model=MemberProfileResponse)
def update_my_profile(
    profile_update: MemberProfileUpdate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Update phone and voice of the authenticated member.
    """
    member = db.query(Miembro).filter(Miembro.user_id == current_user.id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member profile not found")
    if profile_update.telefono is not None:
        member.telefono = profile_update.telefono
    if profile_update.voz is not None:
        member.voz = profile_update.voz
    db.commit()
    db.refresh(member)
    user = member.user
    return {
        "id": member.id,
        "email": user.email,
        "nombre": user.nombre,
        "voz": member.voz,
        "fecha_ingreso": member.fecha_ingreso,
        "estado": member.estado,
        "telefono": member.telefono,
        "saldo_actual": member.saldo_actual,
    }

# ==========================================
# Rehearsals endpoints (T039-T040)
# ==========================================

@router.get("/rehearsals", response_model=List[RehearsalResponse])
def list_rehearsals(
    desde: Optional[date] = Query(None),
    hasta: Optional[date] = Query(None),
    limit: Optional[int] = Query(None, ge=1),
    offset: int = Query(0, ge=0),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    List upcoming rehearsals within optional date range.
    """
    query = db.query(Ensayo).filter(Ensayo.fecha >= date.today())
    if desde:
        query = query.filter(Ensayo.fecha >= desde)
    if hasta:
        query = query.filter(Ensayo.fecha <= hasta)
    query = query.order_by(Ensayo.fecha.asc())
    if offset:
        query = query.offset(offset)
    if limit:
        query = query.limit(limit)
    rehearsals = query.all()
    return [
        {
            "id": r.id,
            "nombre": r.nombre,
            "titulo": r.nombre,  # Backward compatibility
            "fecha": r.fecha,
            "hora": r.hora,
            "horaInicio": r.hora,  # Backward compatibility
            "lugar": r.lugar,
            "tipo": r.tipo,
            "descripcion": r.descripcion,
        }
        for r in rehearsals
    ]

@router.get("/rehearsals/{rehearsal_id}", response_model=RehearsalDetailResponse)
def get_rehearsal_detail(
    rehearsal_id: UUID,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get details for a specific rehearsal including attendance.
    """
    rehearsal = db.query(Ensayo).filter(Ensayo.id == rehearsal_id).first()
    if not rehearsal:
        raise HTTPException(status_code=404, detail="Rehearsal not found")
    member = db.query(Miembro).filter(Miembro.user_id == current_user.id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member profile not found")
    attendance = (
        db.query(Asistencia)
        .filter(Asistencia.ensayo_id == rehearsal_id, Asistencia.miembro_id == member.id)
        .first()
    )
    asistencia = (
        {"presente": attendance.presente, "justificacion": attendance.justificacion}
        if attendance
        else None
    )
    return {
        "id": rehearsal.id,
        "nombre": rehearsal.nombre,
        "titulo": rehearsal.nombre,  # Backward compatibility
        "fecha": rehearsal.fecha,
        "hora": rehearsal.hora,
        "horaInicio": rehearsal.hora,  # Backward compatibility
        "lugar": rehearsal.lugar,
        "tipo": rehearsal.tipo,
        "descripcion": rehearsal.descripcion,
        "asistencia": asistencia,
    }

# ==========================================
# Attendance endpoints (T041-T042)
# ==========================================

@router.get("/attendance/me", response_model=List[AttendanceResponse])
def list_my_attendance(
    limit: Optional[int] = Query(None, ge=1),
    offset: int = Query(0, ge=0),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    List attendance records for the authenticated member.
    """
    member = db.query(Miembro).filter(Miembro.user_id == current_user.id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member profile not found")
    query = db.query(Asistencia).filter(Asistencia.miembro_id == member.id).order_by(Asistencia.registrado_en.desc())
    if offset:
        query = query.offset(offset)
    if limit:
        query = query.limit(limit)
    records = query.all()
    return [
        {
            "id": r.id,
            "ensayo_id": r.ensayo_id,
            "ensayo_nombre": r.ensayo.nombre,
            "ensayo_fecha": r.ensayo.fecha,
            "presente": r.presente,
            "justificacion": r.justificacion,
            "registrado_en": r.registrado_en,
        }
        for r in records
    ]

@router.get("/attendance/me/stats", response_model=AttendanceStatsResponse)
def get_my_attendance_stats(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get attendance statistics for the authenticated member.
    """
    member = db.query(Miembro).filter(Miembro.user_id == current_user.id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member profile not found")
    total = db.query(Asistencia).filter(Asistencia.miembro_id == member.id).count()
    asistencias = db.query(Asistencia).filter(Asistencia.miembro_id == member.id, Asistencia.presente.is_(True)).count()
    inasistencias = db.query(Asistencia).filter(Asistencia.miembro_id == member.id, Asistencia.presente.is_(False)).count()
    porcentaje = float((asistencias / total) * 100) if total > 0 else 0.0
    return {
        "total_ensayos": total,
        "asistencias": asistencias,
        "inasistencias": inasistencias,
        "porcentaje": porcentaje,
    }


@router.get("/finance/me", response_model=List[CuotaResponse])
def list_my_fees(
    estado: Optional[str] = Query(
        None,
        pattern="^(pendiente|pagada|vencida)$",
        description="Filter by fee status"
    ),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    List fees for the authenticated member.
    """
    member = db.query(Miembro).filter(Miembro.user_id == current_user.id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member profile not found")
    query = db.query(Cuota).filter(Cuota.miembro_id == member.id)
    if estado:
        query = query.filter(Cuota.estado == estado)
    fees = query.order_by(Cuota.fecha_vencimiento.asc()).all()
    return fees


@router.get("/finance/me/history", response_model=List[CuotaResponse])
def payment_history(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Retrieve payment history (paid fees) for the authenticated member.
    """
    member = db.query(Miembro).filter(Miembro.user_id == current_user.id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member profile not found")
    paid = (
        db.query(Cuota)
        .filter(Cuota.miembro_id == member.id, Cuota.estado == "pagada")
        .order_by(Cuota.fecha_pago.desc())
        .all()
    )
    return paid


@router.get("/finance/me/summary", response_model=FinanceSummaryResponse)
def get_finance_summary(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get financial summary for the authenticated member.
    """
    from sqlalchemy import func
    from decimal import Decimal
    
    member = db.query(Miembro).filter(Miembro.user_id == current_user.id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member profile not found")
    
    # Calculate totals by status
    total_pagado = db.query(func.sum(Cuota.monto)).filter(
        Cuota.miembro_id == member.id,
        Cuota.estado == "pagada"
    ).scalar() or Decimal(0)
    
    total_pendiente = db.query(func.sum(Cuota.monto)).filter(
        Cuota.miembro_id == member.id,
        Cuota.estado == "pendiente"
    ).scalar() or Decimal(0)
    
    # Vencidas are pendientes with fecha_vencimiento < today
    from datetime import date as today_date
    total_vencido = db.query(func.sum(Cuota.monto)).filter(
        Cuota.miembro_id == member.id,
        Cuota.estado == "pendiente",
        Cuota.fecha_vencimiento < today_date.today()
    ).scalar() or Decimal(0)
    
    return {
        "totalIngresos": float(total_pagado),
        "totalPendiente": float(total_pendiente),
        "totalVencido": float(total_vencido),
    }
