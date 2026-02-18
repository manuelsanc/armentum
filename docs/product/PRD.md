# Documento de Requisitos del Producto (PRD)
## Plataforma Armentum - Estudio Coral

**Versión**: 1.0  
**Fecha**: Febrero 2026  
**Proyecto**: Armentum - Plataforma Integral de Gestión Coral  
**Estado**: En Desarrollo

---

## 1. RESUMEN EJECUTIVO

### Visión
Armentum es una plataforma integral que centraliza la gestión administrativa, financiera y comunicacional del Estudio Coral Armentum, proporcionando una experiencia diferenciada para tres grupos de usuarios: visitantes públicos, miembros (coristas) y administradores.

### Objetivos Principales
1. **Centralizar información**: Reducir dispersión de información en múltiples canales
2. **Facilitar comunicación**: Automatizar avisos, calendarios y control de asistencia
3. **Gestión financiera**: Transparencia en cuotas, pagos y estado financiero individual
4. **Presencia digital**: Showcase público de eventos, historia y noticias de la coral
5. **Eficiencia administrativa**: Automatizar tareas repetitivas para administradores

### Métricas de Éxito
- **MVP Launch**: Dentro de 8 semanas
- **Adopción**: 90%+ de coristas usando la plataforma en primera temporada
- **Satisfacción**: Net Promoter Score (NPS) ≥ 50 dentro de 6 meses
- **Engagement**: 80%+ mensual de coristas accediendo plataforma

---

## 2. DEFINICIÓN DE USUARIOS Y CASOS DE USO

### Personas de Usuario

#### 👤 Visitante Público (Público General)
- **Demografía**: Personas interesadas en conciertos, historia coral
- **Dispositivos**: Mostly móvil, algunos desktop
- **Frecuencia**: Ocasional (1-2 veces/mes)
- **Necesidades**: 
  - Conocer eventos próximos
  - Acceder historia e información de la coral
  - Revisar noticias recientes
  - Ver contenido en redes sociales

#### 👤 Corista/Miembro
- **Demografía**: 35 miembros activos, edades 18-70 años
- **Dispositivos**: Mezcla móvil/desktop
- **Frecuencia**: Alta (3-5 veces/semana)
- **Necesidades**:
  - Conocer fechas de ensayos (generales y seccionales)
  - Recibir avisos importantes
  - Descargar partituras y grabaciones
  - Ver asistencias registradas
  - Acceder estado financiero personal
  - Informarse sobre próximos conciertos

#### 👤 Administrador (Roles Variables)
- **Demografía**: 2-3 personas (directivos/staff)
- **Dispositivos**: Mostly desktop
- **Frecuencia**: Diaria
- **Necesidades**:
  - Gestionar miembros (altas, bajas, datos)
  - Planificar calendarios (ensayos, actividades)
  - Registrar asistencias
  - Gestionar eventos públicos
  - Administrar comunicados
  - Controlar cuotas e ingresos
  - Generar reportes

#### 👤 Admin General (Super Admin)
- **Demografía**: Director/Presidente coral
- **Dispositivos**: Desktop
- **Frecuencia**: Según necesidad
- **Necesidades**: Todo lo anterior + crear administradores y asignar permisos

---

## 3. DESCRIPCIÓN GENERAL DE CARACTERÍSTICAS POR ZONA

### 🌐 ZONA PÚBLICA (Sin autenticación)

#### 3.1.1 Página de Inicio
- Hero section con presentación de la coral
- Botones CTA a secciones principales
- Testimonios/galería de fotos
- Acceso a próximos eventos destacados
- Enlaces a redes sociales

#### 3.1.2 Historia de la Coral
- Timeline o narrativa histórica
- Logros destacados
- Fotografías históricas
- Información de fundación

#### 3.1.3 Misión y Valores
- Misión, visión y valores de la coral
- Información sobre el director/maestro
- Estructura organizativa

#### 3.1.4 Noticias
- Feed de noticias publicadas
- **Integración Instagram**: Carrusel de últimas publicaciones desde @armentumcoral
- Información de eventos próximos
- Comunicados de la coral
- Búsqueda y filtros por fecha

#### 3.1.5 Calendario de Eventos Público
- Calendario interactivo con eventos públicos
- Detalles: fecha, hora, lugar, descripción
- Botón para registrar asistencia (sin login)
- Información sobre cómo asistir

---

### 🔐 ZONA CORISTA (Autenticación requerida)

