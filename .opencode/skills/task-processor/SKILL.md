---
name: task-processor
description: Procesa tareas del archivo TASKS.md y las delega a agentes especializados
license: MIT
---

# Task Processor Skill

Este skill permite al Orchestrator procesar tareas definidas en `/docs/TASKS.md`.

## Ubicación del archivo de tareas

`/docs/TASKS.md`

## Mapeo de Agentes

| TASKS.md     | OpenCode Agent   | Modelo             |
| ------------ | ---------------- | ------------------ |
| Backend      | `python-backend` | gpt-5.1-codex-mini |
| Frontend     | `frontend`       | claude-haiku-4-5   |
| Database     | `database`       | glm-5-free         |
| Testing      | `testing`        | glm-5-free         |
| CI/CD        | `cicd`           | glm-5-free         |
| Architecture | `architecture`   | glm-5-free         |
| Planning     | `planning`       | glm-5-free         |
| UI/UX        | `ui-ux`          | glm-5-free         |

## Formato de Tarea

```markdown
| ID   | Tarea                     | Agente  | Dependencias | Prioridad | Track   |
| ---- | ------------------------- | ------- | ------------ | --------- | ------- |
| T001 | Crear estructura backend/ | Backend | -            | Alta      | backend |
```

## Cómo procesar tareas

### 1. Leer el archivo de tareas

```
Lee el archivo /docs/TASKS.md para obtener la lista de tareas pendientes.
```

### 2. Identificar tareas listas para ejecutar

Una tarea está lista cuando:

- No tiene dependencias (`-`) O
- Todas sus dependencias están completadas

### 3. Delegar al agente correcto

Usa el Task tool con el agente correspondiente:

```
Task tool → subagent_type: "python-backend"
Prompt: "Ejecuta la tarea T001: Crear estructura backend/"
```

### 4. Marcar tarea como completada

Actualiza el estado de la tarea (puedes usar todowrite o actualizar el archivo)

## Ejemplo de flujo

### Ejecutar una tarea específica

```
Usuario: "Ejecuta T001"

Orchestrator:
1. Lee TASKS.md
2. Busca T001: "Crear estructura backend/" | Agente: Backend
3. Verifica dependencias: ninguna
4. Delega a @python-backend: "Ejecuta T001: Crear estructura backend/"
5. Espera resultado
6. Marca T001 como completada
```

### Ejecutar fase completa

```
Usuario: "Ejecuta Fase 1"

Orchestrator:
1. Lee TASKS.md
2. Identifica tareas de Fase 1: T001-T017
3. Ordena por dependencias (topological sort)
4. Ejecuta en orden respetando dependencias:
   - T001 → T002 → (T003, T005 paralelo) → T004 → T006
5. Reporta progreso
```

### Ejecutar por track (paralelización)

```
Usuario: "Ejecuta todas las tareas de backend disponibles"

Orchestrator:
1. Lee TASKS.md
2. Filtra por track: backend
3. Identifica tareas sin dependencias pendientes
4. Lanza en paralelo las que no tienen dependencias entre sí
```

## Comandos reconocidos

| Comando                  | Acción                               |
| ------------------------ | ------------------------------------ |
| `Ejecuta T0XX`           | Ejecuta una tarea específica         |
| `Ejecuta Fase X`         | Ejecuta todas las tareas de una fase |
| `Ejecuta track:backend`  | Ejecuta tareas del track backend     |
| `Ejecuta track:frontend` | Ejecuta tareas del track frontend    |
| `Estado de T0XX`         | Muestra el estado de una tarea       |
| `Progreso general`       | Muestra progreso de todas las fases  |
| `Siguientes tareas`      | Muestra tareas listas para ejecutar  |

## Verificación de dependencias

Antes de ejecutar una tarea, verifica:

1. Que todas las dependencias estén completadas
2. Si una dependencia no está completada, ejecútala primero
3. Reporta cualquier bloqueo al usuario

## Prioridades

- **Alta**: Ejecutar primero
- **Media**: Ejecutar después de las altas
- **Baja**: Ejecutar al final

## Tareas especiales ★

Las tareas marcadas con ★ son de alta prioridad:

- Auth (T018-T028)
- Finance (T043-T044, T061-T063, T047, T069)

Estas deben tener prioridad sobre otras tareas de la misma fase.
