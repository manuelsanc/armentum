-- =============================================================================
-- ARMENTUM - MIGRACIÓN INICIAL (PRODUCCIÓN)
-- Ejecutar en Supabase SQL Editor
-- =============================================================================

-- Create alembic_version table for migration tracking
CREATE TABLE IF NOT EXISTS alembic_version (
    version_num VARCHAR(32) NOT NULL PRIMARY KEY
);

-- Insert initial version
INSERT INTO alembic_version (version_num) VALUES ('001') ON CONFLICT DO NOTHING;

-- =============================================================================
-- USERS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_users_email ON users(email);

-- =============================================================================
-- ROLES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    permisos JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- USERS_ROLES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS users_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS ix_users_roles_user_id ON users_roles(user_id);
CREATE INDEX IF NOT EXISTS ix_users_roles_role_id ON users_roles(role_id);

-- =============================================================================
-- MIEMBROS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS miembros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    voz VARCHAR(50) NOT NULL,
    fecha_ingreso DATE NOT NULL,
    estado VARCHAR(50) DEFAULT 'activo',
    telefono VARCHAR(20),
    saldo_actual NUMERIC(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_miembros_user_id ON miembros(user_id);
CREATE INDEX IF NOT EXISTS ix_miembros_estado ON miembros(estado);

-- =============================================================================
-- EVENTOS_PUBLICOS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS eventos_publicos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha DATE NOT NULL,
    hora VARCHAR(10) NOT NULL,
    lugar VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    estado VARCHAR(50) DEFAULT 'planificado',
    imagen_url VARCHAR(255),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_eventos_publicos_fecha ON eventos_publicos(fecha);
CREATE INDEX IF NOT EXISTS ix_eventos_publicos_estado ON eventos_publicos(estado);
CREATE INDEX IF NOT EXISTS ix_eventos_publicos_created_by ON eventos_publicos(created_by);

-- =============================================================================
-- ENSAYOS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS ensayos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo VARCHAR(50) NOT NULL,
    nombre VARCHAR(255),
    fecha DATE NOT NULL,
    hora VARCHAR(10) NOT NULL,
    lugar VARCHAR(255) NOT NULL,
    cuerdas VARCHAR(255),
    descripcion TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_ensayos_fecha ON ensayos(fecha);
CREATE INDEX IF NOT EXISTS ix_ensayos_created_by ON ensayos(created_by);

-- =============================================================================
-- ASISTENCIAS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS asistencias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    miembro_id UUID NOT NULL REFERENCES miembros(id) ON DELETE CASCADE,
    ensayo_id UUID NOT NULL REFERENCES ensayos(id) ON DELETE CASCADE,
    presente BOOLEAN DEFAULT TRUE,
    justificacion TEXT,
    registrado_por UUID REFERENCES users(id) ON DELETE SET NULL,
    registrado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_asistencias_miembro_ensayo UNIQUE (miembro_id, ensayo_id)
);

CREATE INDEX IF NOT EXISTS ix_asistencias_miembro_id ON asistencias(miembro_id);
CREATE INDEX IF NOT EXISTS ix_asistencias_ensayo_id ON asistencias(ensayo_id);
CREATE INDEX IF NOT EXISTS ix_asistencias_registrado_por ON asistencias(registrado_por);

-- =============================================================================
-- CUOTAS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS cuotas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    miembro_id UUID NOT NULL REFERENCES miembros(id) ON DELETE CASCADE,
    monto NUMERIC(10,2) NOT NULL,
    descripcion VARCHAR(255),
    tipo VARCHAR(50) DEFAULT 'regular',
    fecha_vencimiento DATE NOT NULL,
    estado VARCHAR(50) DEFAULT 'pendiente',
    fecha_pago DATE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_cuotas_miembro_id ON cuotas(miembro_id);
CREATE INDEX IF NOT EXISTS ix_cuotas_estado ON cuotas(estado);
CREATE INDEX IF NOT EXISTS ix_cuotas_fecha_vencimiento ON cuotas(fecha_vencimiento);
CREATE INDEX IF NOT EXISTS ix_cuotas_created_by ON cuotas(created_by);