#### 3.2.1 Calendario de Ensayos
- **Ensayos Generales**: Fecha, hora, lugar
- **Seccionales**: Fecha, cuerdas (Soprano/Alto/Tenor/Bajo), hora, lugar
- **Otras Actividades**: Nombre, fecha, hora, lugar
- Filtros por tipo de actividad
- Notificaciones de cambios
- Integración con calendario personal (iCal/Google Calendar)

#### 3.2.2 Avisos y Comunicaciones
- Feed de comunicados del director/administradores
- Marca como leído/no leído
- Búsqueda de comunicados antiguos
- Notificación por email de avisos nuevos

#### 3.2.3 Control de Asistencia
- Vista de asistencias registradas
- Desglose por tipo: Ensayos Generales, Seccionales, Actividades, Conciertos
- Porcentaje de asistencia
- Justificaciones de inasistencias
- Historial por período

#### 3.2.4 Conciertos
- Listado de conciertos próximos
- Detalles: fecha, hora, lugar, repertorio
- Estado de confirmación personal
- Opción de confirmar asistencia

#### 3.2.5 Centro de Descargas
- **Partituras**: Organizadas por voz (Soprano/Alto/Tenor/Bajo)
  - Filtros por concierto/período
  - Formato: PDF descargable
- **Grabaciones**: De ensayos o conciertos pasados
  - Acceso a audio de referencia
  - Desglosado por voz

#### 3.2.6 Dashboard Financiero
- **Información visible solo de usuario actual**
- Saldo actual acumulado
- Tabla de cuotas:
  - Cuotas regulares (mensuales)
  - Estado: Pagada/Pendiente
  - Fecha de vencimiento
- Cuotas extraordinarias (cuando aplique)
- Historial de pagos
- Descarga de comprobantes

---

### ⚙️ ZONA ADMINISTRADOR (Autenticación requerida + Permisos)

#### 3.3.1 Gestión de Miembros
- Listado de coristas activos e inactivos
- Alta de nuevos miembros (nombre, email, teléfono, voz, fecha ingreso)
- Edición de datos personales
- Cambio de estado (activo/inactivo/suspendido)
- Asignación de voz (Soprano/Alto/Tenor/Bajo)
- Eliminación lógica de registros
- Búsqueda y filtros

#### 3.3.2 Gestión de Eventos Públicos
- CRUD de eventos públicos
- Campos: Nombre, descripción, fecha, hora, lugar, tipo (concierto/actividad/otro)
- Descripción larga (Markdown o rich text)
- Galería de imágenes
- Estado: Planificado/Confirmado/Cancelado
- Publicación automática en redes sociales (integración)

#### 3.3.3 Gestión de Calendario para Coristas
- CRUD de ensayos generales
  - Fecha, hora, lugar, descripción
- CRUD de seccionales
  - Fecha, hora, cuerdas (multiselect), lugar
- CRUD de otras actividades
  - Nombre, fecha, hora, lugar, descripción
- Notificación automática a miembros afectados
- Gestión de cambios/cancelaciones

#### 3.3.4 Control de Asistencia
- Registrar asistencia por evento
  - Seleccionar evento (ensayo/seccional/actividad/concierto)
  - Check/uncheck de miembros presentes
  - Opción para justificar ausencias
  - Bulk actions (marcar todos presentes/ausentes)
- Vista histórica de asistencias
- Reportes de asistencia:
  - Por miembro (últimas X semanas)
  - Por evento
  - Resumen mensual

#### 3.3.5 Gestión Financiera
- **Control de Cobros**:
  - Registro de cuotas (regulares y extraordinarias)
  - Asignación de cuota a miembros específicos o todos
  - Monto, fecha de vencimiento, descripción
  - Estado: Pendiente/Pagado/Atrasado
  - Registro de pagos recibidos
  - Cálculo automático de saldos
- **Reportes Financieros**:
  - Estado general de cobranzas
  - Deudores (por período/monto)
  - Resumen de ingresos (mensual/trimestral)
  - Exportar a Excel/CSV

#### 3.3.6 Gestión de Comunicados
- Crear comunicados dirigidos a:
  - Todos los coristas
  - Grupo específico (por voz/grupo/estado)
  - Individual
- Editor de texto con formato básico
- Programar envío para fecha/hora específica
- Envío automático por email
- Historial de comunicados enviados

#### 3.3.7 Gestión de Descargas
- Subir y gestionar partituras
  - Asignar voz(voces)
  - Asignar a evento/concierto
  - Opciones de privacidad (solo coristas/pública)
- Subir grabaciones
  - Detalles del evento
  - Acceso: solo coristas/pública
- Eliminar archivos antiguos

---

