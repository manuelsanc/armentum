-- Seed Data for Armentum
-- Default roles and admin user

-- ============================================================================
-- ROLES
-- ============================================================================

-- Insert default roles
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
        }'::json,
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
        }'::json,
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
        }'::json,
        CURRENT_TIMESTAMP
    );

-- ============================================================================
-- DEFAULT ADMIN USER
-- ============================================================================

-- Insert default admin user
-- Password: Admin123! (bcrypt hash generated with passlib)
-- IMPORTANT: Change this password immediately after first login!
INSERT INTO users (id, email, password_hash, nombre, is_active, email_verified, created_at, updated_at) VALUES
    (
        '00000000-0000-0000-0000-000000000010'::uuid,
        'admin@armentum.local',
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.qVv.1qMZqJTYGO',
        'Administrador',
        true,
        true,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );

-- Assign admin role to admin user
INSERT INTO users_roles (id, user_id, role_id) VALUES
    (
        '00000000-0000-0000-0000-000000000020'::uuid,
        '00000000-0000-0000-0000-000000000010'::uuid,
        '00000000-0000-0000-0000-000000000001'::uuid
    );

-- ============================================================================
-- SAMPLE VOZ OPTIONS (for reference)
-- ============================================================================

-- These are the valid voz values (defined in check constraint):
-- soprano1, soprano2, contralto1, contralto2, tenor1, tenor2, bajo1, bajo2, director, pianista

-- ============================================================================
-- SAMPLE ESTADO VALUES (for reference)
-- ============================================================================

-- miembros.estado: 'activo', 'inactivo', 'licencia', 'baja'
-- eventos_publicos.estado: 'planificado', 'confirmado', 'realizado', 'cancelado'
-- cuotas.estado: 'pendiente', 'pagada', 'cancelada'

-- ============================================================================
-- SAMPLE CUOTA TIPO VALUES (for reference)
-- ============================================================================

-- cuotas.tipo: 'regular', 'extraordinaria', 'especial', 'multa'

-- ============================================================================
-- SAMPLE ENSAYO TIPO VALUES (for reference)
-- ============================================================================

-- ensayos.tipo: 'general', 'por_cuerdas', 'individual', 'con_piano', 'otros'

-- ============================================================================
-- SAMPLE ARCHIVO TIPO VALUES (for reference)
-- ============================================================================

-- archivos.tipo: 'partitura', 'audio', 'video', 'imagen', 'documento', 'otro'

-- ============================================================================
-- NOTICE
-- ============================================================================

-- Default admin credentials:
-- Email: admin@armentum.local
-- Password: Admin123!
-- 
-- IMPORTANT: Change this password immediately after first deployment!
-- Run: UPDATE users SET password_hash = '<new_hash>' WHERE email = 'admin@armentum.local';
