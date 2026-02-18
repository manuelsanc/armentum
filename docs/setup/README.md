# 📋 Documentación de Setup

## Contenido

### SETUP_CHECKLIST.md (610 líneas)
**Guía paso-a-paso para setup local** - Exactamente qué hacer para tener todo corriendo.

**Incluye 8 Fases**:
1. ✅ **Fase 1: Cuentas y Servicios Externos** (2-3h)
   - Supabase project setup
   - Email service (SendGrid o Resend)
   - Vercel account
   - GitHub repository
   - SQL database creation

2. ✅ **Fase 2: Setup Local - Backend** (2-3h)
   - Python virtual environment
   - Backend dependencies
   - Configuración FastAPI
   - Archivos de configuración

3. ✅ **Fase 3: Setup Local - Frontend** (1-2h)
   - Dependencias nuevas
   - Variables de entorno
   - Test básico

4. ✅ **Fase 4: Conectar Frontend y Backend** (2h)
   - Servicio API
   - Auth service
   - Conectividad testing

5. ✅ **Fase 5: Base de Datos** (1h)
   - Crear tablas en Supabase
   - Verificar conexión
   - Modelos SQLAlchemy

6. ✅ **Fase 6: GitHub y CI/CD** (1h)
   - Configurar .gitignore
   - GitHub Actions
   - Vercel deployment

7. ✅ **Fase 7: Testing Local Completo** (2h)
   - Flujo de registro E2E
   - Verificar BD
   - Integración completa

8. ✅ **Fase 8: Documentación y Cleanup** (1h)
   - README actualizado
   - Cleanup final
   - Commit final

**Tiempo Total**: 12-14 horas

---

## 📊 Resumen de Fases

| Fase | Título | Tiempo | Qué haces |
|------|--------|--------|-----------|
| 1 | Cuentas externas | 2-3h | Supabase, Email, Vercel, GitHub |
| 2 | Backend local | 2-3h | Python venv, FastAPI, configuración |
| 3 | Frontend local | 1-2h | Deps, .env, test |
| 4 | Conectar F+B | 2h | API services, testing |
| 5 | Base de datos | 1h | SQL, conexión, modelos |
| 6 | GitHub & CI/CD | 1h | .gitignore, workflows, Vercel |
| 7 | Testing E2E | 2h | Flujo completo, verificación |
| 8 | Cleanup | 1h | README, git, final commit |

---

## ✅ Checklist Pre-Lectura

Antes de empezar SETUP_CHECKLIST.md:

- [ ] Tienes Python 3.11+ instalado
- [ ] Tienes Node.js + npm instalado
- [ ] Tienes Git instalado
- [ ] Tienes cuenta GitHub
- [ ] Tienes editor (VS Code, etc)
- [ ] Entiendes lo básico de terminal/bash
- [ ] Leíste PRD.md (qué vamos a construir)
- [ ] Leíste TECHNICAL_SETUP.md (cómo está diseñado)

---

## 🚀 Inicio Rápido - 3 Pasos

1. **Lee esta página** (5 min)
   ```bash
   cat README.md  # Estás aquí
   ```

2. **Sigue SETUP_CHECKLIST.md paso-a-paso** (12-14h)
   ```bash
   cat SETUP_CHECKLIST.md
   # Ir marcando checkboxes conforme avanzas
   ```

3. **Cuando termines**
   ```bash
   # Backend debe estar en http://localhost:8000/docs
   # Frontend debe estar en http://localhost:5173
   # Bases de datos debe tener todas las tablas
   # .env files creados (NO commiteados)
   # Vercel projects deployados
   ```

---

## 📋 Requisitos Mínimos

### Hardware
- Al menos 4GB RAM
- 10GB espacio libre
- Conexión a internet

### Software
- Python 3.11+ → https://www.python.org/
- Node.js 18+ → https://nodejs.org/
- Git → https://git-scm.com/
- Terminal (bash, zsh, PowerShell)

### Cuentas Online
- GitHub → https://github.com
- Supabase → https://supabase.com
- Vercel → https://vercel.com
- SendGrid O Resend → https://sendgrid.com o https://resend.com

---

## 🎯 Objetivos al Final de Setup

Cuando completes SETUP_CHECKLIST.md:

- ✅ Backend corriendo en http://localhost:8000
- ✅ Frontend corriendo en http://localhost:5173
- ✅ Base de datos con 10 tablas en Supabase
- ✅ Autenticación básica funcionando
- ✅ Frontend ↔ Backend comunicación funcionando
- ✅ Vercel projects creados y deployados
- ✅ GitHub Actions workflows en place
- ✅ Variables de entorno configuradas
- ✅ .env files ignorados en Git
- ✅ Registro básico E2E funcionando

---

## 🆘 Si algo no funciona

Cada fase tiene una sección "Troubleshooting":

1. Backend no inicia? → Ver sección Troubleshooting Fase 2
2. Frontend no se conecta? → Ver sección Troubleshooting Fase 4
3. BD no conecta? → Ver sección Troubleshooting Fase 5
4. Vercel deployment falla? → Ver sección Troubleshooting Fase 6

---

## 📁 Archivos que vas a crear/modificar

```
Nuevo:
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── config.py
│   │   ├── database.py
│   │   └── routers/
│   ├── venv/
│   ├── requirements.txt
│   ├── .env
│   └── vercel.json
├── .github/workflows/
│   └── deploy.yml
├── .gitignore
└── README.md (actualizado)

Modificados:
├── frontend/
│   ├── src/
│   │   ├── services/
│   │   ├── store/
│   │   └── .env.local
│   └── package.json
```

---

## ⏱️ Timeline Realista

| Tiempo | Qué hacer |
|--------|-----------|
| Hora 0 | Leer este README.md (5 min) |
| Hora 0.5 | Fase 1: Crear cuentas (2-3h) |
| Hora 3-4 | Fase 2: Backend local (2-3h) |
| Hora 5-7 | Fase 3-4: Frontend + conexión (3-4h) |
| Hora 8-9 | Fase 5-6: BD + GitHub (2h) |
| Hora 9-10 | Fase 7-8: Testing + Cleanup (2h) |

**Total**: 12-14 horas en 1-2 días

---

## 🔗 Enlaces relacionados

- [README.md](../README.md) - Guía general
- [TECHNICAL_SETUP.md](../technical/TECHNICAL_SETUP.md) - Arquitectura (leer primero)
- [PRD.md](../product/PRD.md) - Requisitos (leer antes de setup)
- [DEVELOPERS.md](../development/DEVELOPERS.md) - Code style (después del setup)

---

## 💡 Pro Tips

1. **Ten dos terminales abiertas**: Una para backend, una para frontend
2. **Usa VS Code**: Tiene integración Git y terminal
3. **Guarda credenciales en lugar seguro**: Supabase keys, SendGrid keys, etc
4. **Commit frecuentemente**: Especialmente después de cada fase
5. **Verifica checklist**: Marca cada item para no olvidar
6. **Lee troubleshooting**: Antes de pedir ayuda

---

**¡Listo?** → Abre `SETUP_CHECKLIST.md` y comienza Fase 1 🚀

