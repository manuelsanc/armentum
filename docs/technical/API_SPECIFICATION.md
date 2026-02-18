# Especificación Detallada de APIs - Armentum

**Versión**: 1.0  
**Base URL**: `https://api.armentum.com/api` (o `http://localhost:8000/api` en desarrollo)  
**Formato**: JSON  
**Autenticación**: JWT Bearer Token

---

## TABLA DE CONTENIDOS

1. [Authentication](#1-authentication)
2. [Users Management](#2-users-management)
3. [Members/Coristas](#3-memberscoristas)
4. [Events (Público)](#4-events-público)
5. [Rehearsals/Ensayos](#5-rehearsalsensayos)
6. [Attendance](#6-attendance)
7. [Finances](#7-finances)
8. [Communications](#8-communications)
9. [Files](#9-files)
10. [Error Handling](#10-error-handling)

---

## 1. AUTHENTICATION

### 1.1 Register

```
POST /auth/register

Request Body:
{
  "email": "usuario@example.com",
  "password": "SecurePass123!",
  "nombre": "Juan García",
  "es_admin": false
}

Response 201:
{
  "id": "uuid",
  "email": "usuario@example.com",
  "nombre": "Juan García",
  "access_token": "eyJhbGciOiJIUzI1...",
  "refresh_token": "eyJhbGciOiJIUzI1...",
  "token_type": "bearer",
  "expires_in": 1800
}

Response 400:
{
  "detail": "Email already registered"
}
```

### 1.2 Login

```
POST /auth/login

Request Body:
{
  "email": "usuario@example.com",
  "password": "SecurePass123!"
}

Response 200:
{
  "access_token": "eyJhbGciOiJIUzI1...",
  "refresh_token": "eyJhbGciOiJIUzI1...",
  "token_type": "bearer",
  "expires_in": 1800,
  "user": {
    "id": "uuid",
    "email": "usuario@example.com",
    "nombre": "Juan García",
    "roles": ["corista"]
  }
}

Response 401:
{
  "detail": "Invalid credentials"
}
```

### 1.3 Refresh Token

```
POST /auth/refresh

Request Body:
{
  "refresh_token": "eyJhbGciOiJIUzI1..."
}

Response 200:
{
  "access_token": "eyJhbGciOiJIUzI1...",
  "token_type": "bearer",
  "expires_in": 1800
}

Response 401:
{
  "detail": "Invalid or expired refresh token"
}
```

### 1.4 Get Current User

```
GET /auth/me

Headers:
Authorization: Bearer eyJhbGciOiJIUzI1...

Response 200:
{
  "id": "uuid",
  "email": "usuario@example.com",
  "nombre": "Juan García",
  "roles": ["corista"],
  "created_at": "2024-02-01T10:30:00Z",
  "email_verified": true
}

Response 401:
{
  "detail": "Not authenticated"
}
```

### 1.5 Logout

```
POST /auth/logout

Headers:
Authorization: Bearer eyJhbGciOiJIUzI1...

Response 200:
{
  "message": "Successfully logged out"
}
```

---

## 2. USERS MANAGEMENT (Admin only)

### 2.1 List Users

```
GET /users?skip=0&limit=10&search=juan

Headers:
Authorization: Bearer {token}

Response 200:
{
  "total": 45,
  "items": [
    {
      "id": "uuid",
      "email": "juan@example.com",
      "nombre": "Juan García",
      "is_active": true,
      "roles": ["corista"],
      "created_at": "2024-01-15T08:00:00Z"
    }
  ]
}

Response 403:
{
  "detail": "Insufficient permissions"
}
```

### 2.2 Get User Details

```
GET /users/{user_id}

Headers:
Authorization: Bearer {token}

Response 200:
{
  "id": "uuid",
  "email": "juan@example.com",
  "nombre": "Juan García",
  "is_active": true,
  "email_verified": true,
  "roles": ["corista"],
  "created_at": "2024-01-15T08:00:00Z",
  "updated_at": "2024-02-10T14:30:00Z"
}
```

### 2.3 Update User

```
PATCH /users/{user_id}

Headers:
Authorization: Bearer {token}

Request Body:
{
  "nombre": "Juan Carlos García",
  "email": "juancarlos@example.com",
  "is_active": true
}

Response 200:
{
  "id": "uuid",
  "email": "juancarlos@example.com",
  "nombre": "Juan Carlos García",
  "is_active": true,
  "updated_at": "2024-02-17T10:30:00Z"
}
```

### 2.4 Delete User

```
DELETE /users/{user_id}

Headers:
Authorization: Bearer {token}

Response 204: (No content)

Response 403:
{
  "detail": "Cannot delete your own user"
}
```

### 2.5 Assign Role

```
POST /users/{user_id}/roles/{role_id}

Headers:
Authorization: Bearer {token}

Response 200:
{
  "user_id": "uuid",
  "role_id": "uuid",
  "assigned_at": "2024-02-17T10:30:00Z"
}
```

---

## 3. MEMBERS/CORISTAS

### 3.1 List Members

```
GET /members?skip=0&limit=10&voz=soprano&estado=activo

Headers:
Authorization: Bearer {token}

Response 200:
{
  "total": 35,
  "items": [
    {
      "id": "uuid",
      "user": {
        "id": "uuid",
        "email": "soprano1@example.com",
        "nombre": "María López"
      },
      "voz": "soprano",
      "fecha_ingreso": "2020-09-15",
      "estado": "activo",
      "telefono": "+34912345678",
      "saldo_actual": -50.00,
      "created_at": "2020-09-15T08:00:00Z"
    }
  ]
}
```

### 3.2 Create Member

```
POST /members

Headers:
Authorization: Bearer {token}

Request Body:
{
  "user_id": "uuid",
  "voz": "soprano",
  "fecha_ingreso": "2024-02-01",
  "telefono": "+34912345678"
}

Response 201:
{
  "id": "uuid",
  "user_id": "uuid",
  "voz": "soprano",
  "fecha_ingreso": "2024-02-01",
  "estado": "activo",
  "saldo_actual": 0.00,
  "created_at": "2024-02-17T10:30:00Z"
}
```

### 3.3 Get Member Profile

```
GET /members/me

Headers:
Authorization: Bearer {token}

Response 200:
{
  "id": "uuid",
  "user": {
    "id": "uuid",
    "email": "usuario@example.com",
    "nombre": "Juan García"
  },
  "voz": "tenor",
  "fecha_ingreso": "2022-03-10",
  "estado": "activo",
  "saldo_actual": 25.50,
  "created_at": "2022-03-10T08:00:00Z"
}
```

### 3.4 Update Member

```
PATCH /members/{member_id}

Headers:
Authorization: Bearer {token}

Request Body:
{
  "voz": "tenor",
  "estado": "activo",
  "telefono": "+34912345678"
}

Response 200:
{
  "id": "uuid",
  "voz": "tenor",
  "estado": "activo",
  "telefono": "+34912345678",
  "updated_at": "2024-02-17T10:30:00Z"
}
```

---

## 4. EVENTS (Público)

### 4.1 List Public Events

```
GET /events?skip=0&limit=10&tipo=concierto&estado=confirmado

Headers: (Opcional - sin auth, o con token)

Response 200:
{
  "total": 12,
  "items": [
    {
      "id": "uuid",
      "nombre": "Concierto Primavera 2024",
      "descripcion": "Concierto de primavera con repertorio clásico y moderno",
      "fecha": "2024-04-15",
      "hora": "19:00",
      "lugar": "Auditorio Municipal",
      "tipo": "concierto",
      "estado": "confirmado",
      "imagen_url": "https://...",
      "created_at": "2024-01-10T08:00:00Z"
    }
  ]
}
```

### 4.2 Get Event Details

```
GET /events/{event_id}

Response 200:
{
  "id": "uuid",
  "nombre": "Concierto Primavera 2024",
  "descripcion": "Descripción completa...",
  "fecha": "2024-04-15",
  "hora": "19:00",
  "lugar": "Auditorio Municipal",
  "tipo": "concierto",
  "estado": "confirmado",
  "imagen_url": "https://...",
  "created_by": {
    "id": "uuid",
    "nombre": "Admin"
  },
  "created_at": "2024-01-10T08:00:00Z"
}
```

### 4.3 Create Event (Admin)

```
POST /events

Headers:
Authorization: Bearer {token}

Request Body:
{
  "nombre": "Concierto Verano 2024",
  "descripcion": "Gran concierto de verano",
  "fecha": "2024-07-20",
  "hora": "20:00",
  "lugar": "Plaza Mayor",
  "tipo": "concierto",
  "estado": "planificado"
}

Response 201:
{
  "id": "uuid",
  "nombre": "Concierto Verano 2024",
  "descripcion": "Gran concierto de verano",
  "fecha": "2024-07-20",
  "hora": "20:00",
  "lugar": "Plaza Mayor",
  "tipo": "concierto",
  "estado": "planificado",
  "created_at": "2024-02-17T10:30:00Z"
}

Response 403:
{
  "detail": "Insufficient permissions"
}
```

### 4.4 Update Event (Admin)

```
PATCH /events/{event_id}

Headers:
Authorization: Bearer {token}

Request Body:
{
  "estado": "confirmado",
  "lugar": "Auditorio Grande"
}

Response 200:
{
  "id": "uuid",
  "estado": "confirmado",
  "lugar": "Auditorio Grande",
  "updated_at": "2024-02-17T10:30:00Z"
}
```

### 4.5 Delete Event (Admin)

```
DELETE /events/{event_id}

Headers:
Authorization: Bearer {token}

Response 204: (No content)
```

---

## 5. REHEARSALS/ENSAYOS

### 5.1 List Rehearsals

```
GET /rehearsals?skip=0&limit=10&tipo=general&fecha_desde=2024-02-17

Headers:
Authorization: Bearer {token}

Response 200:
{
  "total": 24,
  "items": [
    {
      "id": "uuid",
      "tipo": "general",
      "nombre": null,
      "fecha": "2024-02-17",
      "hora": "19:30",
      "lugar": "Salón Principal",
      "cuerdas": null,
      "descripcion": "Ensayo general",
      "created_by": { "id": "uuid", "nombre": "Director" },
      "created_at": "2024-02-01T08:00:00Z"
    },
    {
      "id": "uuid",
      "tipo": "seccional",
      "nombre": null,
      "fecha": "2024-02-19",
      "hora": "20:00",
      "lugar": "Sala Soprano",
      "cuerdas": "soprano,alto",
      "descripcion": "Seccional de sopranos y altos",
      "created_by": { "id": "uuid", "nombre": "Director" },
      "created_at": "2024-02-01T08:00:00Z"
    }
  ]
}
```

### 5.2 Create Rehearsal (Admin)

```
POST /rehearsals

Headers:
Authorization: Bearer {token}

Request Body:
{
  "tipo": "general",
  "fecha": "2024-03-01",
  "hora": "19:30",
  "lugar": "Salón Principal",
  "descripcion": "Ensayo general preparatorio"
}

Ó para seccional:
{
  "tipo": "seccional",
  "fecha": "2024-03-03",
  "hora": "20:00",
  "lugar": "Sala Soprano",
  "cuerdas": ["soprano", "alto"],
  "descripcion": "Seccional de SA"
}

Response 201:
{
  "id": "uuid",
  "tipo": "general",
  "fecha": "2024-03-01",
  "hora": "19:30",
  "lugar": "Salón Principal",
  "descripcion": "Ensayo general preparatorio",
  "created_at": "2024-02-17T10:30:00Z"
}
```

### 5.3 Update Rehearsal (Admin)

```
PATCH /rehearsals/{rehearsal_id}

Headers:
Authorization: Bearer {token}

Request Body:
{
  "hora": "20:00",
  "lugar": "Auditorio"
}

Response 200:
{
  "id": "uuid",
  "hora": "20:00",
  "lugar": "Auditorio",
  "updated_at": "2024-02-17T10:30:00Z"
}
```

### 5.4 Delete Rehearsal (Admin)

```
DELETE /rehearsals/{rehearsal_id}

Headers:
Authorization: Bearer {token}

Response 204: (No content)
```

---

## 6. ATTENDANCE

### 6.1 Record Attendance (Admin)

```
POST /attendance/record

Headers:
Authorization: Bearer {token}

Request Body:
{
  "rehearsal_id": "uuid",
  "attendances": [
    {
      "member_id": "uuid",
      "presente": true
    },
    {
      "member_id": "uuid",
      "presente": false,
      "justificacion": "Enfermo"
    }
  ]
}

Response 201:
{
  "rehearsal_id": "uuid",
  "recorded_at": "2024-02-17T20:30:00Z",
  "total_recorded": 35,
  "present": 32,
  "absent": 3
}
```

### 6.2 Get Attendance for Member

```
GET /attendance/me?periodo=2024-02

Headers:
Authorization: Bearer {token}

Response 200:
{
  "member_id": "uuid",
  "periodo": "2024-02",
  "total_ensayos": 8,
  "asistencias": [
    {
      "id": "uuid",
      "rehearsal": {
        "id": "uuid",
        "fecha": "2024-02-05",
        "tipo": "general"
      },
      "presente": true,
      "registrado_en": "2024-02-05T20:30:00Z"
    },
    {
      "id": "uuid",
      "rehearsal": {
        "id": "uuid",
        "fecha": "2024-02-07",
        "tipo": "seccional"
      },
      "presente": false,
      "justificacion": "Trabajo",
      "registrado_en": "2024-02-07T20:30:00Z"
    }
  ],
  "porcentaje": 87.5
}
```

### 6.3 Get Attendance Report (Admin)

```
GET /attendance/reports/rehearsal/{rehearsal_id}

Headers:
Authorization: Bearer {token}

Response 200:
{
  "rehearsal_id": "uuid",
  "rehearsal": {
    "fecha": "2024-02-17",
    "tipo": "general",
    "lugar": "Salón Principal"
  },
  "total_miembros": 35,
  "presentes": 32,
  "ausentes": 3,
  "porcentaje_asistencia": 91.4,
  "detalles": [
    {
      "member_id": "uuid",
      "nombre": "María López",
      "voz": "soprano",
      "presente": true
    },
    {
      "member_id": "uuid",
      "nombre": "Juan García",
      "voz": "tenor",
      "presente": false,
      "justificacion": "Enfermo"
    }
  ]
}
```

---

## 7. FINANCES

### 7.1 Get My Financial Status (Corista)

```
GET /finances/me

Headers:
Authorization: Bearer {token}

Response 200:
{
  "member_id": "uuid",
  "saldo_actual": -50.00,
  "cuotas_regulares": [
    {
      "id": "uuid",
      "mes": "2024-02",
      "monto": 25.00,
      "fecha_vencimiento": "2024-02-28",
      "estado": "pagado",
      "fecha_pago": "2024-02-25"
    },
    {
      "id": "uuid",
      "mes": "2024-03",
      "monto": 25.00,
      "fecha_vencimiento": "2024-03-31",
      "estado": "pendiente"
    }
  ],
  "cuotas_extraordinarias": [
    {
      "id": "uuid",
      "descripcion": "Concierto Primavera - Alquiler Auditorio",
      "monto": 50.00,
      "fecha_vencimiento": "2024-04-01",
      "estado": "pendiente"
    }
  ],
  "historial_pagos": [
    {
      "fecha": "2024-02-25",
      "monto": 25.00,
      "concepto": "Cuota Febrero 2024"
    }
  ]
}
```

### 7.2 Create Quota (Admin)

```
POST /finances/quotas

Headers:
Authorization: Bearer {token}

Request Body:
{
  "tipo": "regular",
  "descripcion": "Cuota Marzo 2024",
  "monto": 25.00,
  "fecha_vencimiento": "2024-03-31",
  "miembros": ["uuid", "uuid"] Ó "todos"
}

Response 201:
{
  "id": "uuid",
  "tipo": "regular",
  "descripcion": "Cuota Marzo 2024",
  "monto": 25.00,
  "fecha_vencimiento": "2024-03-31",
  "miembros_asignados": 35,
  "created_at": "2024-02-17T10:30:00Z"
}
```

### 7.3 Record Payment (Admin)

```
POST /finances/payments

Headers:
Authorization: Bearer {token}

Request Body:
{
  "member_id": "uuid",
  "quota_id": "uuid",
  "monto": 25.00,
  "fecha_pago": "2024-02-25",
  "referencia": "Transferencia 12345"
}

Response 201:
{
  "id": "uuid",
  "member_id": "uuid",
  "quota_id": "uuid",
  "monto": 25.00,
  "fecha_pago": "2024-02-25",
  "referencia": "Transferencia 12345",
  "recorded_at": "2024-02-17T10:30:00Z"
}
```

### 7.4 Get Financial Report (Admin)

```
GET /finances/reports?tipo=cobranzas&periodo=2024-02

Headers:
Authorization: Bearer {token}

Response 200:
{
  "periodo": "2024-02",
  "tipo": "cobranzas",
  "resumen": {
    "total_cuotas": 875.00,
    "pagado": 750.00,
    "pendiente": 125.00,
    "porcentaje_pago": 85.7
  },
  "deudores": [
    {
      "member_id": "uuid",
      "nombre": "Carlos Martínez",
      "voz": "bajo",
      "monto_debido": 50.00,
      "cuotas": ["Cuota Febrero"]
    }
  ]
}
```

---

## 8. COMMUNICATIONS

### 8.1 Get Communications (Corista)

```
GET /communications?skip=0&limit=20

Headers:
Authorization: Bearer {token}

Response 200:
{
  "total": 45,
  "items": [
    {
      "id": "uuid",
      "titulo": "Cambio de ensayo",
      "contenido": "El ensayo de esta semana se adelanta a las 19:00",
      "enviado_por": { "id": "uuid", "nombre": "Director" },
      "enviado_en": "2024-02-17T10:30:00Z",
      "leido": false
    },
    {
      "id": "uuid",
      "titulo": "Cuotas pendientes",
      "contenido": "Recordatorio: tienes cuotas pendientes...",
      "enviado_por": { "id": "uuid", "nombre": "Tesorera" },
      "enviado_en": "2024-02-15T14:00:00Z",
      "leido": true
    }
  ]
}
```

### 8.2 Get Communication Detail

```
GET /communications/{communication_id}

Headers:
Authorization: Bearer {token}

Response 200:
{
  "id": "uuid",
  "titulo": "Cambio de ensayo",
  "contenido": "El ensayo de esta semana se adelanta a las 19:00...",
  "enviado_por": { "id": "uuid", "nombre": "Director" },
  "enviado_en": "2024-02-17T10:30:00Z",
  "leido": true,
  "leido_en": "2024-02-17T10:35:00Z"
}
```

### 8.3 Mark Communication as Read

```
PATCH /communications/{communication_id}

Headers:
Authorization: Bearer {token}

Request Body:
{
  "leido": true
}

Response 200:
{
  "id": "uuid",
  "leido": true,
  "leido_en": "2024-02-17T10:35:00Z"
}
```

### 8.4 Create Communication (Admin)

```
POST /communications

Headers:
Authorization: Bearer {token}

Request Body:
{
  "titulo": "Aviso importante",
  "contenido": "El próximo concierto...",
  "dirigido_a": "todos",
  "programado_para": "2024-02-18T08:00:00Z"
}

Ó por grupo:
{
  "titulo": "Seccional soprano",
  "contenido": "Seccional de sopranos...",
  "dirigido_a": "grupo",
  "grupo_destino": "soprano",
  "programado_para": null (enviar ahora)
}

Ó individual:
{
  "titulo": "Confirmación asistencia",
  "contenido": "¿Confirmas tu asistencia al concierto?",
  "dirigido_a": "individual",
  "miembro_destino": "uuid"
}

Response 201:
{
  "id": "uuid",
  "titulo": "Aviso importante",
  "contenido": "El próximo concierto...",
  "dirigido_a": "todos",
  "estado": "programado",
  "programado_para": "2024-02-18T08:00:00Z",
  "created_at": "2024-02-17T10:30:00Z"
}
```

---

## 9. FILES (Partituras/Grabaciones)

### 9.1 List Files

```
GET /files?tipo=partitura&voz=soprano&privado=true

Headers:
Authorization: Bearer {token} (requerido si privado=true)

Response 200:
{
  "total": 12,
  "items": [
    {
      "id": "uuid",
      "nombre": "Kyrie - Soprano.pdf",
      "tipo": "partitura",
      "voz": "soprano",
      "evento": "Misa de Requiem",
      "privado": true,
      "url": "https://supabase.../files/...",
      "subido_por": { "id": "uuid", "nombre": "Director" },
      "subido_en": "2024-02-10T10:30:00Z"
    }
  ]
}
```

### 9.2 Upload File (Admin)

```
POST /files/upload

Headers:
Authorization: Bearer {token}
Content-Type: multipart/form-data

Request Body:
- file: (binary file)
- nombre: "Kyrie - Soprano.pdf"
- tipo: "partitura"
- voz: "soprano"
- evento_id: "uuid"
- privado: true

Response 201:
{
  "id": "uuid",
  "nombre": "Kyrie - Soprano.pdf",
  "tipo": "partitura",
  "voz": "soprano",
  "url": "https://supabase.../files/kyrie-soprano-uuid.pdf",
  "tamaño": 2048000,
  "subido_en": "2024-02-17T10:30:00Z"
}
```

### 9.3 Download File

```
GET /files/{file_id}/download

Headers:
Authorization: Bearer {token} (si archivo privado)

Response 200:
(File binary download)
Content-Disposition: attachment; filename="Kyrie-Soprano.pdf"
```

### 9.4 Delete File (Admin)

```
DELETE /files/{file_id}

Headers:
Authorization: Bearer {token}

Response 204: (No content)
```

---

## 10. ERROR HANDLING

### Formato de Error

Todos los errores responden con este formato:

```json
{
  "detail": "Descripción del error",
  "error_code": "ERROR_CODE",
  "timestamp": "2024-02-17T10:30:00Z"
}
```

### Códigos de Error Comunes

| Código HTTP | Error Code | Descripción |
|---|---|---|
| 400 | INVALID_REQUEST | Request body inválido |
| 401 | UNAUTHORIZED | Falta autenticación o token inválido |
| 403 | FORBIDDEN | Sin permisos para esta acción |
| 404 | NOT_FOUND | Recurso no existe |
| 409 | CONFLICT | Duplicado o conflicto de estado |
| 422 | VALIDATION_ERROR | Validación de datos falló |
| 500 | INTERNAL_ERROR | Error del servidor |

### Ejemplo de Error

```json
{
  "detail": "Email already registered",
  "error_code": "DUPLICATE_EMAIL",
  "timestamp": "2024-02-17T10:30:00Z"
}
```

---

## 11. PAGINACIÓN

Todos los endpoints que listan recursos soportan paginación:

```
GET /resource?skip=0&limit=10&search=query&sort=created_at&order=desc

Query Parameters:
- skip: Número de registros a saltar (default: 0)
- limit: Registros por página (default: 10, máximo: 100)
- search: Término de búsqueda (en campos aplicables)
- sort: Campo para ordenar
- order: Dirección (asc/desc)

Response:
{
  "total": 100,
  "skip": 0,
  "limit": 10,
  "items": [...]
}
```

---

## 12. RATE LIMITING

- Públicos: 100 requests/minuto por IP
- Autenticados: 1000 requests/minuto por usuario
- Uploads: 10 files/minuto por usuario

Response 429 (Too Many Requests):
```json
{
  "detail": "Rate limit exceeded",
  "retry_after": 60
}
```

---

## 13. WEBHOOKS (Fase 2+)

Próximamente:
- Member attendance webhook
- Payment received webhook
- Communication sent webhook
- File uploaded webhook

