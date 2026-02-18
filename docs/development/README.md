# 👨‍💻 Documentación de Desarrollo

## Contenido

### BRANCHING_STRATEGY.md (300+ líneas)
**Estrategia de Git y workflow** - Cómo manejar branches, PRs y releases con GitHub Flow.

**Incluye**:
- ✅ GitHub Flow explicado (main + feature branches)
- ✅ Convenciones de nombrado de branches (feat/, fix/, docs/, etc)
- ✅ Proceso de PR y code review
- ✅ Reglas de protección en main
- ✅ Workflows de features, hotfixes, documentación
- ✅ Gestión local de branches
- ✅ Estrategia de releases y tags
- ✅ Solución de problemas comunes
- ✅ Timeline para MVP de 8 semanas

### DEVELOPERS.md (183 líneas)
**Guía de desarrollo y code style** - Cómo codificar de forma consistente en Armentum.

**Incluye**:
- ✅ Build/Run/Test commands
- ✅ Code style guidelines (imports, naming, formatting)
- ✅ TypeScript strict mode
- ✅ Naming conventions
- ✅ Error handling patterns
- ✅ Component patterns
- ✅ Project structure
- ✅ Git & CI/CD guidelines
- ✅ Agent instructions (DO NOT modify AGENTS.md)
- ✅ Common mistakes to avoid

### AGENTS.md (489 líneas)
**Sistema Multi-Agente** - Cómo se organiza el trabajo con agentes IA.

**Incluye**:
- ✅ 9 agentes especializados (Orchestration, Planning, Architecture, etc)
- ✅ Modelos recomendados (Claude, GPT-4o-mini, free models)
- ✅ Tech stack detallado
- ✅ Flujos de comunicación entre agentes
- ✅ MCP servers requeridos
- ✅ Costo optimization ($50-100/mes)

---

## 🎯 Cuándo leer

| Documento | Para | Tiempo | Sección |
|-----------|------|--------|---------|
| DEVELOPERS | Todos los devs | 30 min | TODO (lectura diaria) |
| DEVELOPERS | Nuevos devs | 1 hora | TODO (onboarding) |
| AGENTS | Coordinadores | 1 hora | TODO |
| AGENTS | Product Managers | 30 min | 1-5 |

---

## 📋 Code Style Rápido

### Imports
```typescript
// ✅ CORRECTO: Named imports primero, default después
import { useState, useEffect } from "react";
import logo from "../../assets/logo.png";

// ❌ INCORRECTO
import logo from "../../assets/logo.png";
import { useState } from "react";
```

### Naming
```typescript
// ✅ CORRECTO
export function UserProfile() {}           // Component: PascalCase
const handleSubmit = () => {}              // Function: camelCase
const MAX_RETRIES = 3;                     // Constant: UPPER_SNAKE_CASE
const userEmail = "user@example.com";      // Variable: camelCase

// ❌ INCORRECTO
export function user_profile() {}          // should be PascalCase
const HandleSubmit = () => {}              // should be camelCase
```

### TypeScript
```typescript
// ✅ CORRECTO
interface UserProps {
  name: string;
  age: number;
}

export function User({ name, age }: UserProps): JSX.Element {
  return <div>{name}</div>;
}

// ❌ INCORRECTO
export function User(props: any) {         // NEVER use any
  return <div>{props.name}</div>;
}
```

### Error Handling
```typescript
// ✅ CORRECTO
const [error, setError] = useState("");
try {
  const response = await api.post("/endpoint", data);
  setData(response.data);
} catch (err) {
  setError(err.message);
}

// ❌ INCORRECTO
try {
  const response = await api.post("/endpoint", data);
  // Sin manejo de error
}
```

---

## 📊 Estructura del Proyecto

```
src/
├── components/        # Reusable components
│   ├── ui/           # Primitives (Button, Card, etc)
│   └── Layout.tsx    # Header, Navbar, Footer
├── pages/            # Page components (routes)
│   ├── public/       # Public zone pages
│   ├── corista/      # Corista zone pages
│   ├── admin/        # Admin zone pages
│   └── auth/         # Auth pages (Login, Register)
├── hooks/            # Custom React hooks
├── services/         # API calls, utilities
├── store/            # Zustand state management
├── types/            # TypeScript types
├── utils/            # Helper functions
├── styles/           # Global styles
└── main.tsx          # Entry point
```

---

## 🚀 Commands

```bash
# Development
npm run dev              # Start dev server (localhost:5173)
npm run build            # Production build
npm run preview          # Preview production build

# Testing
npm run test             # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report

# Linting
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run format:check     # Check formatting
```

---

## 🚨 Common Mistakes

- ❌ Mixing named and default imports incorrectly
- ❌ Using `any` type in TypeScript
- ❌ Inline component logic (extract to functions)
- ❌ Hard-coded values (use constants or .env)
- ❌ Silent failures (always set error state)
- ❌ Modifying AGENTS.md without permission
- ❌ Committing .env files
- ❌ Not handling async/await errors

---

## 🔗 Enlaces relacionados

- [README.md](../README.md) - Guía general
- [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md) - Git workflow y branches
- [TECHNICAL_SETUP.md](../technical/TECHNICAL_SETUP.md) - Architecture
- [API_SPECIFICATION.md](../technical/API_SPECIFICATION.md) - Endpoints
- [SETUP_CHECKLIST.md](../setup/SETUP_CHECKLIST.md) - Setup

---

## 📚 Recursos Externos

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [FastAPI](https://fastapi.tiangolo.com)
- [PostgreSQL](https://www.postgresql.org/docs)

