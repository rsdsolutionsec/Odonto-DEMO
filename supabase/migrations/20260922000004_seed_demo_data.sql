-- =====================================================================
-- MIGRACIÓN 4: DATOS DEMO / SEMILLA INICIAL (FASE 1)
-- Catálogos de especialidades, sillones, servicios, doctores, horarios y pacientes
-- =====================================================================

-- 1. Especialidades
INSERT INTO specialties (id, name, description) VALUES
    ('11111111-1111-1111-1111-111111111101', 'Odontología General', 'Atención primaria, prevención, limpiezas y restauraciones básicas.'),
    ('11111111-1111-1111-1111-111111111102', 'Ortodoncia', 'Corrección de anomalías de posición dental y maxilofacial.'),
    ('11111111-1111-1111-1111-111111111103', 'Endodoncia', 'Tratamiento de conductos y afecciones de la pulpa dental.'),
    ('11111111-1111-1111-1111-111111111104', 'Rehabilitación Oral', 'Prótesis fijas, removibles, coronas e implantes estéticos.'),
    ('11111111-1111-1111-1111-111111111105', 'Cirugía Maxilofacial', 'Extracciones complejas de terceros molares y cirugía oral.'),
    ('11111111-1111-1111-1111-111111111106', 'Periodoncia', 'Tratamiento de enfermedades de las encías y soporte dental.')
ON CONFLICT (id) DO NOTHING;

