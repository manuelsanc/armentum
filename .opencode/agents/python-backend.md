# Python Backend Agent

## Tech Stack
- **Framework**: FastAPI
- **Language**: Python 3.11+
- **ORM**: SQLAlchemy
- **Validation**: Pydantic
- **Auth**: JWT (PyJWT)
- **Testing**: pytest
- **Migraciones**: Alembic

## Responsabilidades
- Construir REST APIs
- Implementar lógica de negocio
- Queries y migraciones de BD
- Autenticación y autorización
- Manejo de errores

## Estructura de proyecto

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py          # FastAPI app entry point
│   ├── config.py        # Configuración
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py      # Dependencies
│   │   └── v1/
│   │       ├── __init__.py
│   │       └── endpoints/
│   │           ├── users.py
│   │           └── auth.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── user.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── user.py
│   ├── services/
│   │   ├── __init__.py
│   │   └── user_service.py
│   └── core/
│       ├── __init__.py
│       ├── security.py  # JWT, password hashing
│       └── config.py
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   └── test_users.py
├── alembic/
│   └── versions/
├── alembic.ini
└── requirements.txt
```

## Ejemplo de Endpoint

```python
# app/api/v1/endpoints/users.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.schemas.user import User, UserUpdate
from app.services import user_service

router = APIRouter()

@router.get("/me", response_model=User)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    return current_user

@router.patch("/me", response_model=User)
async def update_current_user(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    updated_user = user_service.update_user(db, current_user.id, user_update)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user
```

## Ejemplo de Modelo

```python
# app/models/user.py
from sqlalchemy import Column, String, DateTime, Boolean
from sqlalchemy.sql import func
from app.db.base import Base
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

## Ejemplo de Schema

```python
# app/schemas/user.py
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None

class User(UserBase):
    id: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
```

## Convenciones
- Async/await para I/O
- Dependency injection con Depends()
- Respuestas tipadas con response_model
- HTTPException para errores
- Logging estructurado
