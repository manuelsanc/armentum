-- Row Level Security (RLS) Policies for Armentum
-- Enable RLS on all tables and define access policies based on user roles

-- ============================================================================
-- UTILITY FUNCTIONS
-- ============================================================================

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM users u
        JOIN users_roles ur ON u.id = ur.user_id
        JOIN roles r ON ur.role_id = r.id
        WHERE u.id = current_setting('app.current_user_id', true)::uuid
        AND r.nombre = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function to get current user's miembro_id
CREATE OR REPLACE FUNCTION current_miembro_id()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT m.id
        FROM miembros m
        WHERE m.user_id = current_setting('app.current_user_id', true)::uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================================
-- USERS TABLE
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "users_select_own" ON users
    FOR SELECT
    USING (id = current_setting('app.current_user_id', true)::uuid);

-- Admins can read all users
CREATE POLICY "users_select_admin" ON users
    FOR SELECT
    USING (is_admin());

-- Users can update their own data (except roles)
CREATE POLICY "users_update_own" ON users
    FOR UPDATE
    USING (id = current_setting('app.current_user_id', true)::uuid);

-- Admins can update all users
CREATE POLICY "users_update_admin" ON users
    FOR UPDATE
    USING (is_admin());

-- Only admins can insert users (registration handled separately)
CREATE POLICY "users_insert_admin" ON users
    FOR INSERT
    WITH CHECK (is_admin());

-- Only admins can delete users
CREATE POLICY "users_delete_admin" ON users
    FOR DELETE
    USING (is_admin());

-- ============================================================================
-- ROLES TABLE
-- ============================================================================

ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Everyone can read roles (needed for UI)
CREATE POLICY "roles_select_all" ON roles
    FOR SELECT
    USING (true);

-- Only admins can modify roles
CREATE POLICY "roles_insert_admin" ON roles
    FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "roles_update_admin" ON roles
    FOR UPDATE
    USING (is_admin());

CREATE POLICY "roles_delete_admin" ON roles
    FOR DELETE
    USING (is_admin());

-- ============================================================================
-- USERS_ROLES TABLE
-- ============================================================================

ALTER TABLE users_roles ENABLE ROW LEVEL SECURITY;

-- Users can see their own roles
CREATE POLICY "users_roles_select_own" ON users_roles
    FOR SELECT
    USING (user_id = current_setting('app.current_user_id', true)::uuid);

-- Admins can see all role assignments
CREATE POLICY "users_roles_select_admin" ON users_roles
    FOR SELECT
    USING (is_admin());

-- Only admins can manage role assignments
CREATE POLICY "users_roles_insert_admin" ON users_roles
    FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "users_roles_delete_admin" ON users_roles
    FOR DELETE
    USING (is_admin());

-- ============================================================================
-- MIEMBROS TABLE
-- ============================================================================

ALTER TABLE miembros ENABLE ROW LEVEL SECURITY;

-- Coristas can read their own member record
CREATE POLICY "miembros_select_own" ON miembros
    FOR SELECT
    USING (user_id = current_setting('app.current_user_id', true)::uuid);

-- Admins can read all miembros
CREATE POLICY "miembros_select_admin" ON miembros
    FOR SELECT
    USING (is_admin());

-- Coristas can update their own data (limited fields)
CREATE POLICY "miembros_update_own" ON miembros
    FOR UPDATE
    USING (user_id = current_setting('app.current_user_id', true)::uuid);

-- Admins can update all miembros
CREATE POLICY "miembros_update_admin" ON miembros
    FOR UPDATE
    USING (is_admin());

-- Only admins can insert miembros
CREATE POLICY "miembros_insert_admin" ON miembros
    FOR INSERT
    WITH CHECK (is_admin());

-- Only admins can delete miembros
CREATE POLICY "miembros_delete_admin" ON miembros
    FOR DELETE
    USING (is_admin());

-- ============================================================================
-- EVENTOS_PUBLICOS TABLE (Public events)
-- ============================================================================

ALTER TABLE eventos_publicos ENABLE ROW LEVEL SECURITY;

-- Everyone can read public events
CREATE POLICY "eventos_publicos_select_all" ON eventos_publicos
    FOR SELECT
    USING (true);

-- Only admins can create events
CREATE POLICY "eventos_publicos_insert_admin" ON eventos_publicos
    FOR INSERT
    WITH CHECK (is_admin());

-- Only admins can update events
CREATE POLICY "eventos_publicos_update_admin" ON eventos_publicos
    FOR UPDATE
    USING (is_admin());

-- Only admins can delete events
CREATE POLICY "eventos_publicos_delete_admin" ON eventos_publicos
    FOR DELETE
    USING (is_admin());

