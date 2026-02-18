# Armentum Development Tasks

## Resumen

| Metrica | Valor |
|---------|-------|
| Total Tareas | 47 |
| Fases | 8 |
| Timeline | 8 semanas |
| Prioridad Alta | 35 |
| Prioridad Media | 10 |
| Prioridad Baja | 2 |

## Priorizacion Especial

- **Auth** (Prioridad 1): T018-T024, T025-T028
- **Finanzas** (Prioridad 2): T010, T043-T044, T061-T063, T047, T069

## Diagrama de Dependencias

```
FASE 1: FOUNDATION (Semana 1-2)
├── Backend Setup
├── Database Schema
└── Auth System ────────────────► [Base para todo]

FASE 2: AUTH (Semana 2-3)
├── JWT Implementation
├── Login/Register API
└── Auth Middleware ────────────► [Requerido para zonas privadas]

FASE 3: PUBLIC ZONE (Semana 3-4)
├── Home Page API
├── Events API
└── Frontend Integration ───────► [Sin dependencias de auth]

FASE 4: CORISTA ZONE (Semana 4-6)
├── Members CRUD
├── Rehearsals API
├── Attendance API
├── Finance API ★
└── Frontend Corista Pages ─────► [Depende de Auth + Members]

FASE 5: ADMIN ZONE (Semana 5-7)
├── Admin Dashboard API
├── Members Management API
├── Events Management API
├── Finance Management API ★
└── Admin Frontend Pages ───────► [Depende de todo lo anterior]

FASE 6: FILES & COMMS (Semana 6-7)
├── File Upload (Supabase)
├── Communications API
└── Downloads Center ───────────► [Depende de Auth + Storage]

FASE 7: TESTING (Semana 7-8)
├── Unit Tests
├── Integration Tests
└── E2E Tests ──────────────────► [Depende de funcionalidad completa]

FASE 8: DEPLOY & POLISH (Semana 8)
├── CI/CD Refinement
├── Performance Optimization
└── Security Audit ─────────────► [Final]
```

---

## FASE 1: FOUNDATION (Semana 1-2)

### 1.1 Backend Setup

| ID | Tarea | Agente | Dependencias | Prioridad | Track |
|----|-------|--------|--------------|-----------|-------|
| T001 | Crear estructura backend/ | Backend | - | Alta | backend |
| T002 | Configurar FastAPI + requirements.txt | Backend | T001 | Alta | backend |
| T003 | Configurar SQLAlchemy + conexion Supabase | Database | T002 | Alta | database |
| T004 | Crear modelos Pydantic (schemas) | Backend | T003 | Alta | backend |
| T005 | Configurar CORS y middleware | Backend | T002 | Alta | backend |
| T006 | Crear vercel.json para backend | CI/CD | T002 | Alta | cicd |

### 1.2 Database Schema

| ID | Tarea | Agente | Dependencias | Prioridad | Track |
|----|-------|--------|--------------|-----------|-------|
| T007 | Crear tablas users, roles, users_roles | Database | T003 | Alta | database |
| T008 | Crear tabla miembros | Database | T007 | Alta | database |
| T009 | Crear tablas eventos_publicos, ensayos | Database | T007 | Alta | database |
| T010 | Crear tablas asistencias, cuotas | Database | T008, T009 | Alta | database |
| T011 | Crear tablas comunicados, archivos | Database | T008, T009 | Alta | database |
| T012 | Configurar RLS (Row Level Security) | Database | T007-T011 | Alta | database |
| T013 | Crear indices y constraints | Database | T007-T011 | Media | database |
| T014 | Seed data inicial (roles admin) | Database | T007 | Alta | database |

### 1.3 Environment & Config

| ID | Tarea | Agente | Dependencias | Prioridad | Track |
|----|-------|--------|--------------|-----------|-------|
| T015 | Crear .env para backend | Backend | - | Alta | backend |
| T016 | Configurar SendGrid/Resend | Backend | T015 | Media | backend |
| T017 | Crear Supabase Storage buckets | Backend | - | Media | backend |

