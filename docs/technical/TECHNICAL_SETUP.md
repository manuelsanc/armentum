# Setup Técnico y Arquitectura - Armentum

**Versión**: 1.0  
**Fecha**: Febrero 2026  
**Framework Backend**: FastAPI (Python)  
**Estado**: Guía Técnica para Implementación

---

## 1. VISIÓN TÉCNICA GENERAL

```
┌─────────────────────────────────────────────────────────────┐
│                    ARQUITECTURA ARMENTUM                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────┐         ┌──────────────────────┐  │
│  │   FRONTEND (React)   │         │  BACKEND (FastAPI)   │  │
│  │  - React 18 + TS     │◄────────│ - Python 3.11+       │  │
│  │  - Vite + Tailwind   │  HTTP   │ - SQLAlchemy ORM     │  │
│  │  - React Router      │  JSON   │ - Pydantic models    │  │
│  │  - Zustand (state)   │         │ - JWT auth           │  │
│  │  - Axios (HTTP)      │         │ - Email service      │  │
│  │  - Deployed: Vercel  │         │ - Deployed: Vercel   │  │
│  └──────────────────────┘         │   (Python runtime)   │  │
│                                    └──────────────────────┘  │
│                           ▲                                   │
│                           │                                   │
│                      PostgreSQL                              │
│                   Supabase Hosted                            │
│                    (RLS enabled)                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Datos
1. **Frontend**: Usuario interactúa en React UI
2. **HTTP/API**: Axios envía requests JSON a FastAPI
3. **Backend**: FastAPI procesa requests, valida con Pydantic
4. **Database**: SQLAlchemy traduce a SQL, PostgreSQL ejecuta
5. **Response**: Datos JSON vuelven a frontend
6. **Rendering**: React actualiza UI

### Stack Technologies
- **Language**: Python 3.11+ (backend), TypeScript (frontend)
- **API**: RESTful HTTP con JSON
- **Auth**: JWT + Email verification
- **Database**: PostgreSQL (Supabase)
- **Hosting**: Vercel (both frontend & backend)
- **Email**: SendGrid o Resend (free tier)
- **Storage**: Supabase Storage (images, PDFs)

---

## 2. SETUP INICIAL - PASO A PASO

### 2.1 Crear Supabase Project

**Pasos**:
1. Ve a https://supabase.com
2. Sign up con tu email
3. Crea nuevo proyecto:
   - Nombre: `armentum`
   - Region: Cercana a ti (ej: `us-east-1`)
   - Contraseña DB: Genera una fuerte y guárdala
4. Espera a que se cree (2-3 min)
5. Anota:
   - **Project URL**: `https://xxxxxxxx.supabase.co`
   - **Anon Key**: Para frontend
   - **Service Role Key**: Para backend (SECRETO)

**Guardas en archivo seguro** (no commitear a git):
```
SUPABASE_URL=https://xxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1... (SECRETO)
```

### 2.2 Crear Email Service Account

**Opción A: SendGrid** (recomendado)
1. Ve a https://sendgrid.com
2. Sign up (free tier: 100 emails/día)
3. Crea API Key en "Settings" → "API Keys"
4. Anota: `SENDGRID_API_KEY=SG.xxxx`

**Opción B: Resend** (más simple)
1. Ve a https://resend.com
2. Sign up
3. API Key automática en dashboard
4. Anota: `RESEND_API_KEY=re_xxxxx`

### 2.3 Crear Vercel Account y Conectar GitHub

1. Ve a https://vercel.com
2. Sign up con GitHub
3. Autoriza Vercel a acceder repos
4. Ya estás listo para deployments

### 2.4 Estructura Local (Monorepo)

```bash
armentum/                          # Project root
├── frontend/                       # React app (nuevo)
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── backend/                        # FastAPI app (nuevo)
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                # Entry point
│   │   ├── models.py              # SQLAlchemy models
│   │   ├── schemas.py             # Pydantic schemas
│   │   ├── database.py            # DB config
│   │   ├── config.py              # Settings
│   │   └── routers/               # API routes
│   │       ├── auth.py
│   │       ├── users.py
│   │       ├── events.py
│   │       ├── attendance.py
│   │       ├── finances.py
│   │       └── communications.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── Dockerfile                 # Para Vercel
│   └── vercel.json               # Config Vercel
├── .github/
│   └── workflows/
│       └── deploy.yml             # CI/CD
├── PRD.md                         # Product Requirements
├── DEVELOPERS.md                  # Developer Guide
├── TECHNICAL_SETUP.md            # Este archivo
└── API_SPECIFICATION.md          # Detalle endpoints (próximo)
```

