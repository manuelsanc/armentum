import pytest
from uuid import uuid4
from datetime import date, timedelta

from app.models import User, Role, UserRole, Miembro, Cuota, Ensayo, Asistencia
from app.auth.jwt import create_access_token


def create_member_with_fees(db_session):
    """Helper to create a member user with associated fees."""
    # Create corista role and user
    role = Role(nombre="corista", descripcion="Corista role")
    db_session.add(role)
    db_session.commit()

    user = User(
        email="member@example.com",
        password_hash="hashedpw",
        nombre="Member Name",
        is_active=True,
        email_verified=True,
    )
    db_session.add(user)
    db_session.flush()
    db_session.add(UserRole(user_id=user.id, role_id=role.id))
    db_session.flush()

    member = Miembro(
        user_id=user.id,
        voz="Soprano",
        fecha_ingreso=date.today(),
        estado="activo",
        telefono="123456789",
    )
    db_session.add(member)
    db_session.commit()

    # Create various fees
    due_future = date.today() + timedelta(days=5)
    fee_pending = Cuota(
        miembro_id=member.id,
        monto=100.0,
        descripcion="Pending fee",
        tipo="regular",
        fecha_vencimiento=due_future,
        estado="pendiente",
        created_by=user.id,
    )
    paid_date = date.today()
    fee_paid = Cuota(
        miembro_id=member.id,
        monto=200.0,
        descripcion="Paid fee",
        tipo="extraordinaria",
        fecha_vencimiento=due_future,
        estado="pagada",
        fecha_pago=paid_date,
        created_by=user.id,
    )
    overdue_date = date.today() - timedelta(days=1)
    fee_overdue = Cuota(
        miembro_id=member.id,
        monto=300.0,
        descripcion="Overdue fee",
        tipo="regular",
        fecha_vencimiento=overdue_date,
        estado="vencida",
        created_by=user.id,
    )
    db_session.add_all([fee_pending, fee_paid, fee_overdue])
    db_session.commit()

    token = create_access_token(data={"sub": str(user.id), "roles": ["corista"]})
    return token, member, [fee_pending, fee_paid, fee_overdue]


def test_get_finance_unauthorized(client):
    response = client.get("/api/finance/me")
    assert response.status_code == 401


def test_list_fees(client, db_session):
    token, member, fees = create_member_with_fees(db_session)
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/finance/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3


def test_list_fees_filter_estado(client, db_session):
    token, member, fees = create_member_with_fees(db_session)
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/finance/me?estado=pendiente", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["estado"] == "pendiente"


def test_payment_history_unauthorized(client):
    response = client.get("/api/finance/me/history")
    assert response.status_code == 401


def test_payment_history(client, db_session):
    token, member, fees = create_member_with_fees(db_session)
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/finance/me/history", headers=headers)
    assert response.status_code == 200
    data = response.json()
    # Only paid fees returned
    assert len(data) == 1
    assert data[0]["estado"] == "pagada"
    # fecha_pago should match
    assert data[0]["fecha_pago"] == date.today().isoformat()


# ==========================================
# Member profile endpoints (T037-T038)
# ==========================================

def test_get_member_profile_unauthorized(client):
    response = client.get("/api/members/me")
    assert response.status_code == 401


def test_get_member_profile_success(client, db_session):
    token, member, _ = create_member_with_fees(db_session)
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/members/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == str(member.id)
    assert data["email"] == member.user.email
    assert data["nombre"] == member.user.nombre
    assert data["voz"] == member.voz
    assert data["telefono"] == member.telefono
    assert data["saldo_actual"] == 0