## 4. HISTORIAS DE USUARIO Y CRITERIOS DE ACEPTACIÓN

### ZONA PÚBLICA

#### HU-P-001: Visitante consulta próximos eventos
```
Como: Visitante público
Quiero: Ver calendario de eventos públicos próximos
Para: Decidir cuál evento asistir

Criterios de Aceptación:
- [ ] Calendario muestra eventos próximos de forma clara
- [ ] Cada evento muestra: fecha, hora, lugar, descripción corta
- [ ] Puedo filtrar por tipo de evento
- [ ] Puedo crear recordatorio (agregar a mi calendario)
- [ ] Responsive en móvil y desktop
```

#### HU-P-002: Visitante se enteras de noticias desde redes sociales
```
Como: Visitante público
Quiero: Ver últimas publicaciones de Instagram de la coral
Para: Mantenerme actualizado sin seguir redes sociales

Criterios de Aceptación:
- [ ] Se muestran últimas 6-8 publicaciones de Instagram
- [ ] Se actualiza automáticamente cada 12 horas
- [ ] Puedo hacer click para ver en Instagram
- [ ] Responsive en móvil
```

---

### ZONA CORISTA

#### HU-C-001: Corista revisa calendario de ensayos
```
Como: Corista
Quiero: Ver todos los ensayos (generales y seccionales) próximos
Para: Planificar mi asistencia

Criterios de Aceptación:
- [ ] Veo ensayos generales con fecha, hora, lugar
- [ ] Veo seccionales que me aplican (mi voz)
- [ ] Puedo filtrar por tipo
- [ ] Puedo exportar a Google Calendar/iCal
- [ ] Recibo email 24h antes de cada ensayo
```

#### HU-C-002: Corista descarga su partitura
```
Como: Corista (Soprano)
Quiero: Descargar la partitura de mi voz para concierto X
Para: Practicar en casa

Criterios de Aceptación:
- [ ] Veo descargas organizadas por concierto
- [ ] Solo veo partituras de mi voz
- [ ] Descarga funciona en móvil y desktop
- [ ] Formato PDF legible
```

#### HU-C-003: Corista consulta su estado financiero
```
Como: Corista
Quiero: Ver mi saldo, cuotas pagadas y pendientes
Para: Saber si tengo deuda pendiente

Criterios de Aceptación:
- [ ] Veo saldo actual prominentemente
- [ ] Tabla muestra cuotas con estado (Pagada/Pendiente)
- [ ] Veo fecha de vencimiento de pendientes
- [ ] Puedo descargar comprobante de pago
- [ ] Solo veo mis datos, no de otros coristas
```

---

### ZONA ADMINISTRADOR

#### HU-A-001: Admin crea evento público
```
Como: Administrador
Quiero: Crear nuevo evento público (concierto)
Para: Que aparezca en calendario público

Criterios de Aceptación:
- [ ] Formulario con campos: nombre, fecha, hora, lugar, descripción
- [ ] Puedo subir imagen de evento
- [ ] Puedo seleccionar estado (Planificado/Confirmado/Cancelado)
- [ ] Al guardar, se envía notificación automática a coristas
- [ ] Aparece en calendario público inmediatamente
```

#### HU-A-002: Admin registra asistencia a ensayo
```
Como: Administrador
Quiero: Registrar quién asistió a ensayo general
Para: Mantener histórico de asistencias

Criterios de Aceptación:
- [ ] Selecciono fecha/tipo de ensayo
- [ ] Veo listado de coristas
- [ ] Puedo marcar presentes/ausentes con checkbox
- [ ] Puedo marcar todos presentes de una vez
- [ ] Opción para agregar justificación de ausencia
- [ ] Se guarda automáticamente
```

#### HU-A-003: Admin gestiona cuota extraordinaria
```
Como: Admin Financiero
Quiero: Crear cuota extraordinaria para concierto
Para: Cobrar gastos adicionales (alquiler sala, etc)

Criterios de Aceptación:
- [ ] Puedo crear cuota con monto y descripción
- [ ] Selecciono miembros o "todos"
- [ ] Fecha de vencimiento configurable
- [ ] Se notifica automáticamente a miembros afectados
- [ ] Aparece en dashboard financiero de cada corista
```

---

## 5. MATRIZ DE PERMISOS POR ROL