---

## FASE 2: AUTHENTICATION (Semana 2-3) ★ PRIORIDAD

### 2.1 Auth API

| ID | Tarea | Agente | Dependencias | Prioridad | Track |
|----|-------|--------|--------------|-----------|-------|
| T018 | Implementar JWT generation/validation | Backend | T007 | Alta | backend |
| T019 | Crear endpoint POST /auth/register | Backend | T018 | Alta | backend |
| T020 | Crear endpoint POST /auth/login | Backend | T018 | Alta | backend |
| T021 | Crear endpoint POST /auth/refresh | Backend | T018 | Alta | backend |
| T022 | Crear middleware de autenticacion | Backend | T018 | Alta | backend |
| T023 | Implementar email verification | Backend | T016, T019 | Media | backend |
| T024 | Crear endpoint GET /auth/me | Backend | T022 | Alta | backend |

### 2.2 Auth Frontend Integration

| ID | Tarea | Agente | Dependencias | Prioridad | Track |
|----|-------|--------|--------------|-----------|-------|
| T025 | Conectar Login.tsx con API real | Frontend | T020 | Alta | frontend |
| T026 | Implementar refresh token logic | Frontend | T021 | Alta | frontend |
| T027 | Crear ProtectedRoute component | Frontend | T022 | Alta | frontend |
| T028 | Crear Logout functionality | Frontend | T025 | Alta | frontend |

---

## FASE 3: PUBLIC ZONE (Semana 3-4)

### 3.1 Public APIs

| ID | Tarea | Agente | Dependencias | Prioridad | Track |
|----|-------|--------|--------------|-----------|-------|
| T029 | GET /events (listar eventos publicos) | Backend | T009 | Alta | backend |
| T030 | GET /events/:id (detalle evento) | Backend | T009 | Alta | backend |
| T031 | GET /news (listar noticias) | Backend | - | Media | backend |
| T032 | GET /pages/:slug (historia, mision) | Backend | - | Baja | backend |

### 3.2 Public Frontend

| ID | Tarea | Agente | Dependencias | Prioridad | Track |
|----|-------|--------|--------------|-----------|-------|
| T033 | Integrar Home.tsx con API eventos | Frontend | T029 | Alta | frontend |
| T034 | Crear servicio eventsService.ts | Frontend | T029 | Alta | frontend |
| T035 | Integrar Eventos.tsx con API | Frontend | T029, T030 | Alta | frontend |
| T036 | Integrar Noticias.tsx con API | Frontend | T031 | Media | frontend |

---

## FASE 4: CORISTA ZONE (Semana 4-6)

### 4.1 Members API

| ID | Tarea | Agente | Dependencias | Prioridad | Track |
|----|-------|--------|--------------|-----------|-------|
| T037 | GET /members/me (perfil propio) | Backend | T008, T022 | Alta | backend |
| T038 | PUT /members/me (actualizar perfil) | Backend | T008, T022 | Media | backend |

### 4.2 Rehearsals API

| ID | Tarea | Agente | Dependencias | Prioridad | Track |
|----|-------|--------|--------------|-----------|-------|
| T039 | GET /rehearsals (calendario ensayos) | Backend | T009, T022 | Alta | backend |
| T040 | GET /rehearsals/:id (detalle ensayo) | Backend | T009, T022 | Alta | backend |

### 4.3 Attendance API

| ID | Tarea | Agente | Dependencias | Prioridad | Track |
|----|-------|--------|--------------|-----------|-------|
| T041 | GET /attendance/me (mis asistencias) | Backend | T010, T022 | Alta | backend |
| T042 | GET /attendance/stats (estadisticas) | Backend | T010, T022 | Media | backend |

### 4.4 Finance API ★ PRIORIDAD

| ID | Tarea | Agente | Dependencias | Prioridad | Track |
|----|-------|--------|--------------|-----------|-------|
| T043 | GET /finance/me (mis cuotas) | Backend | T010, T022 | Alta | backend |
| T044 | GET /finance/me/history (historial) | Backend | T010, T022 | Media | backend |

