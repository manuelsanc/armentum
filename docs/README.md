# 📚 Documentación - Armentum

Bienvenido a la documentación centralizada de Armentum. Aquí encontrarás todo lo que necesitas para entender, configurar y desarrollar el proyecto.

---

## 🗂️ Estructura de Documentación

```
docs/
├── README.md                       ← Estás aquí
├── DOCUMENTATION_INDEX.md          ← Índice completo (búsqueda rápida)
│
├── product/                        # 📋 Requisitos del Producto
│   ├── README.md
│   └── PRD.md (595 líneas)
│
├── technical/                      # 🛠️ Arquitectura y Setup Técnico
│   ├── README.md
│   ├── TECHNICAL_SETUP.md (795 líneas)
│   └── API_SPECIFICATION.md (1,165 líneas)
│
├── development/                    # 👨‍💻 Desarrollo y Code Style
│   ├── README.md
│   ├── DEVELOPERS.md (183 líneas)
│   └── AGENTS.md (489 líneas)
│
└── setup/                          # 📋 Setup Paso-a-Paso
    ├── README.md
    └── SETUP_CHECKLIST.md (610 líneas)
```

---

## 🎯 ¿Por dónde empiezo?

### Opción A: Quiero entender el proyecto
1. Lee: [product/PRD.md](./product/PRD.md) (2 horas)
   - Qué vamos a construir
   - Features por zona
   - Timeline 8 semanas
2. Lee: [technical/README.md](./technical/README.md) (30 min)
   - Overview arquitectura

### Opción B: Quiero empezar a codificar
1. Sigue: [setup/SETUP_CHECKLIST.md](./setup/SETUP_CHECKLIST.md) (12-14 horas)
   - Setup completo local
2. Lee: [development/DEVELOPERS.md](./development/DEVELOPERS.md) (30 min)
   - Code style (guardar como referencia diaria)
3. Consulta: [technical/API_SPECIFICATION.md](./technical/API_SPECIFICATION.md)
   - Endpoints a implementar

### Opción C: Soy DevOps/Architect
1. Lee: [technical/TECHNICAL_SETUP.md](./technical/TECHNICAL_SETUP.md) (2 horas)
   - Arquitectura completa
   - Database schema
   - Deployment strategy
2. Lee: [technical/API_SPECIFICATION.md](./technical/API_SPECIFICATION.md) (1 hora)
   - Especificación de APIs

---

## 📚 Documentación por Carpeta

### 📋 [product/](./product/)
**Para entender QUÉ construimos**

- [PRD.md](./product/PRD.md) - Requisitos del producto
  - Visión y objetivos
  - 4 personas de usuario
  - 3 zonas con 25+ features
  - Historias de usuario
  - Timeline MVP (8 semanas)

### 🛠️ [technical/](./technical/)
**Para entender CÓMO está diseñado**

- [TECHNICAL_SETUP.md](./technical/TECHNICAL_SETUP.md) - Arquitectura y setup
  - Diagrama de arquitectura
  - Setup paso-a-paso
  - Database schema (10 tablas)
  - Deployment (Vercel + Supabase)
  - CI/CD (GitHub Actions)

- [API_SPECIFICATION.md](./technical/API_SPECIFICATION.md) - Especificación de APIs
  - 30+ endpoints documentados
  - Request/Response ejemplos
  - Error handling
  - Paginación, rate limiting

### 👨‍💻 [development/](./development/)
**Para entender CÓMO codificamos**

- [DEVELOPERS.md](./development/DEVELOPERS.md) - Code style y guidelines
  - Build/Run commands
  - Code style guidelines
  - TypeScript strict mode
  - Error handling patterns
  - Project structure

- [AGENTS.md](./development/AGENTS.md) - Sistema multi-agente
  - 9 agentes especializados
  - Modelos recomendados
  - MCP servers

### 📋 [setup/](./setup/)
**Para CONFIGURAR tu ambiente**