| Funcionalidad | Admin General | Admin Miembros | Admin Eventos | Admin Financiero | Admin Comun. |
|---|---|---|---|---|---|
| **Gestión de Miembros** |
| Ver miembros | ✓ | ✓ | ✗ | ✗ | ✗ |
| Crear miembros | ✓ | ✓ | ✗ | ✗ | ✗ |
| Editar datos miembros | ✓ | ✓ | ✗ | ✗ | ✗ |
| Eliminar miembros | ✓ | ✓ | ✗ | ✗ | ✗ |
| **Gestión Eventos Público** |
| Ver eventos | ✓ | ✗ | ✓ | ✗ | ✗ |
| Crear eventos | ✓ | ✗ | ✓ | ✗ | ✗ |
| Editar eventos | ✓ | ✗ | ✓ | ✗ | ✗ |
| Eliminar eventos | ✓ | ✗ | ✓ | ✗ | ✗ |
| **Calendario Coristas** |
| Ver calendario | ✓ | ✓ | ✓ | ✗ | ✗ |
| Crear ensayos | ✓ | ✓ | ✓ | ✗ | ✗ |
| Editar ensayos | ✓ | ✓ | ✓ | ✗ | ✗ |
| Eliminar ensayos | ✓ | ✓ | ✓ | ✗ | ✗ |
| **Control Asistencia** |
| Ver reportes asistencia | ✓ | ✓ | ✗ | ✗ | ✗ |
| Registrar asistencia | ✓ | ✓ | ✗ | ✗ | ✗ |
| Editar asistencia pasada | ✓ | ✓ | ✗ | ✗ | ✗ |
| **Gestión Financiera** |
| Ver estado financiero | ✓ | ✗ | ✗ | ✓ | ✗ |
| Crear cuotas | ✓ | ✗ | ✗ | ✓ | ✗ |
| Registrar pagos | ✓ | ✗ | ✗ | ✓ | ✗ |
| Generar reportes financieros | ✓ | ✗ | ✗ | ✓ | ✗ |
| **Comunicados** |
| Ver comunicados | ✓ | ✓ | ✓ | ✓ | ✓ |
| Crear comunicados | ✓ | ✗ | ✗ | ✗ | ✓ |
| **Gestión Sistema** |
| Crear administradores | ✓ | ✗ | ✗ | ✗ | ✗ |
| Asignar permisos | ✓ | ✗ | ✗ | ✗ | ✗ |
| Editar configuración | ✓ | ✗ | ✗ | ✗ | ✗ |

---

## 6. PRIORIZACIÓN DE CARACTERÍSTICAS

### 🚀 MVP - FASE 1 (Lanzamiento - Semanas 1-8)

**Objetivo**: Producto viable con características core

#### Zona Pública
- [x] Página Inicio (mejorar texto actual)
- [x] Historia
- [x] Misión
- [ ] Noticias (sin integración Instagram aún)
- [x] Calendario de eventos público (básico)

#### Zona Corista
- [ ] Autenticación (email/password con recuperación)
- [x] Calendario de ensayos (listar)
- [ ] Avisos/comunicaciones (recibir)
- [ ] Dashboard financiero (visualizar cuotas propias)
- [ ] Centro de descargas (partituras/grabaciones)

#### Zona Admin
- [ ] Gestión de miembros (CRUD básico)
- [ ] Crear eventos públicos
- [ ] Gestionar calendario ensayos (CRUD)
- [ ] Registro de asistencia (manual)
- [ ] Gestión de cuotas (crear, ver estado)
- [ ] Envío de comunicados
- [ ] Creación de roles y asignación (Admin General solo)

#### Backend/API
- [ ] Autenticación JWT
- [ ] Usuarios y roles
- [ ] Eventos públicos
- [ ] Calendario ensayos
- [ ] Miembros
- [ ] Cuotas/financiero (sin pagos reales)
- [ ] Comunicados
- [ ] Email service (Resend o SendGrid)

#### Infraestructura
- [ ] Supabase (PostgreSQL) setup
- [ ] Vercel deployment
- [ ] GitHub Actions CI/CD
- [ ] Email service configurado

---

### 📅 FASE 2 (Semanas 9-12) - Mejoras y Pulido

- [ ] Integración Instagram API (Noticias)
- [ ] Control de asistencia mejorado (bulk, justificaciones)
- [ ] Reportes de asistencia
- [ ] Exportar datos a Excel
- [ ] Notificaciones por email avanzadas
- [ ] Integración calendario (Google/iCal)
- [ ] Búsqueda global
- [ ] Sistema de notificaciones in-app

---

### 🔮 FASE 3 (Futuro) - Expansión

- [ ] Pagos online integrados (si se requiere)
- [ ] App móvil nativa
- [ ] Encuestas/feedback dentro de app
- [ ] Galería de fotos/videos
- [ ] Historial de conciertos con análisis
- [ ] Sistema de penalizaciones/sanciones
- [ ] Integración WhatsApp para avisos
- [ ] Análisis de datos avanzados

