# Setup Checklist - Armentum

Esta es tu guía paso-a-paso para setear todo el proyecto Armentum. Marca cada ítem conforme completes.

---

## ✅ FASE 1: CUENTAS Y SERVICIOS EXTERNOS (2-3 horas)

### Supabase Setup
- [ ] Ir a https://supabase.com
- [ ] Crear cuenta (usa tu email)
- [ ] Crear proyecto nuevo: `armentum`
- [ ] Seleccionar región cercana
- [ ] Esperar a que cree (2-3 min)
- [ ] Ir a Settings → API
- [ ] Copiar y guardar:
  - [ ] `SUPABASE_URL` (ej: https://xxxxx.supabase.co)
  - [ ] `SUPABASE_ANON_KEY` (ej: eyJhbGciOi...)
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` (SECRETO - no compartir)
- [ ] Ir a SQL Editor
- [ ] Copiar todo el SQL de TECHNICAL_SETUP.md sección 5.2
- [ ] Ejecutar SQL para crear tablas

### Email Service Setup
- [ ] Elegir: SendGrid O Resend
  
**Si elige SendGrid**:
- [ ] Ir a https://sendgrid.com
- [ ] Crear cuenta (usa tu email)
- [ ] Ir a Settings → API Keys
- [ ] Crear nueva API key
- [ ] Copiar: `SENDGRID_API_KEY` (ej: SG.xxxxx)
- [ ] Usar en .env como `SENDGRID_API_KEY=SG.xxxxx`

**Si elige Resend**:
- [ ] Ir a https://resend.com
- [ ] Crear cuenta (usa tu email)
- [ ] API key automática en dashboard
- [ ] Copiar: `RESEND_API_KEY` (ej: re_xxxxx)
- [ ] Usar en .env como `RESEND_API_KEY=re_xxxxx`

### Vercel Setup
- [ ] Ir a https://vercel.com
- [ ] Sign up con GitHub (o crear cuenta)
- [ ] Autorizar Vercel a acceder repos GitHub
- [ ] No crear proyecto todavía (lo haremos más adelante)

### GitHub (si no tienes repo)
- [ ] Ir a https://github.com
- [ ] Crear repo: `armentum` (público o privado)
- [ ] Clone localmente:
  ```bash
  git clone https://github.com/TU_USUARIO/armentum.git
  cd armentum
  ```
- [ ] Agregar archivos (PRD.md, TECHNICAL_SETUP.md, etc)
- [ ] `git add .`
- [ ] `git commit -m "initial: add documentation"`
- [ ] `git push origin main`

---

## ✅ FASE 2: SETUP LOCAL - BACKEND (2-3 horas)

### Estructura de Carpetas
```bash
# En raíz del proyecto armentum/
mkdir -p backend/app/routers

# Crear archivos
cd backend
touch app/__init__.py
touch app/main.py
touch app/models.py
touch app/schemas.py
touch app/database.py
touch app/config.py
touch requirements.txt
touch .env
touch .env.example
touch vercel.json
```

- [ ] Carpetas y archivos creados

### Python Virtual Environment
```bash
# En backend/
python3.11 -m venv venv

# macOS/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate
```

- [ ] Virtual environment activado (verás `(venv)` en terminal)

### Dependencias Backend
```bash
# Asegúrate que venv está activado, luego:
pip install fastapi uvicorn python-multipart sqlalchemy psycopg2-binary alembic python-jose passlib pydantic-settings pydantic email-validator python-dotenv sendgrid requests

# O si usas requirements.txt:
pip install -r requirements.txt
```

- [ ] Todas las dependencias instaladas (`pip list` debe mostrar todo)

### Crear archivos de configuración

**backend/requirements.txt** - Copia de TECHNICAL_SETUP.md sección 4.2

- [ ] `requirements.txt` creado con todas las librerías

**backend/app/config.py** - Copia de TECHNICAL_SETUP.md sección 4.3

- [ ] `app/config.py` creado

**backend/app/database.py** - Copia de TECHNICAL_SETUP.md sección 4.4

- [ ] `app/database.py` creado

**backend/.env** - Copia de TECHNICAL_SETUP.md sección 6.2

```env
# Backend .env (no commitear a git)
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/armentum
SECRET_KEY=your-super-secret-key-min-32-characters-change-in-prod
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
SENDGRID_API_KEY=SG.xxxxx
EMAIL_FROM=noreply@armentum.com
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]
DEBUG=True
ENVIRONMENT=development
```

- [ ] `.env` creado con valores reales
- [ ] `.env` añadido a `.gitignore` (NO commitear)

**backend/app/main.py** - Copia de TECHNICAL_SETUP.md sección 4.5

- [ ] `app/main.py` creado (starter code)

### Crear carpeta routers
```bash
# En backend/app/
mkdir routers
touch routers/__init__.py
touch routers/auth.py
touch routers/users.py
touch routers/events.py
touch routers/attendance.py
touch routers/finances.py
touch routers/communications.py
```

- [ ] Carpeta `routers/` creada con archivos iniciales vacíos

### Probar Backend Básico
```bash
# En backend/ con venv activado
python app/main.py
```

- [ ] Backend inicia sin errores en http://localhost:8000
- [ ] Puedo acceder http://localhost:8000/docs (documentación automática)
- [ ] Puedo acceder http://localhost:8000/health (devuelve {"status": "ok"})

---

## ✅ FASE 3: SETUP LOCAL - FRONTEND (1-2 horas)

### Estructura Frontend Actual
Tu proyecto actual en `/src/app` está bien. Opcionalmente refactor a:
```
src/
├── components/
│   ├── ui/
│   ├── Layout.tsx
│   └── ...
├── pages/
│   ├── public/
│   ├── corista/
│   ├── admin/
│   └── auth/
├── hooks/
├── services/
├── store/
├── types/
├── styles/
├── main.tsx
└── App.tsx
```

- [ ] Entiendo la estructura frontend (no cambiar todavía)

### Actualizar dependencias
```bash
# En frontend/
npm install zustand axios

