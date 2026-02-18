# 🛠️ Documentación Técnica

## Contenido

### TECHNICAL_SETUP.md (795 líneas)
**Setup técnico y arquitectura completa** - Cómo está estructurado el proyecto y cómo configurarlo.

**Incluye**:
- ✅ Visión técnica (diagrama de arquitectura)
- ✅ Setup inicial paso-a-paso (Supabase, Email, Vercel)
- ✅ Frontend setup (React/Vite/TypeScript)
- ✅ Backend setup (FastAPI/Python)
- ✅ Database schema (10 tablas SQL)
- ✅ Row Level Security (RLS)
- ✅ Variables de entorno
- ✅ Flujo de autenticación JWT
- ✅ Deployment (Vercel + Supabase)
- ✅ CI/CD (GitHub Actions)
- ✅ Checklist pre-lanzamiento

### API_SPECIFICATION.md (1,165 líneas)
**Especificación completa de APIs** - Todos los endpoints documentados con ejemplos.

**Incluye**:
- ✅ 30+ endpoints documentados
- ✅ 8 secciones (Auth, Users, Members, Events, Rehearsals, Attendance, Finances, Communications, Files)
- ✅ Request/Response ejemplos en JSON
- ✅ Códigos de error
- ✅ Paginación
- ✅ Rate limiting
- ✅ Webhooks (Fase 2)

---

## 🏗️ Arquitectura en 1 minuto

```
Frontend (React)          Backend (FastAPI)        Database (PostgreSQL)
    ↓                           ↓                          ↓
localhost:5173    ←HTTP/JSON→  localhost:8000   ←SQL→  Supabase
                      API                    

Vercel                  Vercel              Supabase Hosted
```

---

## 🎯 Cuándo leer cada documento

| Documento | Para | Tiempo | Sección |
|-----------|------|--------|---------|
| TECHNICAL_SETUP | Todos | 2 horas | 1-11 |
| TECHNICAL_SETUP | DevOps | 1 hora | 8, 9 |
| TECHNICAL_SETUP | Frontend | 30 min | 3 |
| TECHNICAL_SETUP | Backend | 1 hora | 4, 5 |
| API_SPECIFICATION | Backend devs | 2 horas | 1-9 |
| API_SPECIFICATION | Frontend devs | 1 hora | Endpoints específicos |

---

## 🔧 Tech Stack

```
Frontend:      React 18 + TypeScript + Vite + Tailwind CSS
Backend:       FastAPI + Python 3.11
Database:      PostgreSQL (Supabase)
Auth:          JWT + Email verification
Email:         SendGrid o Resend
Hosting:       Vercel
Storage:       Supabase Storage
Version:       GitHub
CI/CD:         GitHub Actions
```

---

## 📊 Números Técnicos

| Métrica | Valor |
|---------|-------|
| API Endpoints | 30+ |
| Database Tablas | 10 |
| Auth Method | JWT + refresh tokens |
| Frontend Framework | React 18 |
| Backend Framework | FastAPI |
| Database | PostgreSQL |
| Hosting | Vercel (ambos) |

---

## 🔗 Secciones Principales

### TECHNICAL_SETUP.md

1. **Visión Técnica** - Diagrama y flujo de datos
2. **Setup Inicial** - Cuentas externas (Supabase, Email, Vercel)
3. **Frontend Setup** - Estructura, dependencias, TypeScript
4. **Backend Setup** - FastAPI, configuración, estructura
5. **Database Schema** - SQL para 10 tablas
6. **Variables de Entorno** - Frontend + Backend
7. **Autenticación** - JWT flow con diagrama
8. **Deployment** - Vercel + Supabase
9. **CI/CD** - GitHub Actions workflows
10. **Desarrollo Local** - Cómo correr todo
11. **Checklist** - Pre-lanzamiento

### API_SPECIFICATION.md

1. **Authentication** - Register, login, refresh, logout, me
2. **Users Management** - CRUD de usuarios
3. **Members/Coristas** - Datos específicos de miembros
4. **Events (Público)** - Eventos para públicos
5. **Rehearsals/Ensayos** - Calendario de ensayos
6. **Attendance** - Control de asistencias
7. **Finances** - Cuotas, pagos, reportes
8. **Communications** - Avisos y mensajes
9. **Files** - Partituras y grabaciones

---

## 🚀 Empezar

1. **Leer TECHNICAL_SETUP.md sección 1-2** (30 min) - Entender arquitectura
2. **Leer TECHNICAL_SETUP.md sección 3-5** (1 hora) - Entender setup
3. **Consultar API_SPECIFICATION.md** - Al implementar endpoints

---

## 🔗 Enlaces relacionados

- [README.md](../README.md) - Guía general
- [PRD.md](../product/PRD.md) - Requisitos
- [SETUP_CHECKLIST.md](../setup/SETUP_CHECKLIST.md) - Setup paso-a-paso
- [DEVELOPERS.md](../development/DEVELOPERS.md) - Code style

