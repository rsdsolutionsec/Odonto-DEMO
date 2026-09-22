-- =====================================================================
-- MIGRACIÓN 2: EXCLUSION CONSTRAINTS, TRIGGERS Y FUNCIONES (FASE 1)
-- Control estricto de doble reserva y automatizaciones de base de datos
-- =====================================================================

-- Asegurar extensión btree_gist para tipos UUID y tstzrange en exclusion constraints
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- 1. Control de Doble Reserva a Nivel de Base de Datos
-- Restricción de Exclusión: Un mismo profesional NO puede tener citas solapadas
DO $$ BEGIN
    ALTER TABLE appointments 
    ADD CONSTRAINT no_overlapping_professional_appointments
    EXCLUDE USING gist (
        professional_id WITH =,
        tstzrange(start_time, end_time, '[)') WITH &&
    ) WHERE (status NOT IN ('cancelled', 'rescheduled'));
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Restricción de Exclusión: Un mismo consultorio/sillón NO puede tener citas solapadas
DO $$ BEGIN
    ALTER TABLE appointments 
    ADD CONSTRAINT no_overlapping_room_appointments
    EXCLUDE USING gist (
        room_id WITH =,
        tstzrange(start_time, end_time, '[)') WITH &&
    ) WHERE (status NOT IN ('cancelled', 'rescheduled'));
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Función genérica para actualización de timestamps (updated_at)
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers de updated_at
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON profiles;
CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

DROP TRIGGER IF EXISTS trg_professionals_updated_at ON professionals;
CREATE TRIGGER trg_professionals_updated_at
BEFORE UPDATE ON professionals
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

DROP TRIGGER IF EXISTS trg_patients_updated_at ON patients;
CREATE TRIGGER trg_patients_updated_at
BEFORE UPDATE ON patients
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

DROP TRIGGER IF EXISTS trg_services_updated_at ON services;
CREATE TRIGGER trg_services_updated_at
BEFORE UPDATE ON services
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

DROP TRIGGER IF EXISTS trg_rooms_updated_at ON rooms;
CREATE TRIGGER trg_rooms_updated_at
BEFORE UPDATE ON rooms
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

DROP TRIGGER IF EXISTS trg_professional_schedules_updated_at ON professional_schedules;
CREATE TRIGGER trg_professional_schedules_updated_at
BEFORE UPDATE ON professional_schedules
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

DROP TRIGGER IF EXISTS trg_appointments_updated_at ON appointments;
CREATE TRIGGER trg_appointments_updated_at
BEFORE UPDATE ON appointments
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- 3. Trigger para registrar automáticamente el historial de estados de cita
CREATE OR REPLACE FUNCTION handle_appointment_status_history()
RETURNS TRIGGER AS $$
BEGIN
    -- Si es INSERT o el estado cambió en UPDATE
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO appointment_status_history (
            appointment_id,
            previous_status,
            new_status,
            changed_by,
            notes
        ) VALUES (
            NEW.id,
            NULL,
            NEW.status,
            NEW.created_by,
            COALESCE(NEW.notes, 'Creación de cita')
        );
    ELSIF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
        INSERT INTO appointment_status_history (
            appointment_id,
            previous_status,
            new_status,
            changed_by,
            notes
        ) VALUES (
            NEW.id,
            OLD.status,
            NEW.status,
            auth.uid(),
            CASE 
                WHEN NEW.status = 'cancelled' THEN COALESCE(NEW.cancellation_reason, 'Cita cancelada')
                WHEN NEW.status = 'rescheduled' THEN 'Cita reprogramada'
                ELSE 'Actualización de estado a ' || NEW.status::TEXT
            END
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_appointment_status_audit ON appointments;
CREATE TRIGGER trg_appointment_status_audit
AFTER INSERT OR UPDATE OF status ON appointments
FOR EACH ROW EXECUTE FUNCTION handle_appointment_status_history();

-- 4. Trigger al registrar un nuevo usuario en auth.users
CREATE OR REPLACE FUNCTION handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        role,
        first_name,
        last_name,
        email,
        phone,
        is_active
    ) VALUES (
        NEW.id,
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'receptionist'),
        COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        NEW.email,
        NEW.raw_user_meta_data->>'phone',
        true
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        first_name = COALESCE(EXCLUDED.first_name, profiles.first_name),
        last_name = COALESCE(EXCLUDED.last_name, profiles.last_name);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_auth_user();
