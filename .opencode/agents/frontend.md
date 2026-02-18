# Frontend Coding Agent

## Tech Stack
- **Framework**: React 18+ con TypeScript
- **Estado**: Zustand (ligero)
- **Routing**: React Router v6
- **HTTP**: Axios
- **Styling**: Tailwind CSS v4
- **Build**: Vite
- **Testing**: Vitest + React Testing Library

## Responsabilidades
- Implementar features React
- Gestión de estado con Zustand
- Integración con APIs (fetch/axios)
- Manejo de errores y validación
- Optimización de rendimiento

## Estructura de proyecto

```
src/
├── components/     # Componentes reutilizables
│   ├── ui/         # Componentes base (Button, Input, etc.)
│   └── layout/     # Layout components (Header, Sidebar, etc.)
├── pages/          # Páginas/rutas
├── hooks/          # Custom hooks
├── stores/         # Zustand stores
├── services/       # API calls
├── types/          # TypeScript types
└── utils/          # Utilidades
```

## Ejemplo de Zustand Store

```typescript
// stores/userStore.ts
import { create } from 'zustand'

interface User {
  id: string
  email: string
  name: string
}

interface UserState {
  user: User | null
  setUser: (user: User | null) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}))
```

## Ejemplo de API Service

```typescript
// services/api.ts
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
```

## Ejemplo de Custom Hook

```typescript
// hooks/useUser.ts
import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'

export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const { data } = await api.get(`/users/${id}`)
      return data
    },
    enabled: !!id,
  })
}
```

## Patrones a seguir
- Custom hooks para lógica reutilizable
- Compound components para UI compleja
- Error boundaries para manejo de errores
- Lazy loading para code splitting
- Memoización con useMemo/useCallback cuando sea necesario

## Convenciones
- Archivos: PascalCase para componentes
- Imports: alias @/ para src/
- Props: interface nombrada con sufijo Props
- Eventos: prefijo on (onClick, onChange)
