"""Public API endpoints for events, news, and static pages."""
from typing import List, Optional
import html
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, or_

from app.database import get_db
from app.models import EventoPublico, Comunicado, GalleryImage
from app.schemas import (
    EventoPublicoResponse,
    ComunicadoResponse,
    PageResponse,
    GalleryImageListResponse,
    ChoirInterestRequest,
    ServiceQuoteRequest,
    Message,
)
from app.services.email_service import email_service
from app.config import settings

router = APIRouter()

@router.get("/events", response_model=List[EventoPublicoResponse])
def list_public_events(
    limit: int = Query(10, ge=1),
    offset: int = Query(0, ge=0),
    estado: Optional[str] = Query(None, pattern="^(planificado|en_curso|finalizado|cancelado)$"),
    db: Session = Depends(get_db),
):
    """List public events with optional state filter.
    Default: only 'planificado' or 'en_curso', ordered by date ascending (upcoming first)."""
    from datetime import date
    query = db.query(EventoPublico)
    if estado:
        query = query.filter(EventoPublico.estado == estado)
    else:
        query = query.filter(EventoPublico.estado.in_(['planificado', 'en_curso']))
    # Only show future events and order by date ascending (upcoming first)
    query = query.filter(EventoPublico.fecha >= date.today())
    events = query.order_by(EventoPublico.fecha.asc()).offset(offset).limit(limit).all()
    return events

@router.get("/events/{event_id}", response_model=EventoPublicoResponse)
def get_public_event(event_id: UUID, db: Session = Depends(get_db)):
    """Get full details of a public event by ID."""
    event = db.query(EventoPublico).filter(EventoPublico.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.get("/news", response_model=List[ComunicadoResponse])
def list_public_news(
    limit: int = Query(10, ge=1),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    """List public news/communications directed to all."""
    news = (
        db.query(Comunicado)
        .filter(Comunicado.dirigido_a == "todos")
        .order_by(Comunicado.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return news

@router.get("/pages/{slug}", response_model=PageResponse)
def get_public_page(slug: str):
    """Retrieve static public page content by slug."""
    pages = {
        "historia": {"title": "Nuestra Historia", "content": "Contenido de la página de Historia."},
        "mision": {"title": "Nuestra Misión", "content": "Contenido de la página de Misión."},
        "vision": {"title": "Nuestra Visión", "content": "Contenido de la página de Visión."},
        "contacto": {"title": "Contacto", "content": "Contenido de la página de Contacto."},
    }
    page = pages.get(slug)
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return {"slug": slug, "title": page["title"], "content": page["content"]}


@router.get("/gallery", response_model=GalleryImageListResponse)
def get_public_gallery(
    limit: int = Query(100, ge=1, le=200),
    offset: int = Query(0, ge=0),
    tags: Optional[str] = Query(None, description="Comma-separated tags for filtering"),
    db: Session = Depends(get_db),
):
    """Get public gallery images with optional tag filtering."""
    query = db.query(GalleryImage)

    # Tags filter (AND logic: all tags must match)
    if tags:
        tag_list = [t.strip() for t in tags.split(",") if t.strip()]
        for tag in tag_list:
            query = query.filter(GalleryImage.tags.contains([tag]))

    total = query.count()
    images = (
        query.order_by(GalleryImage.fecha.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    return GalleryImageListResponse(
        total=total,
        limit=limit,
        offset=offset,
        images=images,
    )


@router.post("/choir-interest", response_model=Message)
async def submit_choir_interest(payload: ChoirInterestRequest):
    """Receive interest form and send email notification."""
    subject = "Nueva solicitud para unirse al coro"
    body = f"""
    <h2>Nueva solicitud para unirse al coro</h2>
    <p><strong>Nombre completo:</strong> {html.escape(payload.nombre_completo)}</p>
    <p><strong>Edad:</strong> {payload.edad}</p>
    <p><strong>Experiencia musical/coral:</strong><br />{html.escape(payload.experiencia_musical)}</p>
    <p><strong>Quién soy:</strong><br />{html.escape(payload.quien_soy)}</p>
    <p><strong>Correo electrónico:</strong> {html.escape(payload.correo)}</p>
    <p><strong>Número de teléfono:</strong> {html.escape(payload.telefono)}</p>
    """

    email_sent = await email_service.send_notification_email(
        settings.CONTACT_EMAIL, subject, body
    )

    if not email_sent:
        raise HTTPException(status_code=500, detail="No se pudo enviar el correo")

    return {"message": "Solicitud enviada correctamente"}


@router.post("/service-quote", response_model=Message)
async def submit_service_quote(payload: ServiceQuoteRequest):
    """Receive service quote request and send email notification."""
    subject = "Nueva solicitud de servicios"
    body = f"""
    <h2>Nueva solicitud de servicios</h2>
    <p><strong>Nombre completo:</strong> {html.escape(payload.nombre_completo)}</p>
    <p><strong>Correo electrónico:</strong> {html.escape(payload.correo)}</p>
    <p><strong>Número de teléfono:</strong> {html.escape(payload.telefono)}</p>
    <p><strong>Tipo de evento:</strong> {html.escape(payload.tipo_evento)}</p>
    <p><strong>Fecha del evento:</strong> {payload.fecha_evento}</p>
    <p><strong>Ubicación del evento:</strong> {html.escape(payload.ubicacion_evento)}</p>
    <p><strong>Tipo de música deseada:</strong> {html.escape(payload.musica_deseada or 'No indicado')}</p>
    <p><strong>Duración aproximada:</strong> {html.escape(payload.duracion_evento)}</p>
    <p><strong>Presupuesto estimado:</strong> {html.escape(payload.presupuesto or 'No indicado')}</p>
    <p><strong>Mensaje adicional:</strong><br />{html.escape(payload.mensaje_adicional)}</p>
    """

    email_sent = await email_service.send_notification_email(
        settings.CONTACT_EMAIL, subject, body
    )

    if not email_sent:
        raise HTTPException(status_code=500, detail="No se pudo enviar el correo")

    return {"message": "Solicitud enviada correctamente"}
