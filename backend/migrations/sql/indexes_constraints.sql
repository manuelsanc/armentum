-- Indexes and Constraints for Armentum
-- Additional performance indexes and data integrity constraints

-- ============================================================================
-- ADDITIONAL INDEXES FOR PERFORMANCE
-- ============================================================================

-- Users table - partial indexes for common queries
CREATE INDEX IF NOT EXISTS ix_users_active ON users (id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS ix_users_email_verified ON users (id) WHERE email_verified = true;

-- Miembros table - composite indexes for filtering
CREATE INDEX IF NOT EXISTS ix_miembros_voz_estado ON miembros (voz, estado);
CREATE INDEX IF NOT EXISTS ix_miembros_fecha_ingreso ON miembros (fecha_ingreso);

-- Eventos_publicos - partial indexes
CREATE INDEX IF NOT EXISTS ix_eventos_publicos_tipo ON eventos_publicos (tipo);
CREATE INDEX IF NOT EXISTS ix_eventos_publicos_activos ON eventos_publicos (fecha, estado) 
    WHERE estado IN ('planificado', 'confirmado');
CREATE INDEX IF NOT EXISTS ix_eventos_publicos_proximos ON eventos_publicos (fecha) 
    WHERE fecha >= CURRENT_DATE;

-- Ensayos - partial indexes for upcoming rehearsals
CREATE INDEX IF NOT EXISTS ix_ensayos_tipo ON ensayos (tipo);
CREATE INDEX IF NOT EXISTS ix_ensayos_proximos ON ensayos (fecha) 
    WHERE fecha >= CURRENT_DATE;
CREATE INDEX IF NOT EXISTS ix_ensayos_cuerdas ON ensayos (cuerdas) 
    WHERE cuerdas IS NOT NULL;

-- Asistencias - composite indexes for reporting
CREATE INDEX IF NOT EXISTS ix_asistencias_presente ON asistencias (presente);
CREATE INDEX IF NOT EXISTS ix_asistencias_ensayo_presente ON asistencias (ensayo_id, presente);
CREATE INDEX IF NOT EXISTS ix_asistencias_registrado_en ON asistencias (registrado_en);

-- Cuotas - indexes for financial reporting
CREATE INDEX IF NOT EXISTS ix_cuotas_tipo ON cuotas (tipo);
CREATE INDEX IF NOT EXISTS ix_cuotas_fecha_pago ON cuotas (fecha_pago) WHERE fecha_pago IS NOT NULL;
CREATE INDEX IF NOT EXISTS ix_cuotas_pendientes ON cuotas (fecha_vencimiento, estado) 
    WHERE estado = 'pendiente';
CREATE INDEX IF NOT EXISTS ix_cuotas_vencidas ON cuotas (fecha_vencimiento, estado) 
    WHERE estado = 'pendiente' AND fecha_vencimiento < CURRENT_DATE;

-- Comunicados - indexes for filtering
CREATE INDEX IF NOT EXISTS ix_comunicados_dirigido_a ON comunicados (dirigido_a) 
    WHERE dirigido_a IS NOT NULL;
CREATE INDEX IF NOT EXISTS ix_comunicados_grupo_destino ON comunicados (grupo_destino) 
    WHERE grupo_destino IS NOT NULL;
CREATE INDEX IF NOT EXISTS ix_comunicados_enviado_en ON comunicados (enviado_en) 
    WHERE enviado_en IS NOT NULL;
CREATE INDEX IF NOT EXISTS ix_comunicados_programados ON comunicados (programado_para) 
    WHERE programado_para IS NOT NULL AND enviado_en IS NULL;

-- Archivos - indexes for filtering
CREATE INDEX IF NOT EXISTS ix_archivos_tipo ON archivos (tipo);
CREATE INDEX IF NOT EXISTS ix_archivos_voz ON archivos (voz) WHERE voz IS NOT NULL;
CREATE INDEX IF NOT EXISTS ix_archivos_privado ON archivos (privado);

-- ============================================================================
-- UNIQUE CONSTRAINTS
-- ============================================================================

-- Note: uq_asistencias_miembro_ensayo is already defined in 001_initial_schema.py

-- Ensure user can only have one role assignment per role
ALTER TABLE users_roles 
    ADD CONSTRAINT uq_users_roles_user_role 
    UNIQUE (user_id, role_id);

-- ============================================================================
-- CHECK CONSTRAINTS
-- ============================================================================

-- Validate email format (basic check)
ALTER TABLE users 
    ADD CONSTRAINT chk_users_email_format 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Validate estado values for miembros
ALTER TABLE miembros 
    ADD CONSTRAINT chk_miembros_estado 
    CHECK (estado IN ('activo', 'inactivo', 'licencia', 'baja'));

-- Validate voz values for miembros
ALTER TABLE miembros 
    ADD CONSTRAINT chk_miembros_voz 
    CHECK (voz IN ('soprano1', 'soprano2', 'contralto1', 'contralto2', 'tenor1', 'tenor2', 'bajo1', 'bajo2', 'director', 'pianista'));

-- Validate estado values for eventos_publicos
ALTER TABLE eventos_publicos 
    ADD CONSTRAINT chk_eventos_publicos_estado 
    CHECK (estado IN ('planificado', 'confirmado', 'realizado', 'cancelado'));

-- Validate tipo values for eventos_publicos
ALTER TABLE eventos_publicos 
    ADD CONSTRAINT chk_eventos_publicos_tipo 
    CHECK (tipo IN ('concierto', 'misa', 'presentacion', 'otro'));

-- Validate tipo values for ensayos
ALTER TABLE ensayos 
    ADD CONSTRAINT chk_ensayos_tipo 
    CHECK (tipo IN ('general', 'por_cuerdas', 'individual', 'con_piano', 'otros'));

-- Validate tipo values for cuotas
ALTER TABLE cuotas 
    ADD CONSTRAINT chk_cuotas_tipo 
    CHECK (tipo IN ('regular', 'extraordinaria', 'especial', 'multa'));

-- Validate estado values for cuotas
ALTER TABLE cuotas 
    ADD CONSTRAINT chk_cuotas_estado 
    CHECK (estado IN ('pendiente', 'pagada', 'cancelada'));

-- Validate monto is positive
ALTER TABLE cuotas 
    ADD CONSTRAINT chk_cuotas_monto_positivo 
    CHECK (monto > 0);

-- Validate tipo values for archivos
ALTER TABLE archivos 
    ADD CONSTRAINT chk_archivos_tipo 
    CHECK (tipo IN ('partitura', 'audio', 'video', 'imagen', 'documento', 'otro'));

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Create function for auto-updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_miembros_updated_at
    BEFORE UPDATE ON miembros
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_eventos_publicos_updated_at
    BEFORE UPDATE ON eventos_publicos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ensayos_updated_at
    BEFORE UPDATE ON ensayos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FOREIGN KEY OPTIONS (already defined in migration, but explicit here for clarity)
-- ============================================================================

-- Note: ON DELETE CASCADE is already set in the migration
-- These ensure referential integrity when parent records are deleted

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE users IS 'User accounts for the choir management system';
COMMENT ON TABLE roles IS 'Role definitions (admin, corista)';
COMMENT ON TABLE users_roles IS 'Many-to-many relationship between users and roles';
COMMENT ON TABLE miembros IS 'Choir member profiles linked to user accounts';
COMMENT ON TABLE eventos_publicos IS 'Public events and performances';
COMMENT ON TABLE ensayos IS 'Rehearsal sessions (internal)';
COMMENT ON TABLE asistencias IS 'Attendance records for rehearsals';
COMMENT ON TABLE cuotas IS 'Fee/dues tracking for members';
COMMENT ON TABLE comunicados IS 'Communications sent to members';
COMMENT ON TABLE archivos IS 'File attachments for events and rehearsals';

COMMENT ON COLUMN miembros.saldo_actual IS 'Current outstanding balance in fees';
COMMENT ON COLUMN cuotas.fecha_vencimiento IS 'Due date for payment';
COMMENT ON COLUMN cuotas.fecha_pago IS 'Actual payment date, NULL if not paid';
COMMENT ON COLUMN archivos.privado IS 'Whether file is restricted to admins only';