# Dev dependencies
npm install -D vitest @testing-library/react @testing-library/user-event jsdom
npm install -D eslint prettier eslint-config-prettier eslint-plugin-react
```

- [ ] Nuevas dependencias instaladas

### Frontend .env.local
```env
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
VITE_APP_NAME=Armentum
```

- [ ] `.env.local` creado en frontend/
- [ ] `.env.local` en `.gitignore` (NO commitear)

### Probar Frontend
```bash
# En frontend/
npm run dev
```

- [ ] Frontend inicia en http://localhost:5173
- [ ] Página carga sin errores de consola

---

## ✅ FASE 4: CONECTAR FRONTEND Y BACKEND (2 horas)

### Crear servicio API (Frontend)
**src/services/api.ts**:
```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

- [ ] `src/services/api.ts` creado

### Crear Auth Service (Frontend)
**src/services/auth.service.ts**:
```typescript
import api from './api';

export const authService = {
  register: (email: string, password: string, nombre: string) =>
    api.post('/auth/register', { email, password, nombre }),
  
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
  
  me: () => api.get('/auth/me'),
};
```

- [ ] `src/services/auth.service.ts` creado

### Crear Auth Router (Backend)
**backend/app/routers/auth.py** (estructura básica):
```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter()

@router.post("/register")
async def register(db: Session = Depends(get_db)):
    # TODO: Implementar
    pass

@router.post("/login")
async def login(db: Session = Depends(get_db)):
    # TODO: Implementar
    pass

@router.get("/me")
async def get_current_user(db: Session = Depends(get_db)):
    # TODO: Implementar
    pass
```

- [ ] `backend/app/routers/auth.py` creado con estructura

### Probar conectividad
```bash
# Terminal 1: Backend
cd backend
source venv/bin/activate
python app/main.py

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Test en navegador
# Abrir http://localhost:5173
# Abrir DevTools → Console
# Verificar que NO hay CORS errors
```

- [ ] Frontend y Backend se comunican sin errores CORS

---

## ✅ FASE 5: BASE DE DATOS (1 hora)

### Crear tablas en Supabase
- [ ] Ya creadas en Fase 1 (ejecutaste SQL)
- [ ] Verificar en Supabase dashboard → Table Editor:
  - [ ] `users`
  - [ ] `roles`
  - [ ] `users_roles`
  - [ ] `miembros`
  - [ ] `eventos_publicos`
  - [ ] `ensayos`
  - [ ] `asistencias`
  - [ ] `cuotas`
  - [ ] `comunicados`
  - [ ] `archivos`

### Crear conexión desde Backend a DB
```bash
# En backend/
psql "postgresql://USER:PASSWORD@localhost:5432/armentum"
# o si usas Supabase remote:
psql "postgresql://postgres.xxxxx:password@db.xxxxx.supabase.co:5432/postgres"
```

- [ ] Puedes conectarte a BD desde terminal
- [ ] Puedes ver tablas con `\dt`

### Crear modelos SQLAlchemy
**backend/app/models.py** - Copia estructuras de TECHNICAL_SETUP.md sección 5

- [ ] `app/models.py` creado con modelos SQLAlchemy

### Probar conexión BD desde FastAPI
```bash
# En backend/app/main.py agregar endpoint de test:
@app.get("/test-db")
async def test_db(db: Session = Depends(get_db)):
    return {"status": "connected"}
```

- [ ] `http://localhost:8000/test-db` devuelve `{"status": "connected"}`

---

## ✅ FASE 6: GITHUB Y CI/CD (1 hora)

### Configurar GitHub
```bash
# En raíz del proyecto
git add .
git commit -m "feat: setup backend, frontend, database"
git push origin main
```

- [ ] Cambios pusheados a main branch