-- 2. Consultorios / Sillones (Rooms)
INSERT INTO rooms (id, name, description, is_active) VALUES
    ('22222222-2222-2222-2222-222222222201', 'Sillón 1 - Principal', 'Equipado para operatoria general y endodoncia con rayos X digital.', true),
    ('22222222-2222-2222-2222-222222222202', 'Sillón 2 - Ortodoncia y Cirugía', 'Equipado con instrumental quirúrgico y monitor panorámico.', true),
    ('22222222-2222-2222-2222-222222222203', 'Sillón 3 - Profilaxis y Estética', 'Sillón ergonómico para limpiezas profundas y blanqueamiento.', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Catálogo de Servicios Odontológicos
INSERT INTO services (id, name, description, duration_minutes, price, color, is_active) VALUES
    ('33333333-3333-3333-3333-333333333301', 'Evaluación y Diagnóstico Inicial', 'Examen clínico dental completo y planificación de tratamiento.', 30, 25.00, '#0284c7', true),
    ('33333333-3333-3333-3333-333333333302', 'Limpieza Dental y Profilaxis', 'Eliminación de sarro con ultrasonido, pulido y flúor.', 45, 40.00, '#059669', true),
    ('33333333-3333-3333-3333-333333333303', 'Restauración Resina Simple', 'Obturación estética fotocurada en una superficie dental.', 45, 45.00, '#2563eb', true),
    ('33333333-3333-3333-3333-333333333304', 'Control y Ajuste de Ortodoncia', 'Revisión periódica de brackets, cambio de arcos y ligaduras.', 30, 35.00, '#db2777', true),
    ('33333333-3333-3333-3333-333333333305', 'Endodoncia Unirradicular', 'Tratamiento de conducto en diente anterior o premolar.', 90, 130.00, '#7c3aed', true),
    ('33333333-3333-3333-3333-333333333306', 'Extracción Dental Simple', 'Exodoncia con anestesia local sin colgajo quirúrgico.', 45, 50.00, '#d97706', true),
    ('33333333-3333-3333-3333-333333333307', 'Blanqueamiento Dental LED', 'Sesión clínica de blanqueamiento con lámpara de fotocurado.', 60, 160.00, '#0891b2', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Odontólogos / Profesionales
INSERT INTO professionals (id, first_name, last_name, document_id, license_number, phone, email, color, is_active) VALUES
    ('44444444-4444-4444-4444-444444444401', 'Carlos', 'Mendoza', '0918273645', 'OD-4821', '0991234567', 'dr.mendoza@odonto.com', '#2563eb', true),
    ('44444444-4444-4444-4444-444444444402', 'Andrea', 'Suárez', '0927364518', 'OD-5932', '0982345678', 'dra.suarez@odonto.com', '#db2777', true),
    ('44444444-4444-4444-4444-444444444403', 'Roberto', 'Valdivieso', '0936451827', 'OD-6104', '0973456789', 'dr.valdivieso@odonto.com', '#059669', true)
ON CONFLICT (id) DO NOTHING;

-- Relación de especialidades por profesional
INSERT INTO professional_specialties (professional_id, specialty_id) VALUES
    ('44444444-4444-4444-4444-444444444401', '11111111-1111-1111-1111-111111111101'), -- Dr. Mendoza -> Odontología General
    ('44444444-4444-4444-4444-444444444401', '11111111-1111-1111-1111-111111111103'), -- Dr. Mendoza -> Endodoncia
    ('44444444-4444-4444-4444-444444444402', '11111111-1111-1111-1111-111111111102'), -- Dra. Suárez -> Ortodoncia
    ('44444444-4444-4444-4444-444444444403', '11111111-1111-1111-1111-111111111104'), -- Dr. Valdivieso -> Rehabilitación
    ('44444444-4444-4444-4444-444444444403', '11111111-1111-1111-1111-111111111105')  -- Dr. Valdivieso -> Cirugía
ON CONFLICT (professional_id, specialty_id) DO NOTHING;

-- 5. Horarios Laborales (Lunes a Viernes 08:30 a 17:30, Sábados 08:30 a 13:00)
-- 1: Lunes, 2: Martes, 3: Miércoles, 4: Jueves, 5: Viernes, 6: Sábado
INSERT INTO professional_schedules (professional_id, day_of_week, start_time, end_time, is_active) VALUES
    -- Dr. Carlos Mendoza: Lunes a Viernes
    ('44444444-4444-4444-4444-444444444401', 1, '08:30:00', '17:30:00', true),
    ('44444444-4444-4444-4444-444444444401', 2, '08:30:00', '17:30:00', true),
    ('44444444-4444-4444-4444-444444444401', 3, '08:30:00', '17:30:00', true),
    ('44444444-4444-4444-4444-444444444401', 4, '08:30:00', '17:30:00', true),
    ('44444444-4444-4444-4444-444444444401', 5, '08:30:00', '17:30:00', true),

    -- Dra. Andrea Suárez: Lunes, Miércoles, Viernes y Sábado
    ('44444444-4444-4444-4444-444444444402', 1, '09:00:00', '18:00:00', true),
    ('44444444-4444-4444-4444-444444444402', 3, '09:00:00', '18:00:00', true),
    ('44444444-4444-4444-4444-444444444402', 5, '09:00:00', '18:00:00', true),
    ('44444444-4444-4444-4444-444444444402', 6, '08:30:00', '13:00:00', true),

    -- Dr. Roberto Valdivieso: Martes, Jueves y Sábado
    ('44444444-4444-4444-4444-444444444403', 2, '08:00:00', '16:00:00', true),
    ('44444444-4444-4444-4444-444444444403', 4, '08:00:00', '16:00:00', true),
    ('44444444-4444-4444-4444-444444444403', 6, '08:30:00', '13:00:00', true)
ON CONFLICT DO NOTHING;

-- 6. Pacientes Demo
INSERT INTO patients (
    id, first_name, last_name, document_id, birth_date, gender, 
    phone, whatsapp, email, address, emergency_contact_name, emergency_contact_phone, 
    status, notes
) VALUES
    (
        '55555555-5555-5555-5555-555555555501', 'Juan', 'Pérez Morales', '0919283746', '1988-04-15', 'male',
        '0981112233', '0981112233', 'juan.perez@example.com', 'Av. 9 de Octubre y Pichincha',
        'Carmen Morales (Madre)', '0994445566', 'active', 'Sensibilidad dental en cuadrante inferior izquierdo.'
    ),
    (
        '55555555-5555-5555-5555-555555555502', 'María', 'Fernández Loor', '0928374655', '1995-11-23', 'female',
        '0972223344', '0972223344', 'maria.fernandez@example.com', 'Urdesa Central, Calle 3ra #204',
        'Jorge Fernández (Hermano)', '0985556677', 'active', 'Paciente en tratamiento ortodóncico activo.'
    ),
    (
        '55555555-5555-5555-5555-555555555503', 'Carlos', 'Ruiz Zambrano', '0937465564', '1982-08-09', 'male',
        '0963334455', '0963334455', 'carlos.ruiz@example.com', 'Ceibos, Mz 14 Villa 8',
        'Patricia Zambrano (Esposa)', '0996667788', 'active', 'Alergia leve a la penicilina reportada.'
    ),
    (
        '55555555-5555-5555-5555-555555555504', 'Sofía', 'Montero Vélez', '0946556473', '2001-02-18', 'female',
        '0954445566', '0954445566', 'sofia.montero@example.com', 'Samborondón Km 2.5',
        'Elena Vélez (Madre)', '0977778899', 'active', 'Interés en blanqueamiento dental y estética.'
    ),
    (
        '55555555-5555-5555-5555-555555555505', 'Fernando', 'Gómez Cedeño', '0955647382', '1976-06-30', 'male',
        '0945556677', '0945556677', 'fernando.gomez@example.com', 'Alborada 4ta Etapa',
        'Lucía Gómez (Hija)', '0988889900', 'active', 'Control semestral de coronas fijas.'
    )
ON CONFLICT (id) DO NOTHING;
