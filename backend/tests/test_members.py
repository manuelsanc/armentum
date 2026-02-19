import pytest
from uuid import uuid4
from datetime import date, timedelta

from app.models import User, Role, UserRole, Miembro, Cuota
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