---

## 3. FRONTEND SETUP

### 3.1 Actualizar Estructura Actual

Tu proyecto actual está en `/src/app`. Convertirlo a estructura estándar:

```bash
# Ubicación actual
src/
├── app/
│   ├── pages/
│   ├── components/
│   └── ...
├── assets/
└── main.tsx

# Nueva estructura (después de refactor):
src/
├── components/               # Componentes reutilizables
│   ├── ui/                  # Componentes base (Button, Card, etc)
│   ├── Layout.tsx          # Header, Navbar, Footer
│   └── ...
├── pages/                   # Páginas/rutas (Home, Admin, etc)
│   ├── public/             # Zona pública
│   ├── corista/            # Zona corista
│   ├── admin/              # Zona admin
│   └── auth/               # Auth pages (Login, Register)
├── hooks/                   # Custom hooks
│   ├── useAuth.ts          # Auth context hook
│   ├── useFetch.ts         # Fetch wrapper
│   └── ...
├── services/               # API calls, utilities
│   ├── api.ts             # Axios config + instances
│   ├── auth.service.ts    # Auth API calls
│   └── ...
├── store/                  # Zustand state management
│   ├── authStore.ts       # Auth state
│   └── appStore.ts        # App state
├── types/                  # TypeScript types
│   ├── user.ts
│   ├── event.ts
│   └── ...
├── utils/                  # Utilities
│   ├── date.ts            # Date formatting
│   ├── validation.ts      # Form validation
│   └── ...
├── styles/                 # Global styles
│   └── globals.css
├── main.tsx               # Entry point
└── App.tsx                # Root component
```

### 3.2 Dependencias Necesarias

```bash
# Ya tienes muchas, agregar:
npm install zustand axios react-query

# Dev:
npm install -D vitest @testing-library/react @testing-library/user-event jsdom
npm install -D eslint prettier eslint-config-prettier eslint-plugin-react
```

### 3.3 Configuración TypeScript Strict

Crear/actualizar `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForEnumMembers": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## 4. BACKEND SETUP - FastAPI

### 4.1 Crear Estructura Backend

```bash
# En raíz del proyecto
mkdir backend
cd backend

# Python virtual environment
python3.11 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Crear estructura
mkdir -p app/routers
touch app/__init__.py app/main.py app/models.py app/schemas.py app/database.py app/config.py
touch requirements.txt .env.example vercel.json
```

### 4.2 Requirements.txt

```
# FastAPI & ASGI
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6

# Database
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
alembic==1.12.1

# Authentication
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
pydantic-settings==2.1.0

# Validation
pydantic==2.5.0
email-validator==2.1.0

# Environment variables
python-dotenv==1.0.0

# Email
sendgrid==6.10.0
# OR resend==0.4.0

# CORS
python-multipart==0.0.6

# Utilities
requests==2.31.0
```

### 4.3 app/config.py

```python
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost/armentum"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Email
    SENDGRID_API_KEY: Optional[str] = None
    RESEND_API_KEY: Optional[str] = None
    EMAIL_FROM: str = "noreply@armentum.com"
    
    # CORS
    CORS_ORIGINS: list = ["http://localhost:3000", "https://yourdomain.com"]
    
    # App
    DEBUG: bool = False
    ENVIRONMENT: str = "development"
    
    class Config:
        env_file = ".env"

settings = Settings()
```

### 4.4 app/database.py

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    future=True,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### 4.5 app/main.py - Estructura Base

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import auth, users, events, attendance, finances, communications

app = FastAPI(
    title="Armentum API",
    description="API para gestión de Estudio Coral",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(events.router, prefix="/api/events", tags=["events"])
app.include_router(attendance.router, prefix="/api/attendance", tags=["attendance"])
app.include_router(finances.router, prefix="/api/finances", tags=["finances"])
app.include_router(communications.router, prefix="/api/communications", tags=["communications"])

@app.get("/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

---

## 5. DATABASE SCHEMA - Tablas Principales

### 5.1 Crear Migrations (Alembic)

```bash
cd backend
alembic init migrations
```

### 5.2 Tablas Principales

```sql
-- users (Autenticación)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- roles (Control de acceso)
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    permisos JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- users_roles (Relación M:N)
CREATE TABLE users_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    UNIQUE(user_id, role_id)
);