### Crear .gitignore
```
# Environments
venv/
.venv
env/
ENV/
.env
.env.local
.env.*.local

# Frontend
node_modules/
dist/
build/
.DS_Store

# IDEs
.vscode/
.idea/
*.swp
*.swo
*~

# Supabase
supabase/.env.local
```

- [ ] `.gitignore` creado/actualizado
- [ ] Verificar con `git status` que .env no aparece

### Crear GitHub Actions Workflow
**`.github/workflows/deploy.yml`** - Copia de TECHNICAL_SETUP.md sección 9.1

- [ ] `.github/workflows/deploy.yml` creado

### Vercel Deployment Setup
```bash
# Instalar Vercel CLI
npm install -g vercel

# Autenticar
vercel login

# Crear proyectos (frontend primero)
cd frontend
vercel --prod

# Backend
cd ../backend
vercel --prod
```

- [ ] Frontend deployado en Vercel
- [ ] Backend deployado en Vercel (o en Railway/Render como alternativa)
- [ ] Notas URLs:
  - Frontend: `https://xxxx.vercel.app`
  - Backend: `https://xxxx.vercel.app/api`

---

## ✅ FASE 7: TESTING LOCAL COMPLETO (2 horas)

### Flujo de Registro (E2E local)
```bash
# 1. Backend corriendo: python app/main.py
# 2. Frontend corriendo: npm run dev
# 3. En frontend, crear componente LoginForm
# 4. Hacer POST a /api/auth/register con email, password, nombre
# 5. Verificar respuesta con token
# 6. Guardar token en localStorage
```

- [ ] Puedo registrarme en interfaz
- [ ] Token se guarda en localStorage
- [ ] No hay errores en consola

### Verificar Base de Datos
```bash
# En Supabase SQL editor
SELECT * FROM users LIMIT 5;
# Debe mostrar usuario recién creado
```

- [ ] Nuevo usuario aparece en tabla `users`

### Verificar Integración
```
http://localhost:5173 → Intenta registrar
↓
POST http://localhost:8000/api/auth/register
↓
Guarda en PostgreSQL via Supabase
↓
Retorna token JWT
↓
Frontend guarda en localStorage
```

- [ ] Flujo completo funciona end-to-end

---

## ✅ FASE 8: DOCUMENTACIÓN Y CLEANUP (1 hora)

### Documentación
- [ ] Leí completo TECHNICAL_SETUP.md
- [ ] Leí completo API_SPECIFICATION.md
- [ ] Leí completo DEVELOPERS.md
- [ ] Entiendo PRD.md

### Cleanup
- [ ] No hay archivos `.env` committed
- [ ] No hay `node_modules/` en git
- [ ] No hay `venv/` en git
- [ ] `.gitignore` está completo
- [ ] No hay credenciales en código

### README.md actualizado
```markdown
# Armentum - Plataforma de Gestión Coral

## Setup Rápido

### Backend
```bash
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app/main.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Accede http://localhost:5173

## Documentación
- [PRD.md](./PRD.md) - Requisitos del producto
- [TECHNICAL_SETUP.md](./TECHNICAL_SETUP.md) - Setup técnico
- [API_SPECIFICATION.md](./API_SPECIFICATION.md) - Especificación de APIs
- [DEVELOPERS.md](./DEVELOPERS.md) - Guía de desarrollo
```

- [ ] README.md actualizado

### Commit Final
```bash
git add .
git commit -m "chore: setup complete, ready for development"
git push origin main
```

- [ ] Commit pusheado a main

---

## ✅ LISTO PARA DESARROLLO!

Si marcaste todos los checkboxes anteriores:
- ✅ Backend corriendo localmente
- ✅ Frontend corriendo localmente
- ✅ Base de datos conectada y funcionando
- ✅ Autenticación básica working
- ✅ GitHub con CI/CD configurado
- ✅ Vercel deployments listos
- ✅ Documentación completa

**Próximo paso**: Empezar a implementar features según PRD.md MVP Fase 1

---

## 🆘 TROUBLESHOOTING

### Backend no inicia
```bash
# Verificar Python version
python3 --version  # Debe ser 3.11+

# Verificar venv
source venv/bin/activate
pip list

# Verificar DATABASE_URL en .env
echo $DATABASE_URL
```

### Frontend no se conecta a Backend
```bash
# Verificar CORS en backend (app/main.py)
# Verificar VITE_API_URL en .env.local
# En DevTools → Network, ver requests a /api
```

### Base de datos no conecta
```bash
# Probar conexión directa
psql "postgresql://USER:PASSWORD@localhost:5432/armentum"

# O con Supabase:
psql "postgresql://postgres.xxxx:password@db.xxxx.supabase.co:5432/postgres"
```

### No puedo acceder Supabase
- Verificar email de confirmación
- Resetear password si es necesario
- Verificar que proyecto está en región correcta

---

**¡Éxito en el setup! 🎉**

Tiempo estimado total: **12-14 horas** (dependiendo de familiaridad con tech stack)

