# Índice de Documentación - Armentum

Esta es la documentación técnica completa para el proyecto Armentum. Úsalo como referencia durante todo el desarrollo.

---

## 📚 Documentos Disponibles

### 1. 📋 **PRD.md** - Requisitos del Producto
**595 líneas** | Ideal para: Product Management, Stakeholders, Planning

**Contenidos**:
- ✅ Resumen Ejecutivo con Visión
- ✅ Personas de Usuario (4 tipos)
- ✅ Features por Zona (Pública, Corista, Admin)
- ✅ Historias de Usuario con Criterios de Aceptación
- ✅ Matriz de Permisos por Rol
- ✅ Priorización MVP + Fase 2 + Fase 3
- ✅ Requisitos Técnicos e Integraciones
- ✅ Métricas de Éxito
- ✅ Timeline 8 semanas

**Cuándo usarlo**:
- Antes de comenzar cualquier feature
- Para alinear con stakeholders
- Como referencia de scope

---

### 2. 🛠️ **TECHNICAL_SETUP.md** - Setup Técnico y Arquitectura
**795 líneas** | Ideal para: Developers, DevOps, Technical Leads

**Contenidos**:
- ✅ Visión técnica general (diagrama de arquitectura)
- ✅ Setup inicial paso a paso (Supabase, Email, Vercel, GitHub)
- ✅ Frontend setup (estructura, dependencias, TypeScript)
- ✅ Backend setup FastAPI (estructura, requirements, config)
- ✅ Database schema completo (SQL para todas las tablas)
- ✅ Row Level Security (RLS) para seguridad
- ✅ Variables de entorno (frontend + backend)
- ✅ Flujo de autenticación con diagrama
- ✅ Deployment en Vercel + Supabase
- ✅ CI/CD workflows GitHub Actions
- ✅ Setup de desarrollo local
- ✅ Checklist pre-lanzamiento

**Cuándo usarlo**:
- Para setear el ambiente de desarrollo
- Para configurar bases de datos
- Para entender la arquitectura
- Para deployments

---

### 3. 🔌 **API_SPECIFICATION.md** - Especificación de APIs
**1165 líneas** | Ideal para: Backend Developers, Frontend Developers, Integration

**Contenidos**:
- ✅ 8 secciones de API (Auth, Users, Members, Events, Rehearsals, Attendance, Finances, Communications)
- ✅ 30+ endpoints documentados
- ✅ Request/Response examples (JSON)
- ✅ Códigos de error
- ✅ Paginación
- ✅ Rate limiting
- ✅ Webhooks (Fase 2+)

**Endpoints Documentados**:
- `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `GET /auth/me`, `POST /auth/logout`
- `GET /users`, `POST /users`, `PATCH /users/{id}`, `DELETE /users/{id}`, `POST /users/{id}/roles`
- `GET /members`, `POST /members`, `GET /members/me`, `PATCH /members/{id}`
- `GET /events`, `POST /events`, `PATCH /events/{id}`, `DELETE /events/{id}`
- `GET /rehearsals`, `POST /rehearsals`, `PATCH /rehearsals/{id}`, `DELETE /rehearsals/{id}`
- `POST /attendance/record`, `GET /attendance/me`, `GET /attendance/reports`
- `GET /finances/me`, `POST /finances/quotas`, `POST /finances/payments`, `GET /finances/reports`
- `GET /communications`, `POST /communications`, `PATCH /communications/{id}`
- `GET /files`, `POST /files/upload`, `GET /files/{id}/download`, `DELETE /files/{id}`

**Cuándo usarlo**:
- Al implementar endpoints backend
- Al integrar desde frontend
- Para generar documentación automática
- Para testing/validation

---

### 4. 👨‍💻 **DEVELOPERS.md** - Guía de Desarrollo
**183 líneas** | Ideal para: Todos los developers

**Contenidos**:
- ✅ Build/Run commands
- ✅ Code style guidelines (imports, naming, TypeScript, formatting)
- ✅ Error handling patterns
- ✅ Component patterns
- ✅ Testing setup (Vitest, React Testing Library, Playwright)
- ✅ Project structure
- ✅ Git & CI/CD
- ✅ Agent instructions (DO NOT modify AGENTS.md, etc)
- ✅ Common mistakes to avoid

**Cuándo usarlo**:
- Diariamente durante desarrollo
- Para PR reviews
- Para onboarding nuevos developers
- Como referencia rápida

---

### 5. 🤖 **AGENTS.md** - Sistema Multi-Agente
**489 líneas** | Ideal para: AI Agents, Agentic Coding

**Contenidos**:
- ✅ 9 agentes especializados (Orchestration, Planning, Architecture, UI/UX, Frontend, Backend, Database, Testing, CI/CD)
- ✅ Modelos recomendados para cada agente (Claude, GPT-4o-mini, free models)
- ✅ Tech stack completo
- ✅ Flujos de comunicación entre agentes
- ✅ MCP servers requeridos
- ✅ Costo optimization ($50-100/mes)

**Cuándo usarlo**:
- Para coordinación de trabajo agentico
- Para entender qué agente usa qué herramientas
- Como referencia de arquitectura de agentes

---

## 🚀 ROADMAP DE LECTURA RECOMENDADO

### Para Developers
1. **DEVELOPERS.md** - Guía rápida de coding (15 min)
2. **TECHNICAL_SETUP.md** - Setear ambiente (1 hora)
3. **API_SPECIFICATION.md** - Entender endpoints (30 min)
4. **PRD.md** - Entender features (1 hora)

### Para Product Managers
1. **PRD.md** - Visión completa (2 horas)
2. **TECHNICAL_SETUP.md** - Overview técnico (30 min)
3. **API_SPECIFICATION.md** - Integración (30 min)

### Para DevOps/DevSecOps
1. **TECHNICAL_SETUP.md** - Infrastructure (1 hora)
2. **API_SPECIFICATION.md** - Rate limiting & security (30 min)
3. **DEVELOPERS.md** - CI/CD section (15 min)

---

## 🎯 INICIO RÁPIDO - 5 PASOS

```bash
# 1. Leer PRD para entender features
cat PRD.md