-- miembros (Datos específicos de coristas)
CREATE TABLE miembros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    voz VARCHAR(50) NOT NULL, -- Soprano, Alto, Tenor, Bajo
    fecha_ingreso DATE NOT NULL,
    estado VARCHAR(50) DEFAULT 'activo', -- activo, inactivo, suspendido
    telefono VARCHAR(20),
    saldo_actual DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- eventos_publicos (Conciertos, eventos)
CREATE TABLE eventos_publicos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    lugar VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL, -- concierto, actividad, otro
    estado VARCHAR(50) DEFAULT 'planificado', -- planificado, confirmado, cancelado
    imagen_url VARCHAR(255),
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ensayos (Ensayos para coristas)
CREATE TABLE ensayos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo VARCHAR(50) NOT NULL, -- general, seccional, otra_actividad
    nombre VARCHAR(255),
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    lugar VARCHAR(255) NOT NULL,
    cuerdas VARCHAR(255), -- Para seccionales: Soprano,Alto,Tenor
    descripcion TEXT,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- asistencias (Registro de asistencias)
CREATE TABLE asistencias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    miembro_id UUID NOT NULL REFERENCES miembros(id) ON DELETE CASCADE,
    ensayo_id UUID NOT NULL REFERENCES ensayos(id) ON DELETE CASCADE,
    presente BOOLEAN DEFAULT true,
    justificacion TEXT,
    registrado_por UUID NOT NULL REFERENCES users(id),
    registrado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(miembro_id, ensayo_id)
);

-- cuotas (Cuotas mensuales/extraordinarias)
CREATE TABLE cuotas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    miembro_id UUID NOT NULL REFERENCES miembros(id) ON DELETE CASCADE,
    monto DECIMAL(10, 2) NOT NULL,
    descripcion VARCHAR(255),
    tipo VARCHAR(50) DEFAULT 'regular', -- regular, extraordinaria
    fecha_vencimiento DATE NOT NULL,
    estado VARCHAR(50) DEFAULT 'pendiente', -- pendiente, pagado, atrasado
    fecha_pago DATE,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- comunicados (Avisos para coristas)
CREATE TABLE comunicados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    dirigido_a VARCHAR(50), -- todos, grupo, individual
    grupo_destino VARCHAR(255), -- para filtros (ej: soprano, activos)
    miembro_destino UUID, -- para individual
    enviado_por UUID NOT NULL REFERENCES users(id),
    programado_para TIMESTAMP,
    enviado_en TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- archivos (Partituras, grabaciones)
CREATE TABLE archivos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL, -- partitura, grabacion
    voz VARCHAR(50), -- Para partituras: soprano, alto, tenor, bajo
    evento_id UUID REFERENCES eventos_publicos(id),
    ensayo_id UUID REFERENCES ensayos(id),
    url VARCHAR(255) NOT NULL, -- URL en Supabase Storage
    privado BOOLEAN DEFAULT true, -- true = solo coristas
    subido_por UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5.3 Row Level Security (RLS) - Importante para Seguridad

```sql
-- Habilitar RLS en tabla cuotas
ALTER TABLE cuotas ENABLE ROW LEVEL SECURITY;

-- Política: Coristas solo ven sus propias cuotas
CREATE POLICY cuotas_self_select ON cuotas
    FOR SELECT
    USING (
        miembro_id = (
            SELECT id FROM miembros WHERE user_id = auth.uid()
        )
    );

-- Política: Admins pueden ver todo
CREATE POLICY cuotas_admin_select ON cuotas
    FOR SELECT
    USING (
        auth.jwt() ->> 'role' = 'admin'
    );
```

---

## 6. VARIABLES DE ENTORNO

### 6.1 Frontend (.env.local)

```env
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...
VITE_APP_NAME=Armentum
```

### 6.2 Backend (.env)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/armentum

# JWT
SECRET_KEY=your-super-secret-key-change-in-production-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Email
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
EMAIL_FROM=noreply@armentum.com

