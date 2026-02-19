from uuid import uuid4
from datetime import datetime, date

from app.models import EventoPublico, Comunicado

def test_list_events_default_filters(client, db_session, sample_evento_data):
    # prepare events converting date field and overriding estado/nombre as needed
    base = sample_evento_data.copy()
    base['fecha'] = date.fromisoformat(base['fecha'])
    e1_data = base.copy()
    event1 = EventoPublico(**e1_data, created_by=uuid4())
    e2_data = e1_data.copy()
    e2_data.update({'estado': 'en_curso', 'nombre': 'Evento en curso'})
    event2 = EventoPublico(**e2_data, created_by=uuid4())
    e3_data = e1_data.copy()
    e3_data.update({'estado': 'cancelado', 'nombre': 'Evento cancelado'})
    event3 = EventoPublico(**e3_data, created_by=uuid4())
    db_session.add_all([event1, event2, event3])
    db_session.commit()

    response = client.get("/api/events")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    names = {e["nombre"] for e in data}
    assert sample_evento_data["nombre"] in names and "Evento en curso" in names

def test_list_events_with_estado_filter(client, db_session, sample_evento_data):
    base = sample_evento_data.copy()
    base['fecha'] = date.fromisoformat(base['fecha'])
    data = base.copy()
    data.update({'estado': 'cancelado'})
    event = EventoPublico(**data, created_by=uuid4())
    db_session.add(event)
    db_session.commit()

    response = client.get("/api/events?estado=cancelado")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["estado"] == "cancelado"

def test_get_event_detail(client, db_session, sample_evento_data):
    base = sample_evento_data.copy()
    base['fecha'] = date.fromisoformat(base['fecha'])
    event = EventoPublico(**base, created_by=uuid4())
    db_session.add(event)
    db_session.commit()

    response = client.get(f"/api/events/{event.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == str(event.id)
    assert data["nombre"] == sample_evento_data["nombre"]

def test_get_event_not_found(client):
    response = client.get(f"/api/events/{uuid4()}")
    assert response.status_code == 404

def test_list_news(client, db_session):
    news1 = Comunicado(titulo="Noticia 1", contenido="Contenido", dirigido_a="todos", enviado_por=uuid4(), enviado_en=datetime.utcnow())
    news2 = Comunicado(titulo="Noticia 2", contenido="Contenido", dirigido_a="grupo", enviado_por=uuid4(), enviado_en=datetime.utcnow())
    db_session.add_all([news1, news2])
    db_session.commit()

    response = client.get("/api/news")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["titulo"] == "Noticia 1"

def test_get_page_valid_slugs(client):
    for slug in ["historia", "mision", "vision", "contacto"]:
        response = client.get(f"/api/pages/{slug}")
        assert response.status_code == 200
        data = response.json()
        assert data["slug"] == slug
        assert "content" in data

def test_get_page_invalid_slug(client):
    response = client.get("/api/pages/invalid_slug")
    assert response.status_code == 404