-- =============================================================================
-- COMUNICADOS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS comunicados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    dirigido_a VARCHAR(50),
    grupo_destino VARCHAR(255),
    miembro_destino UUID,
    enviado_por UUID REFERENCES users(id) ON DELETE SET NULL,
    programado_para TIMESTAMP,
    enviado_en TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_comunicados_enviado_por ON comunicados(enviado_por);
CREATE INDEX IF NOT EXISTS ix_comunicados_miembro_destino ON comunicados(miembro_destino);

-- =============================================================================
-- ARCHIVOS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS archivos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    voz VARCHAR(50),
    evento_id UUID REFERENCES eventos_publicos(id) ON DELETE SET NULL,
    ensayo_id UUID REFERENCES ensayos(id) ON DELETE SET NULL,
    url VARCHAR(255) NOT NULL,
    privado BOOLEAN DEFAULT TRUE,
    subido_por UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_archivos_evento_id ON archivos(evento_id);
CREATE INDEX IF NOT EXISTS ix_archivos_ensayo_id ON archivos(ensayo_id);
CREATE INDEX IF NOT EXISTS ix_archivos_subido_por ON archivos(subido_por);

-- =============================================================================
-- SEED DATA - ROLES
-- =============================================================================
INSERT INTO roles (id, nombre, descripcion, permisos, created_at) VALUES
    (
        '00000000-0000-0000-0000-000000000001'::uuid,
        'admin',
        'Administrator with full access to all features',
        '{
            "users": {"read": true, "write": true, "delete": true},
            "miembros": {"read": true, "write": true, "delete": true},
            "eventos": {"read": true, "write": true, "delete": true},
            "ensayos": {"read": true, "write": true, "delete": true},
            "asistencias": {"read": true, "write": true, "delete": true},
            "cuotas": {"read": true, "write": true, "delete": true},
            "comunicados": {"read": true, "write": true, "delete": true},
            "archivos": {"read": true, "write": true, "delete": true}
        }'::jsonb,
        CURRENT_TIMESTAMP
    ),
    (
        '00000000-0000-0000-0000-000000000002'::uuid,
        'corista',
        'Choir member with limited access to own data',
        '{
            "miembros": {"read": "own", "write": "own"},
            "eventos": {"read": true},
            "ensayos": {"read": true},
            "asistencias": {"read": "own"},
            "cuotas": {"read": "own"},
            "comunicados": {"read": "own"},
            "archivos": {"read": "public"}
        }'::jsonb,
        CURRENT_TIMESTAMP
    ),
    (
        '00000000-0000-0000-0000-000000000003'::uuid,
        'director',
        'Choir director with elevated permissions',
        '{
            "miembros": {"read": true, "write": true},
            "eventos": {"read": true, "write": true},
            "ensayos": {"read": true, "write": true},
            "asistencias": {"read": true, "write": true},
            "comunicados": {"read": true, "write": true},
            "archivos": {"read": true, "write": true}
        }'::jsonb,
        CURRENT_TIMESTAMP
    )
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- SEED DATA - ADMIN USER
-- Password: Admin123!
-- =============================================================================
INSERT INTO users (id, email, password_hash, nombre, is_active, email_verified, created_at, updated_at) VALUES
    (
        '00000000-0000-0000-0000-000000000010'::uuid,
        'admin@armentum.dev',
        '$2b$12$Ueh4xJjR0VCi5Ynfl0qw2er6WC5RZpVbBvgZSqEqUTXAhZWL6t4nO',
        'Administrador',
        true,
        true,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
ON CONFLICT (id) DO NOTHING;

-- Assign admin role to admin user
INSERT INTO users_roles (id, user_id, role_id) VALUES
    (
        '00000000-0000-0000-0000-000000000020'::uuid,
        '00000000-0000-0000-0000-000000000010'::uuid,
        '00000000-0000-0000-0000-000000000001'::uuid
    )
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- DONE
-- =============================================================================
-- Migration completed successfully!
-- Default admin credentials:
-- Email: admin@armentum.dev
-- Password: Admin123!
-- IMPORTANT: Change this password after first login!