# CORS
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]

# App
DEBUG=True
ENVIRONMENT=development
```

---

## 7. FLUJO DE AUTENTICACIÓN

### 7.1 Diagrama

```
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │ 1. Email + Password
       ▼
┌────────────────────────────────┐
│   POST /api/auth/register       │
│   o POST /api/auth/login        │
└────────────┬───────────────────┘
             │ 2. Validar credenciales
             ▼
┌────────────────────────────────┐
│   Generar JWT Token             │
│   - Incluir: user_id, role      │
│   - Expira en 30 min            │
└────────────┬───────────────────┘
             │ 3. Retornar tokens
             ▼
┌─────────────────────────────────┐
│   Frontend                       │
│   - Guarda token en localStorage │
│   - Incluye en header Auth       │
└─────────────────────────────────┘
       │ 4. Solicitudes posteriores
       │    Header: "Authorization: Bearer {token}"
       ▼
┌────────────────────────────────┐
│   FastAPI Middleware             │
│   - Verifica JWT válido          │
│   - Extrae user_id, role         │
│   - Inyecta en request           │
└────────────┬───────────────────┘
             │ 5. Procesa request
             ▼
┌────────────────────────────────┐
│   Endpoint Handler               │
│   - Acceso a user context        │
│   - Valida permisos si necesita  │
│   - Retorna datos                │
└────────────────────────────────┘
```

### 7.2 Endpoints Auth

```
POST /api/auth/register
  Body: { email, password, nombre }
  Response: { access_token, refresh_token, user }

POST /api/auth/login
  Body: { email, password }
  Response: { access_token, refresh_token, user }

POST /api/auth/refresh
  Body: { refresh_token }
  Response: { access_token }

POST /api/auth/logout
  Headers: { Authorization: Bearer ... }
  Response: { message: "Logged out" }

GET /api/auth/me
  Headers: { Authorization: Bearer ... }
  Response: { user }
```

---

## 8. DEPLOYMENT - Vercel + Supabase

### 8.1 Deploy Frontend en Vercel

```bash
# En raíz del proyecto
vercel login

# Primera vez
vercel deploy --prod

# Configurar variables en Vercel dashboard:
# VITE_API_URL = https://armentum.vercel.app/api (o URL del backend)
# VITE_SUPABASE_URL = ...
# VITE_SUPABASE_ANON_KEY = ...
```

### 8.2 Deploy Backend en Vercel

**vercel.json**:
```json
{
  "buildCommand": "pip install -r requirements.txt",
  "outputDirectory": "backend",
  "env": {
    "DATABASE_URL": "@database_url",
    "SECRET_KEY": "@secret_key",
    "SENDGRID_API_KEY": "@sendgrid_api_key"
  }
}
```

```bash
# En raíz
vercel deploy backend/ --prod
```

---

## 9. CI/CD WORKFLOW

### 9.1 GitHub Actions (.github/workflows/deploy.yml)

```yaml
name: Deploy Armentum

on:
  push:
    branches: [main]

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: 3.11
      
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
      
      - name: Run tests
        run: |
          cd backend
          pytest
      
      - name: Deploy to Vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## 10. DESARROLLO LOCAL

### 10.1 Startup Scripts

**start-dev.sh**:
```bash
#!/bin/bash

# Terminal 1: Frontend
cd frontend
npm install
npm run dev

# Terminal 2: Backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
python app/main.py

# Terminal 3 (opcional): Supabase local
npm install -g supabase
supabase start
```

### 10.2 URLs Desarrollo
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Supabase: http://localhost:54321 (si local)

---

## 11. CHECKLIST PRE-LANZAMIENTO

- [ ] Supabase project creado y configurado
- [ ] Email service (SendGrid/Resend) configurado
- [ ] Vercel projects creados (frontend + backend)
- [ ] GitHub repo con CI/CD workflows
- [ ] Ambiente de desarrollo funcionando localmente
- [ ] Base de datos migrada (Alembic)
- [ ] Tests unitarios escritos (>80% coverage)
- [ ] Documentación API completa (FastAPI /docs)
- [ ] Variables secretas en Vercel
- [ ] SSL certificados (Vercel lo hace automático)
- [ ] Backups configurados en Supabase