### 4.5 Corista Frontend

| ID | Tarea | Agente | Dependencias | Prioridad | Track |
|----|-------|--------|--------------|-----------|-------|
| T045 | Crear pagina Calendario Corista | Frontend | T039, T040 | Alta | frontend |
| T046 | Crear pagina Mis Asistencias | Frontend | T041, T042 | Alta | frontend |
| T047 | Crear pagina Finanzas Corista ★ | Frontend | T043, T044 | Alta | frontend |
| T048 | Crear pagina Descargas Corista | Frontend | T070-T072 | Media | frontend |

---

## FASE 5: ADMIN ZONE (Semana 5-7)

### 5.1 Admin Members API

| ID | Tarea | Agente | Dependencias | Prioridad | Track |
|----|-------|--------|--------------|-----------|-------|
| T049 | GET /admin/members (listar todos) | Backend | T008, T022 | Alta | backend |
| T050 | POST /admin/members (crear miembro) | Backend | T008, T022 | Alta | backend |
| T051 | PUT /admin/members/:id (editar) | Backend | T008, T022 | Alta | backend |
| T052 | DELETE /admin/members/:id (soft delete) | Backend | T008, T022 | Media | backend |

### 5.2 Admin Events API

| ID | Tarea | Agente | Dependencias | Prioridad | Track |
|----|-------|--------|--------------|-----------|-------|
| T053 | POST /admin/events (crear evento) | Backend | T009, T022 | Alta | backend |
| T054 | PUT /admin/events/:id (editar) | Backend | T009, T022 | Alta | backend |
| T055 | DELETE /admin/events/:id | Backend | T009, T022 | Media | backend |

### 5.3 Admin Rehearsals API

| ID | Tarea | Agente | Dependencias | Prioridad | Track |
|----|-------|--------|--------------|-----------|-------|
| T056 | POST /admin/rehearsals (crear ensayo) | Backend | T009, T022 | Alta | backend |
| T057 | PUT /admin/rehearsals/:id | Backend | T009, T022 | Alta | backend |
| T058 | DELETE /admin/rehearsals/:id | Backend | T009, T022 | Media | backend |

### 5.4 Admin Attendance API

| ID | Tarea | Agente | Dependencias | Prioridad | Track |
|----|-------|--------|--------------|-----------|-------|
| T059 | POST /admin/attendance (registrar) | Backend | T010, T022 | Alta | backend |
| T060 | GET /admin/attendance/reports | Backend | T010, T022 | Alta | backend |

### 5.5 Admin Finance API ★ PRIORIDAD

| ID | Tarea | Agente | Dependencias | Prioridad | Track |
|----|-------|--------|--------------|-----------|-------|
| T061 | POST /admin/finance/dues (crear cuota) | Backend | T010, T022 | Alta | backend |
| T062 | PUT /admin/finance/payments (registrar pago) | Backend | T010, T022 | Alta | backend |
| T063 | GET /admin/finance/reports | Backend | T010, T022 | Alta | backend |

### 5.6 Admin Frontend

| ID | Tarea | Agente | Dependencias | Prioridad | Track |
|----|-------|--------|--------------|-----------|-------|
| T064 | Refactorizar Admin.tsx con tabs | Frontend | - | Alta | frontend |
| T065 | Crear AdminMembers component | Frontend | T049-T052 | Alta | frontend |
| T066 | Crear AdminEvents component | Frontend | T053-T055 | Alta | frontend |
| T067 | Crear AdminRehearsals component | Frontend | T056-T058 | Alta | frontend |
| T068 | Crear AdminAttendance component | Frontend | T059, T060 | Alta | frontend |
| T069 | Crear AdminFinance component ★ | Frontend | T061-T063 | Alta | frontend |

---

## FASE 6: FILES & COMMUNICATIONS (Semana 6-7)

### 6.1 Files API

