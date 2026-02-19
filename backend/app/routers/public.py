"""Public API endpoints for events, news, and static pages."""
from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import EventoPublico, Comunicado
from app.schemas import EventoPublicoResponse, ComunicadoResponse, PageResponse

router = APIRouter()

@router.get("/events", response_model=List[EventoPublicoResponse])
def list_public_events(
    limit: int = Query(10, ge=1),
    offset: int = Query(0, ge=0),
    estado: Optional[str] = Query(None, pattern="^(planificado|en_curso|finalizado|cancelado)$"),
    db: Session = Depends(get_db),
):
    """List public events with optional state filter.
    Default: only 'planificado' or 'en_curso'."""
    query = db.query(EventoPublico)
    if estado:
        query = query.filter(EventoPublico.estado == estado)
    else:
        query = query.filter(EventoPublico.estado.in_(['planificado', 'en_curso']))
    events = query.order_by(EventoPublico.fecha.desc()).offset(offset).limit(limit).all()
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