# 2. Setup ambiente local
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cd ../frontend
npm install
npm run dev

# 3. Crear cuentas (Supabase, SendGrid, Vercel)
# Ver TECHNICAL_SETUP.md secciones 2.1-2.3

# 4. Setup BD
# Ver TECHNICAL_SETUP.md sección 5.2 (schema)

# 5. Empezar desarrollo
# Ver DEVELOPERS.md para code style
# Ver API_SPECIFICATION.md para endpoints a implementar
```

---

## 📊 ESTADÍSTICAS DE DOCUMENTACIÓN

| Documento | Líneas | Palabras | Secciones | Cuándo Leer |
|---|---|---|---|---|
| PRD.md | 595 | ~4,500 | 11 | Inicio del proyecto |
| TECHNICAL_SETUP.md | 795 | ~6,000 | 11 | Setup técnico |
| API_SPECIFICATION.md | 1,165 | ~8,500 | 13 | Implementación APIs |
| DEVELOPERS.md | 183 | ~1,200 | 9 | Diariamente |
| AGENTS.md | 489 | ~3,200 | 11 | Coordinar agentes |
| **TOTAL** | **3,227** | **~23,400** | **55** | **Referencia** |

---

## 🔍 BÚSQUEDA RÁPIDA

### Necesito información sobre...

**Autenticación**
- → TECHNICAL_SETUP.md sección 7 (Flujo Auth)
- → API_SPECIFICATION.md sección 1 (Auth endpoints)

**Base de Datos**
- → TECHNICAL_SETUP.md sección 5 (Database schema)
- → Usar: PostgreSQL + Supabase RLS

**Desarrollo Frontend**
- → DEVELOPERS.md (Code style)
- → PRD.md sección 3 (Features)
- → TECHNICAL_SETUP.md sección 3 (Frontend setup)

**APIs a Implementar**
- → API_SPECIFICATION.md (todos los endpoints)
- → TECHNICAL_SETUP.md sección 4 (Backend structure)

**Deployment**
- → TECHNICAL_SETUP.md sección 8 (Vercel + Supabase)
- → TECHNICAL_SETUP.md sección 9 (CI/CD)

**Permisos y Roles**
- → PRD.md sección 5 (Permission matrix)
- → TECHNICAL_SETUP.md sección 5.3 (RLS en DB)

**Timeline y Priorización**
- → PRD.md sección 6 (MVP vs Fase 2+)
- → PRD.md sección 10 (Timeline 8 semanas)

---

## ✅ CHECKLIST ANTES DE EMPEZAR

- [ ] He leído PRD.md completo
- [ ] He leído DEVELOPERS.md
- [ ] He entendido la arquitectura en TECHNICAL_SETUP.md
- [ ] Tengo acceso a Supabase project
- [ ] Tengo acceso a Vercel projects
- [ ] Tengo configurado email service (SendGrid/Resend)
- [ ] He creado .env files con variables necesarias
- [ ] He corrido `npm install` en frontend
- [ ] He corrido `pip install -r requirements.txt` en backend
- [ ] Puedo acceder http://localhost:5173 (frontend)
- [ ] Puedo acceder http://localhost:8000/docs (backend)

---

## 📞 REFERENCIAS ÚTILES

- **Figma Mockups**: https://www.figma.com/design/bvjvsmbEKDfzb2jOW1Bmmi/Mockup-sitio-web-coral
- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **React Docs**: https://react.dev
- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs

---

**Versión**: 1.0  
**Última actualización**: Febrero 2026  
**Mantenedor**: Equipo Armentum

