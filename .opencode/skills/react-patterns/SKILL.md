---
name: react-patterns
description: Patrones y convenciones de React/TypeScript para el proyecto Armentum
license: MIT
---

# React Patterns

## Patrones de Componentes

### Compound Components

```tsx
// Ejemplo: Card con subcomponentes
<Card>
  <Card.Header>
    <Card.Title>Título</Card.Title>
  </Card.Header>
  <Card.Body>Contenido</Card.Body>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

### Custom Hooks

```tsx
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

// Uso
function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading, error } = useUser(userId)
  
  if (isLoading) return <Spinner />
  if (error) return <ErrorMessage error={error} />
  
  return <div>{user.name}</div>
}
```

### Zustand Store

```tsx
// stores/userStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name: string
}

interface UserState {
  user: User | null
  token: string | null
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  logout: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'user-storage',
    }
  )
)
```

### Render Props

```tsx
// components/DataFetcher.tsx
interface DataFetcherProps<T> {
  url: string
  children: (data: T, isLoading: boolean, error: Error | null) => React.ReactNode
}

export function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const { data, isLoading, error } = useQuery({ queryKey: [url], queryFn: () => fetch(url).then(r => r.json()) })
  
  return <>{children(data as T, isLoading, error)}</>
}

// Uso
<DataFetcher<User> url="/api/user/1">
  {(user, isLoading, error) => {
    if (isLoading) return <Spinner />
    if (error) return <Error />
    return <div>{user.name}</div>
  }}
</DataFetcher>
```

## Convenciones

### Naming
- Componentes: PascalCase (`Button.tsx`, `UserProfile.tsx`)
- Hooks: camelCase con prefijo use (`useUser.ts`, `useAuth.ts`)
- Utils: camelCase (`formatDate.ts`, `apiClient.ts`)
- Types: PascalCase (`User.ts`, `ApiResponse.ts`)

### File Structure
```
ComponentName/
├── ComponentName.tsx      # Componente principal
├── ComponentName.test.tsx # Tests
├── ComponentName.module.css # Si usa CSS modules
├── index.ts               # Barrel export
└── types.ts               # Types específicos
```

### Props Interface
```tsx
// Siempre definir interface con sufijo Props
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}
```

## Performance

### Memoización
```tsx
import { memo, useMemo, useCallback } from 'react'

// memo para componentes puros
export const ExpensiveComponent = memo(({ data }: Props) => {
  return <div>{/* render */}</div>
})

// useMemo para cálculos costosos
function UserList({ users }: { users: User[] }) {
  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => a.name.localeCompare(b.name))
  }, [users])
  
  return <List items={sortedUsers} />
}

// useCallback para funciones en props
function Parent() {
  const handleClick = useCallback((id: string) => {
    console.log(id)
  }, [])
  
  return <Child onClick={handleClick} />
}
```

### Code Splitting
```tsx
import { lazy, Suspense } from 'react'

const AdminPanel = lazy(() => import('./AdminPanel'))

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <AdminPanel />
    </Suspense>
  )
}
```
