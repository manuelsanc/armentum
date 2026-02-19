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
from app.models import Miembro, Cuota
from app.schemas import CuotaResponse

router = APIRouter()


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