| ID | Tarea | Agente | Dependencias | Prioridad | Track |
|----|-------|--------|--------------|-----------|-------|
| T070 | POST /admin/files (upload to Supabase) | Backend | T017, T022 | Alta | backend |
| T071 | GET /files (listar archivos) | Backend | T011, T022 | Alta | backend |
| T072 | DELETE /admin/files/:id | Backend | T011, T022 | Media | backend |

### 6.2 Communications API

| ID | Tarea | Agente | Dependencias | Prioridad | Track |
|----|-------|--------|--------------|-----------|-------|
| T073 | POST /admin/communications (crear) | Backend | T011, T022 | Alta | backend |
| T074 | GET /communications (mis comunicados) | Backend | T011, T022 | Alta | backend |
| T075 | PUT /communications/:id/read | Backend | T011, T022 | Media | backend |

### 6.3 Files Frontend

| ID | Tarea | Agente | Dependencias | Prioridad | Track |
|----|-------|--------|--------------|-----------|-------|
| T076 | Crear UploadFiles component | Frontend | T070 | Media | frontend |
| T077 | Crear DownloadsCenter component | Frontend | T071 | Media | frontend |
| T078 | Crear Communications component | Frontend | T074 | Media | frontend |

---

## FASE 7: TESTING (Semana 7-8)

### 7.1 Backend Tests

| ID | Tarea | Agente | Dependencias | Prioridad | Track |
|----|-------|--------|--------------|-----------|-------|
| T079 | Tests para auth endpoints | Testing | T018-T024 | Alta | testing |
| T080 | Tests para CRUD miembros | Testing | T037-T052 | Alta | testing |
| T081 | Tests para eventos y ensayos | Testing | T029-T058 | Alta | testing |
| T082 | Tests para finanzas | Testing | T043-T063 | Alta | testing |
| T083 | Tests para archivos | Testing | T070-T072 | Media | testing |

### 7.2 Frontend Tests

| ID | Tarea | Agente | Dependencias | Prioridad | Track |
|----|-------|--------|--------------|-----------|-------|
| T084 | Tests para Login/Register | Testing | T025-T028 | Alta | testing |
| T085 | Tests para paginas publicas | Testing | T033-T036 | Media | testing |
| T086 | Tests para zona corista | Testing | T045-T048 | Alta | testing |
| T087 | Tests para zona admin | Testing | T064-T069 | Alta | testing |

### 7.3 E2E Tests

| ID | Tarea | Agente | Dependencias | Prioridad | Track |
|----|-------|--------|--------------|-----------|-------|
| T088 | E2E: Flujo login completo | Testing | T025-T028 | Alta | testing |
| T089 | E2E: Flujo admin crear evento | Testing | T053-T055 | Alta | testing |
| T090 | E2E: Flujo corista ver calendario | Testing | T039-T040 | Media | testing |

---

## FASE 8: DEPLOY & POLISH (Semana 8)

### 8.1 CI/CD & Deploy

| ID | Tarea | Agente | Dependencias | Prioridad | Track |
|----|-------|--------|--------------|-----------|-------|
| T091 | Crear GitHub Actions workflow backend | CI/CD | T006 | Alta | cicd |
| T092 | Configurar deploy backend Vercel | CI/CD | T091 | Alta | cicd |
| T093 | Configurar migraciones automaticas | CI/CD | T091 | Alta | cicd |

### 8.2 Optimization & Security

| ID | Tarea | Agente | Dependencias | Prioridad | Track |
|----|-------|--------|--------------|-----------|-------|
| T094 | Implementar rate limiting | Backend | T005 | Media | backend |
| T095 | Audit de seguridad (SQL injection, XSS) | Architecture | All APIs | Alta | backend |
| T096 | Optimizar queries N+1 | Database | All APIs | Media | database |
| T097 | Implementar caching headers | Backend | T005 | Baja | backend |

### 8.3 Documentation

| ID | Tarea | Agente | Dependencias | Prioridad | Track |
|----|-------|--------|--------------|-----------|-------|
| T098 | Documentar APIs con OpenAPI/Swagger | Backend | All APIs | Media | backend |
| T099 | Crear guias de usuario | Planning | All | Baja | docs |
| T100 | Actualizar README final | Architecture | All | Baja | docs |

