-- =====================================================================
-- MIGRACIÓN 1: ESTRUCTURA INICIAL DE TABLAS Y TIPOS (FASE 1)
-- Sistema de Gestión Odontológica (Odonto-DEMO)
-- =====================================================================

-- Extensiones requeridas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gist"; -- Para Exclusion Constraints en citas

-- Tipos enumerados
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'receptionist', 'dentist');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE patient_status AS ENUM ('active', 'inactive');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE appointment_status AS ENUM (
        'pending',
        'confirmed',
        'checked_in',
        'in_progress',
        'completed',
        'cancelled',
        'no_show',
        'rescheduled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE reminder_channel AS ENUM ('whatsapp', 'email', 'sms');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE reminder_status AS ENUM ('pending', 'sent', 'failed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Perfiles de usuario (vinculados a auth.users de Supabase)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'receptionist',
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Especialidades Odontológicas
CREATE TABLE IF NOT EXISTS specialties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Profesionales / Odontólogos
CREATE TABLE IF NOT EXISTS professionals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES profiles(id) ON DELETE SET NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    document_id TEXT NOT NULL UNIQUE,
    license_number TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT '#3B82F6',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Relación Muchos a Muchos: Profesionales y Especialidades
CREATE TABLE IF NOT EXISTS professional_specialties (
    professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
    specialty_id UUID NOT NULL REFERENCES specialties(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (professional_id, specialty_id)
);

-- 5. Pacientes
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    document_id TEXT NOT NULL UNIQUE,
    birth_date DATE NOT NULL,
    gender gender_type NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    email TEXT,
    address TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    status patient_status NOT NULL DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Servicios Odontológicos (Catálogo de Tratamientos/Consultas)
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (price >= 0),
    color TEXT NOT NULL DEFAULT '#10B981',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Consultorios / Sillones (Rooms)
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Horarios de atención de Profesionales
CREATE TABLE IF NOT EXISTS professional_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0: Domingo, 1: Lunes, ... 6: Sábado
    start_time TIME NOT NULL,
    end_time TIME NOT NULL CHECK (end_time > start_time),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_professional_schedule_day UNIQUE (professional_id, day_of_week, start_time, end_time)
);

-- 9. Bloqueos de agenda (vacaciones, feriados, mantenimiento de sillón)
CREATE TABLE IF NOT EXISTS schedule_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    reason TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL CHECK (end_time > start_time),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Citas Odontológicas (Appointments)
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
    professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE RESTRICT,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE RESTRICT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL CHECK (end_time > start_time),
    status appointment_status NOT NULL DEFAULT 'pending',
    reason TEXT,
    notes TEXT,
    cancellation_reason TEXT,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. Historial Inmutable de Estados de Citas
CREATE TABLE IF NOT EXISTS appointment_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    previous_status appointment_status,
    new_status appointment_status NOT NULL,
    changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. Recordatorios de Citas
CREATE TABLE IF NOT EXISTS appointment_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    reminder_type TEXT NOT NULL DEFAULT 'confirmation',
    channel reminder_channel NOT NULL DEFAULT 'whatsapp',
    scheduled_for TIMESTAMPTZ NOT NULL,
    sent_at TIMESTAMPTZ,
    status reminder_status NOT NULL DEFAULT 'pending',
    response_payload JSONB,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 13. Auditoría de Operaciones Sensibles
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id UUID NOT NULL,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices de Rendimiento
CREATE INDEX IF NOT EXISTS idx_patients_document_id ON patients(document_id);
CREATE INDEX IF NOT EXISTS idx_patients_last_name ON patients(last_name);
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);

CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON appointments(start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_professional_id ON appointments(professional_id);
CREATE INDEX IF NOT EXISTS idx_appointments_room_id ON appointments(room_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

CREATE INDEX IF NOT EXISTS idx_professional_schedules_prof_day ON professional_schedules(professional_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_appointment_status_history_appt ON appointment_status_history(appointment_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity, entity_id);