def test_update_member_profile_success(client, db_session):
    token, member, _ = create_member_with_fees(db_session)
    headers = {"Authorization": f"Bearer {token}"}
    payload = {"telefono": "9999999", "voz": "Alto"}
    response = client.put("/api/members/me", json=payload, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["telefono"] == "9999999"
    assert data["voz"] == "Alto"


def test_update_member_profile_forbidden_field(client, db_session):
    token, member, _ = create_member_with_fees(db_session)
    headers = {"Authorization": f"Bearer {token}"}
    payload = {"email": "new@example.com"}
    response = client.put("/api/members/me", json=payload, headers=headers)
    assert response.status_code == 422


# ==========================================
# Rehearsals endpoints (T039-T040)
# ==========================================

def test_list_rehearsals_unauthorized(client):
    response = client.get("/api/rehearsals")
    assert response.status_code == 401


def test_list_rehearsals_filters(client, db_session):
    token, member, _ = create_member_with_fees(db_session)
    headers = {"Authorization": f"Bearer {token}"}

    today = date.today()
    past = today - timedelta(days=3)
    upcoming = today + timedelta(days=3)
    r1 = Ensayo(tipo="general", nombre="Past", fecha=past, hora="09:00", lugar="Room", created_by=member.user_id)
    r2 = Ensayo(tipo="seccional", nombre="Upcoming", fecha=upcoming, hora="10:00", lugar="Hall", created_by=member.user_id)
    db_session.add_all([r1, r2])
    db_session.commit()

    # default only upcoming rehearsals
    response = client.get("/api/rehearsals", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["nombre"] == "Upcoming"

    # with desde filter
    desde = (today + timedelta(days=1)).isoformat()
    response = client.get(f"/api/rehearsals?desde={desde}", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert all(item["fecha"] >= desde for item in data)


def test_get_rehearsal_detail(client, db_session):
    token, member, _ = create_member_with_fees(db_session)
    headers = {"Authorization": f"Bearer {token}"}

    rehearsal = Ensayo(tipo="general", nombre="Detail", fecha=date.today(), hora="11:00", lugar="Studio", created_by=member.user_id)
    db_session.add(rehearsal)
    db_session.commit()

    # no attendance yet
    response = client.get(f"/api/rehearsals/{rehearsal.id}", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["asistencia"] is None

    # add attendance
    attendance = Asistencia(miembro_id=member.id, ensayo_id=rehearsal.id, presente=False, justificacion="Sick", registrado_por=member.user_id)
    db_session.add(attendance)
    db_session.commit()

    response = client.get(f"/api/rehearsals/{rehearsal.id}", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["asistencia"]["presente"] is False
    assert data["asistencia"]["justificacion"] == "Sick"


# ==========================================
# Attendance endpoints (T041-T042)
# ==========================================

def test_list_attendance_unauthorized(client):
    response = client.get("/api/attendance/me")
    assert response.status_code == 401


def test_list_attendance_and_stats(client, db_session):
    token, member, _ = create_member_with_fees(db_session)
    headers = {"Authorization": f"Bearer {token}"}

    today = date.today()
    rehearsal1 = Ensayo(tipo="general", nombre="R1", fecha=today, hora="08:00", lugar="L1", created_by=member.user_id)
    rehearsal2 = Ensayo(tipo="general", nombre="R2", fecha=today, hora="09:00", lugar="L2", created_by=member.user_id)
    db_session.add_all([rehearsal1, rehearsal2])
    db_session.commit()

    a1 = Asistencia(miembro_id=member.id, ensayo_id=rehearsal1.id, presente=True, registrado_por=member.user_id)
    a2 = Asistencia(miembro_id=member.id, ensayo_id=rehearsal2.id, presente=False, registrado_por=member.user_id)
    db_session.add_all([a1, a2])
    db_session.commit()

    # list attendance
    response = client.get("/api/attendance/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert any(item["ensayo_nombre"] == "R1" for item in data)

    # stats should return correct metrics
    response = client.get("/api/attendance/me/stats", headers=headers)
    assert response.status_code == 200
    stats = response.json()
    assert stats["total_ensayos"] == 2
    assert stats["asistencias"] == 1
    assert stats["inasistencias"] == 1
    assert stats["porcentaje"] == 50.0