---

## Asignacion por Agente

### Backend Agent (opencode/gpt-5.1-codex-mini)
**Total Tareas**: 35
**Estimado**: 40-50 horas
**Costo**: ~$3-5/mes (estimado 10-15M tokens)
```
T001-T006, T015-T024, T029-T032, T037-T044,
T049-T063, T070-T075, T094-T098
```

### Frontend Agent (opencode/claude-haiku-4-5)
**Total Tareas**: 20
**Estimado**: 30-35 horas
**Costo**: ~$5-8/mes (estimado 5-8M tokens)
```
T025-T028, T033-T036, T045-T048, T064-T069, T076-T078
```

### Database Agent (opencode/glm-4.7-free)
**Total Tareas**: 9
**Estimado**: 12-15 horas
**Costo**: FREE
```
T003, T007-T014, T096
```

### Testing Agent (opencode/glm-4.7-free)
**Total Tareas**: 12
**Estimado**: 15-20 horas
**Costo**: FREE
```
T079-T090
```

### CI/CD Agent (opencode/glm-4.7-free)
**Total Tareas**: 3
**Estimado**: 5-8 horas
**Costo**: FREE
```
T006, T091-T093
```

### Orchestration Agent (opencode/glm-4.7-free)
**Costo**: FREE

### Planning Agent (opencode/glm-4.7-free)
**Total Tareas**: 1
**Estimado**: 2-3 horas
**Costo**: FREE
```
T099
```

### Architecture Agent (opencode/glm-4.7-free)
**Total Tareas**: 2
**Estimado**: 4-6 horas
**Costo**: FREE
```
T095, T100
```

### UI/UX Agent (opencode/glm-4.7-free)
**Total Tareas**: 4
**Estimado**: 8-10 horas
**Costo**: FREE
```
T045, T064, T069, T076 (diseno de componentes nuevos)
```

**COSTO TOTAL MENSUAL**: $8-13 (7 agentes FREE + 2 agentes de bajo costo)

---

## Cronograma MVP (8 Semanas)

| Semana | Fase | Agentes Activos | Entregables |
|--------|------|-----------------|-------------|
| 1 | Foundation | Backend, Database | Backend corriendo, DB lista |
| 2 | Auth + Foundation | Backend, Database, Frontend | Login funcional |
| 3 | Public Zone | Backend, Frontend | Paginas publicas con datos reales |
| 4 | Corista Zone I | Backend, Frontend | Calendario + Asistencias |
| 5 | Corista Zone II + Finance | Backend, Frontend | Finanzas + Descargas |
| 6 | Admin Zone I | Backend, Frontend | CRUD miembros + eventos |
| 7 | Admin Zone II + Files | Backend, Frontend, Testing | Admin completo + archivos |
| 8 | Testing + Deploy | Testing, CI/CD | MVP deployado |

---

## Labels de GitHub

### Por Fase
- `phase:foundation`
- `phase:auth`
- `phase:public`
- `phase:corista`
- `phase:admin`
- `phase:files`
- `phase:testing`
- `phase:deploy`

### Por Prioridad
- `priority:critical` - Auth y Finanzas
- `priority:high`
- `priority:medium`
- `priority:low`

### Por Track (paralelizacion)
- `track:backend`
- `track:frontend`
- `track:database`
- `track:testing`
- `track:cicd`
- `track:docs`

### Por Feature
- `feature:auth`
- `feature:finance`
- `feature:events`
- `feature:members`
- `feature:attendance`
- `feature:files`
- `feature:communications`

---

## Ver Progreso

- **GitHub Issues**: https://github.com/manuelsanc/armentum/issues
- **GitHub Project**: Ver board Kanban
- **Milestones**: Ver milestones por semana

---

**Ultima actualizacion**: Febrero 2026
**Total tareas**: 100 (47 principales + 53 subtareas)
**Estado**: Listo para desarrollo
