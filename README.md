# Armentum - Plataforma Integral de Gestión Coral

**Bienvenido a Armentum**, una plataforma moderna para centralizar la gestión del Estudio Coral Armentum.

## 🚀 Inicio Rápido

### Para nuevos developers
```bash
cd /Users/manuel/Projects/armentum

# OPCIÓN 1: Si tienes prisa
cat SETUP_CHECKLIST.md  # Sigue paso-a-paso (12-14 horas)

# OPCIÓN 2: Si quieres entender primero
cat PRD.md               # Léeme primero (2 horas)
cat README_IMPLEMENTATION.md  # Guía general (30 min)
```

### Para correr localmente
```bash
# Terminal 1: Backend
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app/main.py
# → http://localhost:8000/docs

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

## 📚 Documentación Completa

### 📋 Para Entender el Producto
- **[PRD.md](./PRD.md)** (595 líneas)
  - Visión, objetivos, features por zona
  - Historias de usuario, timeline 8 semanas
  - Personas, permisos, priorización

### 🛠️ Para Entender la Arquitectura
- **[TECHNICAL_SETUP.md](./TECHNICAL_SETUP.md)** (795 líneas)
  - Arquitectura técnica completa
  - Setup paso-a-paso
  - Database schema (10 tablas)
  - Deployment en Vercel + Supabase

- **[API_SPECIFICATION.md](./API_SPECIFICATION.md)** (1,165 líneas)
  - 30+ endpoints documentados
  - Request/Response ejemplos
  - Error handling, paginación, rate limiting

### 👨‍💻 Para Codificar
- **[DEVELOPERS.md](./DEVELOPERS.md)** (183 líneas)
  - Code style guidelines
  - TypeScript strict mode
  - Naming conventions, error handling
  - **Guardar como referencia diaria**

- **[SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)** (610 líneas)
  - 8 fases de setup (12-14 horas)
  - Paso-a-paso con checklists
  - Troubleshooting incluido

### 📖 Para Navegar
- **[README_IMPLEMENTATION.md](./README_IMPLEMENTATION.md)** (377 líneas)
  - Guía general y punto de entrada
  - 3 opciones de inicio según tu rol
  - Búsqueda rápida
  
- **[DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)** (252 líneas)
  - Índice completo
  - Referencias rápidas
  - Checklist antes de empezar

---

## 🎯 Tech Stack

```
Frontend:      React 18 + TypeScript + Vite + Tailwind CSS
Backend:       FastAPI + Python 3.11
Database:      PostgreSQL (Supabase)
Auth:          JWT + Email verification
Email:         SendGrid o Resend
Hosting:       Vercel
Version:       GitHub
CI/CD:         GitHub Actions
```

---

## 📊 Proyecto

| Aspecto | Detalles |
|---------|----------|
| **Usuarios** | 35 coristas + 1,000 visitantes |
| **Zonas** | Pública, Corista (privada), Admin |
| **Features** | 3 zonas, 8+ features por zona |
| **APIs** | 30+ endpoints |
| **BD** | 10 tablas PostgreSQL |
| **Timeline MVP** | 8 semanas |
| **Documentación** | 4,465 líneas |

---

## 📋 Checklist Antes de Empezar

- [ ] Leí PRD.md (entiendo qué construimos)
- [ ] Leí README_IMPLEMENTATION.md (sé por dónde empezar)
- [ ] Tengo Python 3.11+ y Node.js instalados
- [ ] Tengo cuentas: Supabase, Vercel, GitHub
- [ ] Seguí SETUP_CHECKLIST.md (ambiente listo)

---

## 🗂️ Estructura del Proyecto

```
armentum/
├── frontend/              # React app (Vite)
├── backend/               # FastAPI app (Python)
├── .github/workflows/     # CI/CD
├── PRD.md                 ← LÉEME PRIMERO
├── TECHNICAL_SETUP.md     ← ARQUITECTURA
├── API_SPECIFICATION.md   ← ENDPOINTS
├── DEVELOPERS.md          ← CODE STYLE
├── SETUP_CHECKLIST.md     ← SETUP GUÍA
├── README_IMPLEMENTATION.md
└── DOCUMENTATION_INDEX.md
```

---

## 🚀 Próximos Pasos

### Hoy
1. Lee **PRD.md** completamente (2 horas)
2. Entiende la visión del proyecto

### Mañana
1. Inicia **SETUP_CHECKLIST.md** (Fase 1 - Cuentas)
2. Registra en Supabase, SendGrid, Vercel

### Este fin de semana
1. Completa **SETUP_CHECKLIST.md** (12-14 horas)
2. Tendrás todo funcionando localmente

### Semana que viene
1. Empieza a implementar features MVP
2. Consulta **API_SPECIFICATION.md** para endpoints
3. Sigue **DEVELOPERS.md** para code style

---

## 📞 Documentación Rápida

**¿Qué vamos a construir?** → [PRD.md](./PRD.md)  
**¿Cómo es la arquitectura?** → [TECHNICAL_SETUP.md](./TECHNICAL_SETUP.md)  
**¿Qué APIs hay?** → [API_SPECIFICATION.md](./API_SPECIFICATION.md)  
**¿Cómo codifico?** → [DEVELOPERS.md](./DEVELOPERS.md)  
**¿Cómo configuro?** → [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)  
**¿Por dónde empiezo?** → [README_IMPLEMENTATION.md](./README_IMPLEMENTATION.md)  

---

## ✨ Características Principales

### 🌐 Zona Pública
- Página de inicio con información
- Historia y misión de la coral
- Noticias (integración Instagram)
- Calendario de eventos públicos

### 🔐 Zona Corista (privada)
- Calendario de ensayos (generales, seccionales, actividades)
- Avisos y comunicaciones
- Control de asistencia personal
- Dashboard financiero (cuotas propias)
- Centro de descargas (partituras, grabaciones)

### ⚙️ Zona Administrador
- Gestión de miembros
- Gestión de eventos públicos
- Calendario de ensayos
- Control de asistencia
- Gestión financiera (cuotas, cobros)
- Envío de comunicados
- 5 roles con permisos granulares

---

## 🔐 Seguridad

- ✅ JWT authentication con refresh tokens
- ✅ Row Level Security (RLS) en base de datos
- ✅ Contraseñas hasheadas (bcrypt)
- ✅ HTTPS en producción
- ✅ CORS configurado
- ✅ Rate limiting en APIs

---

## 📈 Roadmap

### MVP (8 semanas) ✅
- Todas las 3 zonas funcionales
- Autenticación y autorización
- Base de datos completa
- APIs documentadas
- Deployment en Vercel

### Fase 2 (Semanas 9-12)
- Integración Instagram API
- Reportes avanzados
- Exportar a Excel
- Notificaciones por email
- Integración Google Calendar

### Fase 3 (Futuro)
- Pagos online
- App móvil
- Análisis avanzados
- Sistema de penalizaciones
- Integración WhatsApp

---

## 🤝 Contribuyendo

1. Lee **DEVELOPERS.md** para code style
2. Sigue naming conventions y patterns
3. Crea branches descriptivas: `feat/`, `fix/`, `docs/`
4. Haz commits atómicos y descriptivos
5. Push a GitHub y crea PR

---

## 📞 Soporte

Si algo no funciona:
1. Revisa **SETUP_CHECKLIST.md** sección troubleshooting
2. Revisa **TECHNICAL_SETUP.md** sección relevante
3. Revisa **DEVELOPERS.md** para issues de código

---

## 📄 Licencia

Proyecto privado - Estudio Coral Armentum

---

**¡Listo para comenzar?** Lee [README_IMPLEMENTATION.md](./README_IMPLEMENTATION.md) 🚀

Última actualización: Febrero 2026  
Documentación: 4,465 líneas  
Estado: Listo para desarrollo MVP
