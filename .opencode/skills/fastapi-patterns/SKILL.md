---
name: fastapi-patterns
description: Patrones y convenciones de FastAPI/Python para el proyecto Armentum
license: MIT
---

# FastAPI Patterns

## Estructura de Proyecto

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # Entry point
│   ├── config.py            # Settings
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py          # Dependencies comunes
│   │   └── v1/
│   │       ├── __init__.py
│   │       └── endpoints/
│   │           ├── users.py
│   │           ├── auth.py
│   │           └── health.py
│   ├── models/              # SQLAlchemy models
│   ├── schemas/             # Pydantic schemas
│   ├── services/            # Business logic
│   ├── core/
│   │   ├── security.py      # Auth, JWT
│   │   └── exceptions.py    # Custom exceptions
│   └── db/
│       ├── base.py          # Base declarative
│       └── session.py       # Session factory
├── tests/
├── alembic/
└── requirements.txt
```

## Dependency Injection

```python
# app/api/deps.py
from typing import Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.core.security import decode_token
from app.models.user import User

security = HTTPBearer()

def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    token = credentials.credentials
    payload = decode_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    user = db.query(User).filter(User.id == payload["sub"]).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user
```

## Router Pattern

```python
# app/api/v1/endpoints/users.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.schemas.user import User, UserCreate, UserUpdate
from app.services.user_service import UserService
from app.models.user import User as UserModel

router = APIRouter()

@router.get("/me", response_model=User)
async def get_current_user_info(
    current_user: UserModel = Depends(get_current_user)
):
    """Get current user information."""
    return current_user

@router.get("/{user_id}", response_model=User)
async def get_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """Get user by ID."""
    user = UserService.get_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/", response_model=User, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_in: UserCreate,
    db: Session = Depends(get_db)
):
    """Create new user."""
    user = UserService.get_by_email(db, user_in.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    return UserService.create(db, user_in)

@router.patch("/me", response_model=User)
async def update_user_me(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """Update current user."""
    return UserService.update(db, current_user.id, user_update)
```

## Service Layer

```python
# app/services/user_service.py
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash

class UserService:
    @staticmethod
    def get_by_id(db: Session, user_id: str) -> User | None:
        return db.query(User).filter(User.id == user_id).first()
    
    @staticmethod
    def get_by_email(db: Session, email: str) -> User | None:
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def create(db: Session, user_in: UserCreate) -> User:
        db_user = User(
            email=user_in.email,
            name=user_in.name,
            hashed_password=get_password_hash(user_in.password)
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    @staticmethod
    def update(db: Session, user_id: str, user_in: UserUpdate) -> User:
        user = UserService.get_by_id(db, user_id)
        if not user:
            return None
        
        update_data = user_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)
        
        db.commit()
        db.refresh(user)
        return user
```

## Pydantic Schemas

```python
# app/schemas/user.py
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    password: Optional[str] = Field(None, min_length=8)

class User(UserBase):
    id: str
    is_active: bool = True
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class UserInDB(User):
    hashed_password: str
```

## Exception Handling

```python
# app/core/exceptions.py
from fastapi import HTTPException, status

class AppException(Exception):
    def __init__(self, detail: str, status_code: int = status.HTTP_400_BAD_REQUEST):
        self.detail = detail
        self.status_code = status_code
        super().__init__(self.detail)

class NotFoundException(AppException):
    def __init__(self, detail: str = "Resource not found"):
        super().__init__(detail, status.HTTP_404_NOT_FOUND)

class UnauthorizedException(AppException):
    def __init__(self, detail: str = "Unauthorized"):
        super().__init__(detail, status.HTTP_401_UNAUTHORIZED)

class ForbiddenException(AppException):
    def __init__(self, detail: str = "Forbidden"):
        super().__init__(detail, status.HTTP_403_FORBIDDEN)
```

## Async Patterns

```python
# Para I/O operations
from sqlalchemy.ext.asyncio import AsyncSession

async def get_users_async(db: AsyncSession):
    result = await db.execute(select(User))
    return result.scalars().all()

# En endpoints
@router.get("/", response_model=list[User])
async def list_users(
    db: AsyncSession = Depends(get_async_db),
    skip: int = 0,
    limit: int = 100
):
    users = await UserService.get_multi_async(db, skip=skip, limit=limit)
    return users
```
