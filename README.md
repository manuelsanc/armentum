# Armentum - Plataforma Integral de Gestión Coral

**Bienvenido a Armentum**, una plataforma moderna para centralizar la gestión del Estudio Coral Armentum.

## 📚 📖 DOCUMENTACIÓN CENTRALIZADA EN `docs/`

**Toda la documentación del proyecto está organizada en la carpeta `docs/`**

```
docs/
├── README.md                          ← COMIENZA AQUÍ
├── product/                           # Requisitos del producto
├── technical/                         # Arquitectura y setup
├── development/                       # Code style y desarrollo
└── setup/                             # Setup paso-a-paso
```

**Lee [docs/README.md](./docs/README.md) para navegar toda la documentación.**

---

## 🚀 Inicio Rápido

### Para nuevos developers
```bash
# 1. Lee la documentación en docs/
cd docs/
cat README.md

# 2. Sigue setup paso-a-paso (12-14 horas)
cat setup/SETUP_CHECKLIST.md

# 3. Cuando termines
cd ../frontend
npm run dev              # http://localhost:5173

# En otra terminal
cd ../backend
python app/main.py      # http://localhost:8000/docs
```

### Para correr localmente (ya configurado)
```bash
# Terminal 1: Backend
cd backend
source venv/bin/activate
python app/main.py

# Terminal 2: Frontend
cd frontend
npm run dev
```

---

## 📊 Proyecto

| Aspecto | Valor |
|---------|-------|
| **Usuarios** | 35 coristas + 1,000 visitantes |
| **Documentación** | [docs/](./docs/) (4,465 líneas) |
| **Tech Stack** | React + FastAPI + PostgreSQL + Vercel |
| **Timeline MVP** | 8 semanas |
| **Features** | 25+ funcionalidades |
| **APIs** | 30+ endpoints |
| **Database** | 10 tablas PostgreSQL |

---

## 🎯 Tech Stack

```
Frontend:      React 18 + TypeScript + Vite + Tailwind CSS
Backend:       FastAPI + Python 3.11
Database:      PostgreSQL (Supabase)
Auth:          JWT + Email verification
Hosting:       Vercel
CI/CD:         GitHub Actions
```

---

## 📋 Estructura del Proyecto

```
armentum/
├── docs/                      # 📚 DOCUMENTACIÓN COMPLETA
│   ├── README.md              # ← COMIENZA AQUÍ
│   ├── product/               # Requisitos (PRD)
│   ├── technical/             # Arquitectura (Setup + APIs)
│   ├── development/           # Code style + Agentes
│   └── setup/                 # Setup paso-a-paso
├── frontend/                  # React app
├── backend/                   # FastAPI app (próximo)
├── .github/workflows/         # CI/CD
└── README.md                  # Este archivo
```

---

## 📚 Documentación Completa

| Carpeta | Archivo | Líneas | Propósito |
|---------|---------|--------|----------|
| **product/** | PRD.md | 595 | Requisitos del producto |
| **technical/** | TECHNICAL_SETUP.md | 795 | Arquitectura y setup |
| **technical/** | API_SPECIFICATION.md | 1,165 | 30+ endpoints |
| **development/** | DEVELOPERS.md | 183 | Code style (guardar!) |
| **development/** | AGENTS.md | 489 | Sistema multi-agente |
| **setup/** | SETUP_CHECKLIST.md | 610 | Setup paso-a-paso |
| **docs/** | DOCUMENTATION_INDEX.md | 252 | Índice y búsqueda |
| **docs/** | README.md | 300+ | Índice principal |

**Total**: 4,465+ líneas de documentación profesional

---

## ✅ Checklist Antes de Empezar

- [ ] Leí `docs/README.md`
- [ ] Leí `docs/product/PRD.md`
- [ ] Tengo Python 3.11+ y Node.js instalados
- [ ] Tengo cuentas: GitHub, Supabase, Vercel
- [ ] Voy a seguir `docs/setup/SETUP_CHECKLIST.md`

---

## 🚀 Próximos Pasos

### Opción 1: Entender el proyecto
```bash
cat docs/README.md                  # 5 min - Navegación
cat docs/product/README.md          # 30 min - Features summary
cat docs/product/PRD.md             # 2h - Completo
```

### Opción 2: Setup local inmediato
```bash
cat docs/setup/README.md            # 5 min - Overview
cat docs/setup/SETUP_CHECKLIST.md   # 12-14h - Paso-a-paso
```

### Opción 3: Arquitectura técnica
```bash
cat docs/technical/README.md        # 15 min - Overview
cat docs/technical/TECHNICAL_SETUP.md   # 2h - Completo
cat docs/technical/API_SPECIFICATION.md # 1h - APIs
```

---

## 🔍 Búsqueda Rápida

**Necesito info sobre...** | **Ir a...**
---|---
Qué vamos a construir | `docs/product/PRD.md`
Features por zona | `docs/product/README.md`
Arquitectura | `docs/technical/TECHNICAL_SETUP.md`
APIs a implementar | `docs/technical/API_SPECIFICATION.md`
Setup local | `docs/setup/SETUP_CHECKLIST.md`
Code style | `docs/development/DEVELOPERS.md`
Sistema de agentes | `docs/development/AGENTS.md`
Índice completo | `docs/DOCUMENTATION_INDEX.md`

---

## 🤝 Contribuyendo

1. Lee `docs/development/DEVELOPERS.md` para code style
2. Sigue naming conventions y patterns
3. Crea branches: `feat/`, `fix/`, `docs/`
4. Commits descriptivos
5. Push y crea PR

---

## 📞 Soporte

Si algo no funciona:
1. Revisa `docs/setup/SETUP_CHECKLIST.md` (troubleshooting)
2. Revisa `docs/technical/TECHNICAL_SETUP.md` (sección relevante)
3. Revisa `docs/development/DEVELOPERS.md` (issues de código)

---

## 📄 Licencia

Proyecto privado - Estudio Coral Armentum

---

## 🎯 ¿Qué sigue?

**[👉 Lee docs/README.md para empezar](./docs/README.md)** 🚀

**Última actualización**: Febrero 2026  
**Estado**: Documentación completa, listo para desarrollo  
**Documentación**: 4,465+ líneas en `docs/`

