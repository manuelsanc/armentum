"""Tests for admin-only APIs (Milestone 5)."""

from datetime import date
from decimal import Decimal
from uuid import UUID

import pytest

from app.auth.jwt import create_access_token, get_password_hash
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


@pytest.fixture
def admin_user(db_session):
    """Create an admin user with the required roles."""
    admin_role = Role(nombre="admin", descripcion="Admin role")
    corista_role = Role(nombre="corista", descripcion="Corista role")
    db_session.add_all([admin_role, corista_role])
    db_session.commit()

    admin = User(
        email="admin@example.com",
        password_hash=get_password_hash("adminpass123"),
        nombre="Admin User",
        is_active=True,
        email_verified=True,
    )
    db_session.add(admin)
    db_session.flush()
    db_session.add(UserRole(user_id=admin.id, role_id=admin_role.id))
    db_session.commit()
    db_session.refresh(admin)
    return admin


@pytest.fixture
def admin_token(admin_user):
    return create_access_token(data={"sub": str(admin_user.id), "roles": ["admin"]})


@pytest.fixture
def corista_token(db_session):
    """Authentication token for a corista user to test permission boundaries."""
    role = Role(nombre="corista", descripcion="Corista role")
    db_session.add(role)
    db_session.commit()
    user = User(
        email="member@example.com",
        password_hash=get_password_hash("memberpass"),
        nombre="Corista",
        is_active=True,
        email_verified=True,
    )
    db_session.add(user)
    db_session.flush()
    db_session.add(UserRole(user_id=user.id, role_id=role.id))
    db_session.commit()
    db_session.refresh(user)
    return create_access_token(data={"sub": str(user.id), "roles": ["corista"]})


def create_member(db_session, email, nombre="Member", voz="Soprano", estado="activo"):
    corista_role = db_session.query(Role).filter(Role.nombre == "corista").first()
    if not corista_role:
        corista_role = Role(nombre="corista", descripcion="Corista role")
        db_session.add(corista_role)
        db_session.commit()
    user = User(
        email=email,
        nombre=nombre,
        password_hash=get_password_hash("coristapass"),
        is_active=True,
        email_verified=True,
    )
    db_session.add(user)
    db_session.flush()
    db_session.add(UserRole(user_id=user.id, role_id=corista_role.id))
    member = Miembro(
        user_id=user.id,
        voz=voz,
        fecha_ingreso=date.today(),
        estado=estado,
        telefono="+123456789",
    )
    db_session.add(member)
    db_session.commit()
    db_session.refresh(member)
    return member


def create_public_event(db_session, admin_user, **attrs):
    today = attrs.get("fecha", date.today())
    event = EventoPublico(
        nombre=attrs.get("nombre", "Concierto"),
        descripcion=attrs.get("descripcion", "Evento público"),
        fecha=today,
        hora=attrs.get("hora", "19:00"),
        lugar=attrs.get("lugar", "Teatro"),
        tipo=attrs.get("tipo", "concierto"),
        imagen_url=attrs.get("imagen_url", "https://example.com/cover.png"),
        created_by=admin_user.id,
    )
    db_session.add(event)
    db_session.commit()
    db_session.refresh(event)
    return event


def create_rehearsal(db_session, admin_user, **attrs):
    rehearsal = Ensayo(
        tipo=attrs.get("tipo", "general"),
        nombre=attrs.get("nombre", "Ensayo"),
        fecha=attrs.get("fecha", date.today()),
        hora=attrs.get("hora", "17:00"),
        lugar=attrs.get("lugar", "Sala"),
        cuerdas=attrs.get("cuerdas", "Todas"),
        descripcion=attrs.get("descripcion", "Preparación"),
        created_by=admin_user.id,
    )
    db_session.add(rehearsal)
    db_session.commit()
    db_session.refresh(rehearsal)
    return rehearsal


def create_cuota(db_session, member, admin_user, *, estado="pendiente", fecha_pago=None, monto=Decimal("100.00")):
    cuota = Cuota(
        miembro_id=member.id,
        monto=monto,
        descripcion="Cuota",
        tipo="regular",
        fecha_vencimiento=date.today(),
        estado=estado,
        fecha_pago=fecha_pago,
        created_by=admin_user.id,
    )
    db_session.add(cuota)
    db_session.commit()
    db_session.refresh(cuota)
    return cuota


