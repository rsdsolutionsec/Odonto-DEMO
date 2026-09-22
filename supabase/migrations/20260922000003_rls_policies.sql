-- =====================================================================
-- MIGRACIÓN 3: POLÍTICAS DE SEGURIDAD RLS (ROW LEVEL SECURITY) (FASE 1)
-- Protección de datos clínicos y control de acceso basado en roles
-- =====================================================================

-- Habilitar RLS en todas las tablas del sistema
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Funciones auxiliares de seguridad
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS user_role AS $$
    SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin' AND is_active = true);
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_staff()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'receptionist', 'dentist') 
        AND is_active = true
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- -------------------------------------------------------------
-- 1. POLÍTICAS: profiles
-- -------------------------------------------------------------
CREATE POLICY "Usuarios autenticados pueden ver perfiles de su equipo"
ON profiles FOR SELECT
TO authenticated
USING (is_staff());

CREATE POLICY "Usuarios pueden actualizar su propio perfil"
ON profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "Admins pueden gestionar todos los perfiles"
ON profiles FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- -------------------------------------------------------------
-- 2. POLÍTICAS: specialties, services, rooms
-- (Catálogos visibles para el equipo, editables por admin)
-- -------------------------------------------------------------
CREATE POLICY "Personal puede ver especialidades"
ON specialties FOR SELECT
TO authenticated
USING (is_staff());

CREATE POLICY "Admins pueden gestionar especialidades"
ON specialties FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Personal puede ver servicios"
ON services FOR SELECT
TO authenticated
USING (is_staff());

CREATE POLICY "Admins pueden gestionar servicios"
ON services FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Personal puede ver consultorios"
ON rooms FOR SELECT
TO authenticated
USING (is_staff());

CREATE POLICY "Admins pueden gestionar consultorios"
ON rooms FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- -------------------------------------------------------------
-- 3. POLÍTICAS: professionals & professional_specialties
-- -------------------------------------------------------------
CREATE POLICY "Personal puede ver profesionales"
ON professionals FOR SELECT
TO authenticated
USING (is_staff());

CREATE POLICY "Admins pueden gestionar profesionales"
ON professionals FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Personal puede ver especialidades de profesionales"
ON professional_specialties FOR SELECT
TO authenticated
USING (is_staff());

CREATE POLICY "Admins pueden gestionar especialidades de profesionales"
ON professional_specialties FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- -------------------------------------------------------------
-- 4. POLÍTICAS: professional_schedules & schedule_blocks
-- -------------------------------------------------------------
CREATE POLICY "Personal puede ver horarios de atención"
ON professional_schedules FOR SELECT
TO authenticated
USING (is_staff());

CREATE POLICY "Admins y recepción pueden gestionar horarios"
ON professional_schedules FOR ALL
TO authenticated
USING (current_user_role() IN ('admin', 'receptionist'))
WITH CHECK (current_user_role() IN ('admin', 'receptionist'));

CREATE POLICY "Personal puede ver bloqueos de agenda"
ON schedule_blocks FOR SELECT
TO authenticated
USING (is_staff());

CREATE POLICY "Admins y recepción pueden gestionar bloqueos"
ON schedule_blocks FOR ALL
TO authenticated
USING (current_user_role() IN ('admin', 'receptionist'))
WITH CHECK (current_user_role() IN ('admin', 'receptionist'));

-- -------------------------------------------------------------
-- 5. POLÍTICAS: patients
-- -------------------------------------------------------------
CREATE POLICY "Personal puede ver pacientes"
ON patients FOR SELECT
TO authenticated
USING (is_staff());

CREATE POLICY "Admins y recepción pueden crear y modificar pacientes"
ON patients FOR ALL
TO authenticated
USING (current_user_role() IN ('admin', 'receptionist'))
WITH CHECK (current_user_role() IN ('admin', 'receptionist'));

-- -------------------------------------------------------------
-- 6. POLÍTICAS: appointments & appointment_status_history
-- -------------------------------------------------------------
CREATE POLICY "Personal puede ver citas"
ON appointments FOR SELECT
TO authenticated
USING (is_staff());

CREATE POLICY "Admins y recepción pueden gestionar citas"
ON appointments FOR ALL
TO authenticated
USING (current_user_role() IN ('admin', 'receptionist'))
WITH CHECK (current_user_role() IN ('admin', 'receptionist'));

CREATE POLICY "Odontólogos pueden actualizar el estado de sus citas"
ON appointments FOR UPDATE
TO authenticated
USING (
    current_user_role() = 'dentist' AND 
    professional_id IN (SELECT id FROM professionals WHERE user_id = auth.uid())
)
WITH CHECK (
    current_user_role() = 'dentist' AND 
    professional_id IN (SELECT id FROM professionals WHERE user_id = auth.uid())
);

CREATE POLICY "Personal puede ver historial de estados"
ON appointment_status_history FOR SELECT
TO authenticated
USING (is_staff());

CREATE POLICY "Historial de estados insertable por personal autenticado"
ON appointment_status_history FOR INSERT
TO authenticated
WITH CHECK (is_staff());

-- -------------------------------------------------------------
-- 7. POLÍTICAS: appointment_reminders & audit_logs
-- -------------------------------------------------------------
CREATE POLICY "Personal puede ver recordatorios"
ON appointment_reminders FOR SELECT
TO authenticated
USING (is_staff());

CREATE POLICY "Admins y recepción pueden gestionar recordatorios"
ON appointment_reminders FOR ALL
TO authenticated
USING (current_user_role() IN ('admin', 'receptionist'))
WITH CHECK (current_user_role() IN ('admin', 'receptionist'));

CREATE POLICY "Admins pueden ver logs de auditoría"
ON audit_logs FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Personal autenticado puede registrar auditoría"
ON audit_logs FOR INSERT
TO authenticated
WITH CHECK (is_staff());