---

## 7. REQUISITOS TÉCNICOS E INTEGRACIONES

### Tech Stack Confirmado
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: FastAPI (Python) o Node.js (a decidir)
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel (Frontend + Backend)
- **Email**: Resend o SendGrid
- **Auth**: JWT + email verification

### Integraciones Requeridas

#### 7.1 Instagram API (Fase 2)
- **Endpoint**: GET últimos posts de @armentumcoral
- **Frecuencia**: Cache cada 12h
- **Datos**: Imagen, caption, fecha, link
- **Librería**: Instagram Graph API

#### 7.2 Email Service
- **Proveedor**: Resend o SendGrid (ambos free tier)
- **Casos**: Avisos, confirmación registro, reset password, comunicados
- **Template**: HTML con branding Armentum

### Seguridad
- Autenticación JWT con refresh tokens
- Contraseñas hasheadas (bcrypt)
- HTTPS only
- CORS configurado
- Rate limiting en APIs
- Row Level Security (RLS) en Supabase para datos sensibles

### Base de Datos - Tablas Principales
```
users (id, email, password_hash, nombre, rol, created_at)
miembros (id, user_id, voz, fecha_ingreso, estado)
eventos (id, nombre, fecha, hora, lugar, descripcion, estado)
ensayos (id, tipo, fecha, hora, lugar, cuerdas)
asistencias (id, miembro_id, ensayo_id, presente)
cuotas (id, monto, descripcion, fecha_vencimiento, estado)
comunicados (id, titulo, contenido, fecha_envio)
archivos (id, nombre, tipo, voz, url)
roles (id, nombre, permisos)
admin_permisos (id, admin_id, rol_id)
```

---

## 8. MÉTRICAS DE ÉXITO Y KPIs

### Métricas de Adopción
- Registros activos: 90%+ de coristas en semana 4 post-lanzamiento
- Frecuencia de uso: 80%+ mensual de activos
- Completitud de datos: 95%+ perfil completado

### Métricas de Engagement
- Mensual: Promedio 3+ visitas por usuario activo
- Asistencia registrada: 90%+ de ensayos dentro 24h

### Métricas de Financiero
- Puntualidad de pagos: 85%+ de cuotas pagadas a tiempo
- Transparencia: 100% de cuotas visibles a miembros

### Métricas Técnicas
- Uptime: 99.5%
- Response time: <500ms para 95% de solicitudes
- Error rate: <1%

---

## 9. DEPENDENCIAS Y RIESGOS

### Dependencias Externas
- Credenciales Instagram API (requiere registro de app)
- Configuración email service
- Datos reales de coral (texto, fotos, calendarios)

### Riesgos y Mitigación

| Riesgo | Impacto | Probabilidad | Mitigación |
|---|---|---|---|
| Retraso en datos reales | Alto | Media | Usar datos mock para MVP |
| Instagram API throttling | Medio | Baja | Implementar caché agresivo |
| Adopción coristas baja | Alto | Media | Training sessions + email reminders |
| Seguridad de datos sensibles | Alto | Baja | RLS en DB + pruebas seguridad |

---

## 10. TIMELINE ESTIMADO

| Semana | Hito |
|---|---|
| 1-2 | Setup backend, base de datos, auth |
| 2-3 | Zona pública (páginas existentes mejoradas) |
| 3-4 | Zona corista (calendario, comunicados) |
| 4-5 | Zona corista (financiero, descargas) |
| 5-6 | Zona admin (gestión miembros, eventos) |
| 6-7 | Zona admin (asistencia, cuotas) |
| 7-8 | Testing, fixes, documentación, deployment |
| 8 | 🎉 LANZAMIENTO MVP |

---

## 11. SIGUIENTE PASOS

1. **Revisión PRD**: Feedback sobre features/timeline
2. **Preparar datos**: Reunir textos reales, fotos, calendario inicial
3. **Creación de cuentas**: Supabase, Vercel, email service
4. **Setup Backend**: Iniciar desarrollo API FastAPI/Node
5. **Development Sprints**: Semanas 1-8 con demos semanales

---

## APÉNDICE: REFERENCIAS

- Figma Mockup: https://www.figma.com/design/bvjvsmbEKDfzb2jOW1Bmmi/Mockup-sitio-web-coral
- Codebase: React Vite en `/Users/manuel/Projects/armentum/`
- Personas: 35 coristas, ~1000 visitantes públicos mensuales