def test_admin_members_require_admin_role(client, corista_token):
    response = client.get("/api/admin/members")
    assert response.status_code == 401
    headers = {"Authorization": f"Bearer {corista_token}"}
    forbidden = client.get("/api/admin/members", headers=headers)
    assert forbidden.status_code == 403


def test_admin_can_list_members(client, db_session, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    member_a = create_member(db_session, "a@example.com", nombre="Alicia")
    member_b = create_member(db_session, "b@example.com", nombre="Bernardo", estado="inactivo")
    response = client.get("/api/admin/members", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2
    assert len(data["members"]) == 2

    filtered = client.get("/api/admin/members?search=Bernardo", headers=headers)
    assert filtered.status_code == 200
    assert filtered.json()["total"] == 1

    estado_filter = client.get("/api/admin/members?estado=inactivo", headers=headers)
    assert estado_filter.status_code == 200
    assert estado_filter.json()["total"] == 1
    assert estado_filter.json()["members"][0]["estado"] == "inactivo"


def test_admin_can_create_member(client, db_session, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    payload = {
        "email": "newmember@example.com",
        "nombre": "New Member",
        "password": "securepass",
        "voz": "Alto",
        "fecha_ingreso": str(date.today()),
        "telefono": "+987654321",
    }
    response = client.post("/api/admin/members", json=payload, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == payload["email"]
    assert data["voz"] == "Alto"
    member = db_session.query(Miembro).filter(Miembro.id == UUID(data["id"]))
    assert member.first() is not None


def test_admin_can_update_member(client, db_session, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    member = create_member(db_session, "update@example.com")
    payload = {
        "voz": "Bajo",
        "estado": "suspendido",
        "telefono": "+111111111",
        "saldo_actual": 120.50,
    }
    response = client.put(f"/api/admin/members/{member.id}", json=payload, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["voz"] == "Bajo"
    assert data["estado"] == "suspendido"
    assert float(data["saldo_actual"]) == 120.5


def test_admin_can_delete_member(client, db_session, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    member = create_member(db_session, "delete@example.com")
    response = client.delete(f"/api/admin/members/{member.id}", headers=headers)
    assert response.status_code == 200
    db_session.refresh(member)
    assert member.estado == "inactivo"


def test_admin_can_create_event(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    payload = {
        "nombre": "Concierto",
        "descripcion": "Gran función",
        "fecha": str(date.today()),
        "hora": "20:00",
        "lugar": "Auditorio",
        "tipo": "concierto",
        "imagen_url": "https://example.com/image.png",
    }
    response = client.post("/api/admin/events", json=payload, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["nombre"] == payload["nombre"]


def test_admin_can_update_event(client, db_session, admin_token, admin_user):
    headers = {"Authorization": f"Bearer {admin_token}"}
    event = create_public_event(db_session, admin_user)
    response = client.put(
        f"/api/admin/events/{event.id}",
        json={"nombre": "Concierto Actualizado"},
        headers=headers,
    )
    assert response.status_code == 200
    assert response.json()["nombre"] == "Concierto Actualizado"


def test_admin_can_delete_event(client, db_session, admin_token, admin_user):
    headers = {"Authorization": f"Bearer {admin_token}"}
    event = create_public_event(db_session, admin_user)
    response = client.delete(f"/api/admin/events/{event.id}", headers=headers)
    assert response.status_code == 200
    assert db_session.query(EventoPublico).filter(EventoPublico.id == event.id).first() is None


def test_admin_can_create_rehearsal(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    payload = {
        "tipo": "general",
        "nombre": "Ensayo Especial",
        "fecha": str(date.today()),
        "hora": "18:30",
        "lugar": "Sala Principal",
        "cuerdas": "Sección",
        "descripcion": "Ensayo clave",
    }
    response = client.post("/api/admin/rehearsals", json=payload, headers=headers)
    assert response.status_code == 201
    assert response.json()["nombre"] == payload["nombre"]


def test_admin_can_update_rehearsal(client, db_session, admin_token, admin_user):
    headers = {"Authorization": f"Bearer {admin_token}"}
    rehearsal = create_rehearsal(db_session, admin_user)
    response = client.put(
        f"/api/admin/rehearsals/{rehearsal.id}",
        json={"nombre": "Ensayo Modernizado"},
        headers=headers,
    )
    assert response.status_code == 200
    assert response.json()["nombre"] == "Ensayo Modernizado"


def test_admin_can_delete_rehearsal(client, db_session, admin_token, admin_user):
    headers = {"Authorization": f"Bearer {admin_token}"}
    rehearsal = create_rehearsal(db_session, admin_user)
    response = client.delete(f"/api/admin/rehearsals/{rehearsal.id}", headers=headers)
    assert response.status_code == 200
    assert db_session.query(Ensayo).filter(Ensayo.id == rehearsal.id).first() is None


def test_admin_can_register_attendance(client, db_session, admin_token, admin_user):
    headers = {"Authorization": f"Bearer {admin_token}"}
    member = create_member(db_session, "attendance@example.com")
    rehearsal = create_rehearsal(db_session, admin_user)
    payload = {
        "miembro_id": str(member.id),
        "ensayo_id": str(rehearsal.id),
        "presente": False,
        "justificacion": "Enfermo",
    }
    first = client.post("/api/admin/attendance", json=payload, headers=headers)
    assert first.status_code == 201
    assert first.json()["presente"] is False

    payload["presente"] = True
    payload["justificacion"] = "Recuperado"
    second = client.post("/api/admin/attendance", json=payload, headers=headers)
    assert second.status_code == 201
    assert second.json()["presente"] is True


def test_admin_attendance_reports(client, db_session, admin_token, admin_user):
    headers = {"Authorization": f"Bearer {admin_token}"}
    member = create_member(db_session, "report@example.com")
    rehearsal = create_rehearsal(db_session, admin_user)
    asistencia_1 = Asistencia(
        miembro_id=member.id,
        ensayo_id=rehearsal.id,
        presente=True,
        registrado_por=admin_user.id,
    )
    asistencia_2 = Asistencia(
        miembro_id=member.id,
        ensayo_id=rehearsal.id,
        presente=False,
        registrado_por=admin_user.id,
    )
    db_session.add_all([asistencia_1, asistencia_2])
    db_session.commit()
    response = client.get("/api/admin/attendance/reports", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2
    assert data["presentes"] == 1
    assert data["ausentes"] == 1
    assert len(data["records"]) == 2


def test_admin_can_create_due(client, db_session, admin_token, admin_user):
    headers = {"Authorization": f"Bearer {admin_token}"}
    member = create_member(db_session, "due@example.com")
    payload = {
        "miembro_id": str(member.id),
        "monto": 120.75,
        "descripcion": "Cuota mensual",
        "tipo": "regular",
        "fecha_vencimiento": str(date.today()),
    }
    response = client.post("/api/admin/finance/dues", json=payload, headers=headers)
    assert response.status_code == 201
    assert response.json()["estado"] == "pendiente"


def test_admin_can_register_payment(client, db_session, admin_token, admin_user):
    headers = {"Authorization": f"Bearer {admin_token}"}
    member = create_member(db_session, "payment@example.com")
    cuota = create_cuota(db_session, member, admin_user)
    payload = {
        "cuota_id": str(cuota.id),
        "fecha_pago": str(date.today()),
    }
    response = client.put("/api/admin/finance/payments", json=payload, headers=headers)
    assert response.status_code == 200
    assert response.json()["estado"] == "pagada"
    assert response.json()["fecha_pago"] == payload["fecha_pago"]


def test_admin_finance_report(client, db_session, admin_token, admin_user):
    headers = {"Authorization": f"Bearer {admin_token}"}
    member = create_member(db_session, "reportfinance@example.com")
    create_cuota(db_session, member, admin_user, estado="pendiente", monto=Decimal("100.00"))
    paid_date = date.today()
    create_cuota(
        db_session,
        member,
        admin_user,
        estado="pagada",
        fecha_pago=paid_date,
        monto=Decimal("150.00"),
    )
    create_cuota(db_session, member, admin_user, estado="vencida", monto=Decimal("80.00"))
    params = {"desde": str(date.today()), "hasta": str(date.today())}
    response = client.get("/api/admin/finance/reports", params=params, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total_ingresos"] == 150.0
    assert data["total_pendiente"] == 100.0
    assert data["total_vencido"] == 80.0
    assert len(data["cuotas"]) == 3