-- ============================================================================
-- ENSAYOS TABLE (Rehearsals - internal)
-- ============================================================================

ALTER TABLE ensayos ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read ensayos
CREATE POLICY "ensayos_select_authenticated" ON ensayos
    FOR SELECT
    USING (current_setting('app.current_user_id', true) IS NOT NULL);

-- Only admins can create ensayos
CREATE POLICY "ensayos_insert_admin" ON ensayos
    FOR INSERT
    WITH CHECK (is_admin());

-- Only admins can update ensayos
CREATE POLICY "ensayos_update_admin" ON ensayos
    FOR UPDATE
    USING (is_admin());

-- Only admins can delete ensayos
CREATE POLICY "ensayos_delete_admin" ON ensayos
    FOR DELETE
    USING (is_admin());

-- ============================================================================
-- ASISTENCIAS TABLE
-- ============================================================================

ALTER TABLE asistencias ENABLE ROW LEVEL SECURITY;

-- Coristas can see their own attendance
CREATE POLICY "asistencias_select_own" ON asistencias
    FOR SELECT
    USING (miembro_id = current_miembro_id());

-- Admins can see all attendance
CREATE POLICY "asistencias_select_admin" ON asistencias
    FOR SELECT
    USING (is_admin());

-- Only admins can manage attendance records
CREATE POLICY "asistencias_insert_admin" ON asistencias
    FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "asistencias_update_admin" ON asistencias
    FOR UPDATE
    USING (is_admin());

CREATE POLICY "asistencias_delete_admin" ON asistencias
    FOR DELETE
    USING (is_admin());

-- ============================================================================
-- CUOTAS TABLE (Fees/Dues)
-- ============================================================================

ALTER TABLE cuotas ENABLE ROW LEVEL SECURITY;

-- Coristas can see their own fees
CREATE POLICY "cuotas_select_own" ON cuotas
    FOR SELECT
    USING (miembro_id = current_miembro_id());

-- Admins can see all fees
CREATE POLICY "cuotas_select_admin" ON cuotas
    FOR SELECT
    USING (is_admin());

-- Only admins can create fees
CREATE POLICY "cuotas_insert_admin" ON cuotas
    FOR INSERT
    WITH CHECK (is_admin());

-- Only admins can update fees
CREATE POLICY "cuotas_update_admin" ON cuotas
    FOR UPDATE
    USING (is_admin());

-- Only admins can delete fees
CREATE POLICY "cuotas_delete_admin" ON cuotas
    FOR DELETE
    USING (is_admin());

-- ============================================================================
-- COMUNICADOS TABLE
-- ============================================================================

ALTER TABLE comunicados ENABLE ROW LEVEL SECURITY;

-- Users can see communications addressed to them or their group
CREATE POLICY "comunicados_select_own" ON comunicados
    FOR SELECT
    USING (
        is_admin()
        OR enviado_por = current_setting('app.current_user_id', true)::uuid
        OR miembro_destino = current_miembro_id()
        OR EXISTS (
            SELECT 1 FROM miembros m
            WHERE m.id = current_miembro_id()
            AND (
                comunicados.dirigido_a = m.voz
                OR comunicados.grupo_destino = m.voz
            )
        )
    );

-- Only admins can create communications
CREATE POLICY "comunicados_insert_admin" ON comunicados
    FOR INSERT
    WITH CHECK (is_admin());

-- Only admins can update communications
CREATE POLICY "comunicados_update_admin" ON comunicados
    FOR UPDATE
    USING (is_admin());

-- Only admins can delete communications
CREATE POLICY "comunicados_delete_admin" ON comunicados
    FOR DELETE
    USING (is_admin());

-- ============================================================================
-- ARCHIVOS TABLE
-- ============================================================================

ALTER TABLE archivos ENABLE ROW LEVEL SECURITY;

-- Public files are readable by all authenticated users
CREATE POLICY "archivos_select_public" ON archivos
    FOR SELECT
    USING (
        privado = false
        AND current_setting('app.current_user_id', true) IS NOT NULL
    );

-- Private files only readable by admins
CREATE POLICY "archivos_select_admin" ON archivos
    FOR SELECT
    USING (is_admin());

-- Only admins can upload files
CREATE POLICY "archivos_insert_admin" ON archivos
    FOR INSERT
    WITH CHECK (is_admin());

-- Only admins can update files
CREATE POLICY "archivos_update_admin" ON archivos
    FOR UPDATE
    USING (is_admin());

-- Only admins can delete files
CREATE POLICY "archivos_delete_admin" ON archivos
    FOR DELETE
    USING (is_admin());

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant execute on helper functions to authenticated users
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION current_miembro_id() TO authenticated;