- [SETUP_CHECKLIST.md](./setup/SETUP_CHECKLIST.md) - Setup paso-a-paso
  - 8 fases (12-14 horas)
  - Checklist para cada fase
  - Troubleshooting

---

## 🔍 Búsqueda Rápida

**Pregunta** | **Ver archivo**
---|---
¿Qué vamos a construir? | [product/PRD.md](./product/PRD.md)
¿Cuáles son las features? | [product/README.md](./product/README.md)
¿Cuál es la arquitectura? | [technical/TECHNICAL_SETUP.md](./technical/TECHNICAL_SETUP.md)
¿Qué APIs existen? | [technical/API_SPECIFICATION.md](./technical/API_SPECIFICATION.md)
¿Cómo configuro el ambiente? | [setup/SETUP_CHECKLIST.md](./setup/SETUP_CHECKLIST.md)
¿Cómo codifico? | [development/DEVELOPERS.md](./development/DEVELOPERS.md)
¿Cómo es el flujo de auth? | [technical/TECHNICAL_SETUP.md#7](./technical/TECHNICAL_SETUP.md) sección 7
¿Cuál es el timeline? | [product/PRD.md](./product/PRD.md) sección 10
¿Qué endpoints implemento primero? | [technical/API_SPECIFICATION.md#1](./technical/API_SPECIFICATION.md) sección 1 (Auth)

---

## 📊 Estadísticas de Documentación

| Carpeta | Documentos | Líneas | Propósito |
|---------|-----------|--------|-----------|
| product/ | 1 | 595 | Requisitos |
| technical/ | 2 | 1,960 | Arquitectura & APIs |
| development/ | 2 | 672 | Code style & Agentes |
| setup/ | 1 | 610 | Setup paso-a-paso |
| **TOTAL** | **6** | **3,837** | **Completa** |

---

## ✅ Checklist Antes de Empezar

- [ ] Leí [product/PRD.md](./product/PRD.md) (entiendo qué construimos)
- [ ] Leí [technical/README.md](./technical/README.md) (overview técnico)
- [ ] Tengo Python 3.11+ y Node.js instalados
- [ ] Tengo cuentas: GitHub, Supabase, Vercel
- [ ] Voy a seguir [setup/SETUP_CHECKLIST.md](./setup/SETUP_CHECKLIST.md)

---

## 🎯 Tech Stack

```
Frontend:      React 18 + TypeScript + Vite + Tailwind CSS
Backend:       FastAPI + Python 3.11
Database:      PostgreSQL (Supabase)
Auth:          JWT + Email verification
Email:         SendGrid o Resend
Hosting:       Vercel
CI/CD:         GitHub Actions
```

---

## 🚀 Próximos Pasos

1. **Elige tu ruta** arriba según tu rol
2. **Lee la documentación** indicada
3. **Sigue SETUP_CHECKLIST.md** para configure
4. **Consulta DEVELOPERS.md** durante desarrollo
5. **Usa API_SPECIFICATION.md** para implementación

---

## 🔗 Links Útiles

- [Repository](../README.md) - Raíz del proyecto
- [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) - Índice completo con búsqueda
- [FastAPI Docs](https://fastapi.tiangolo.com)
- [React Docs](https://react.dev)
- [Supabase Docs](https://supabase.com/docs)

---

## 📞 Soporte

Si algo no funciona:

1. Revisa [setup/SETUP_CHECKLIST.md](./setup/SETUP_CHECKLIST.md) troubleshooting
2. Revisa [technical/TECHNICAL_SETUP.md](./technical/TECHNICAL_SETUP.md) sección relevante
3. Revisa [development/DEVELOPERS.md](./development/DEVELOPERS.md) para issues de código
4. Consulta [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) para búsqueda rápida

---

**¡Listo para comenzar?** 

- 📚 Quiero aprender → Lee [product/README.md](./product/README.md)
- 🛠️ Quiero setear → Lee [setup/README.md](./setup/README.md)
- 💻 Quiero codificar → Lee [development/README.md](./development/README.md)

🚀 **¡Vamos!**

