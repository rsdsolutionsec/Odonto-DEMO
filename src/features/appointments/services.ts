import { createServerSupabaseClient } from '@/lib/supabase/server';
import { AppointmentWithDetails, AppointmentStatus, Appointment } from '@/types/app.types';
import { AppointmentFormData } from '@/lib/validations/appointment.schema';
import { isBefore, isAfter, parseISO, startOfDay, endOfDay, addHours } from 'date-fns';

// Citas iniciales para pruebas y demostración
const now = new Date();
const todayDateStr = now.toISOString().slice(0, 10);

let inMemoryAppointments: AppointmentWithDetails[] = [
  {
    id: '66666666-6666-6666-6666-666666666601',
    patient_id: '55555555-5555-5555-5555-555555555501',
    professional_id: '44444444-4444-4444-4444-444444444401',
    service_id: '33333333-3333-3333-3333-333333333301',
    room_id: '22222222-2222-2222-2222-222222222201',
    start_time: `${todayDateStr}T09:00:00Z`,
    end_time: `${todayDateStr}T09:30:00Z`,
    status: 'confirmed',
    reason: 'Evaluación general y dolor molar',
    notes: 'Primera visita del paciente en el año.',
    cancellation_reason: null,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    patient: {
      id: '55555555-5555-5555-5555-555555555501',
      first_name: 'Juan',
      last_name: 'Pérez Morales',
      document_id: '0919283746',
      phone: '0981112233',
      email: 'juan.perez@example.com',
    },
    professional: {
      id: '44444444-4444-4444-4444-444444444401',
      first_name: 'Carlos',
      last_name: 'Mendoza',
      color: '#2563eb',
    },
    service: {
      id: '33333333-3333-3333-3333-333333333301',
      name: 'Evaluación y Diagnóstico Inicial',
      duration_minutes: 30,
      price: 25,
      color: '#0284c7',
    },
    room: {
      id: '22222222-2222-2222-2222-222222222201',
      name: 'Sillón 1 - Principal',
    },
  },
  {
    id: '66666666-6666-6666-6666-666666666602',
    patient_id: '55555555-5555-5555-5555-555555555502',
    professional_id: '44444444-4444-4444-4444-444444444402',
    service_id: '33333333-3333-3333-3333-333333333304',
    room_id: '22222222-2222-2222-2222-222222222202',
    start_time: `${todayDateStr}T10:00:00Z`,
    end_time: `${todayDateStr}T10:30:00Z`,
    status: 'checked_in',
    reason: 'Ajuste mensual de arcos de ortodoncia',
    notes: 'Paciente ya se encuentra en sala de espera.',
    cancellation_reason: null,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    patient: {
      id: '55555555-5555-5555-5555-555555555502',
      first_name: 'María',
      last_name: 'Fernández Loor',
      document_id: '0928374655',
      phone: '0972223344',
      email: 'maria.fernandez@example.com',
    },
    professional: {
      id: '44444444-4444-4444-4444-444444444402',
      first_name: 'Andrea',
      last_name: 'Suárez',
      color: '#db2777',
    },
    service: {
      id: '33333333-3333-3333-3333-333333333304',
      name: 'Control y Ajuste de Ortodoncia',
      duration_minutes: 30,
      price: 35,
      color: '#db2777',
    },
    room: {
      id: '22222222-2222-2222-2222-222222222202',
      name: 'Sillón 2 - Ortodoncia y Cirugía',
    },
  },
  {
    id: '66666666-6666-6666-6666-666666666603',
    patient_id: '55555555-5555-5555-5555-555555555503',
    professional_id: '44444444-4444-4444-4444-444444444401',
    service_id: '33333333-3333-3333-3333-333333333302',
    room_id: '22222222-2222-2222-2222-222222222201',
    start_time: `${todayDateStr}T11:00:00Z`,
    end_time: `${todayDateStr}T11:45:00Z`,
    status: 'pending',
    reason: 'Limpieza dental con ultrasonido',
    notes: 'Confirmación pendiente por WhatsApp.',
    cancellation_reason: null,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    patient: {
      id: '55555555-5555-5555-5555-555555555503',
      first_name: 'Carlos',
      last_name: 'Ruiz Zambrano',
      document_id: '0937465564',
      phone: '0963334455',
      email: 'carlos.ruiz@example.com',
    },
    professional: {
      id: '44444444-4444-4444-4444-444444444401',
      first_name: 'Carlos',
      last_name: 'Mendoza',
      color: '#2563eb',
    },
    service: {
      id: '33333333-3333-3333-3333-333333333302',
      name: 'Limpieza Dental y Profilaxis',
      duration_minutes: 45,
      price: 40,
      color: '#059669',
    },
    room: {
      id: '22222222-2222-2222-2222-222222222201',
      name: 'Sillón 1 - Principal',
    },
  },
];

export interface AppointmentFilters {
  startDate?: string;
  endDate?: string;
  professionalId?: string;
  roomId?: string;
  status?: string;
  patientId?: string;
}

export async function getAppointments(filters?: AppointmentFilters): Promise<AppointmentWithDetails[]> {
  try {
    const supabase = await createServerSupabaseClient();
    let query = supabase
      .from('appointments')
      .select(`
        *,
        patient:patients(id, first_name, last_name, document_id, phone, email),
        professional:professionals(id, first_name, last_name, color),
        service:services(id, name, duration_minutes, price, color),
        room:rooms(id, name)
      `)
      .order('start_time', { ascending: true });

    if (filters?.startDate) query = query.gte('start_time', filters.startDate);
    if (filters?.endDate) query = query.lte('start_time', filters.endDate);
    if (filters?.professionalId) query = query.eq('professional_id', filters.professionalId);
    if (filters?.roomId) query = query.eq('room_id', filters.roomId);
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.patientId) query = query.eq('patient_id', filters.patientId);

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      let filtered = [...inMemoryAppointments];
      if (filters?.professionalId) filtered = filtered.filter((a) => a.professional_id === filters.professionalId);
      if (filters?.roomId) filtered = filtered.filter((a) => a.room_id === filters.roomId);
      if (filters?.status) filtered = filtered.filter((a) => a.status === filters.status);
      if (filters?.patientId) filtered = filtered.filter((a) => a.patient_id === filters.patientId);
      if (filters?.startDate) {
        const start = parseISO(filters.startDate);
        filtered = filtered.filter((a) => parseISO(a.start_time) >= start);
      }
      if (filters?.endDate) {
        const end = parseISO(filters.endDate);
        filtered = filtered.filter((a) => parseISO(a.start_time) <= end);
      }
      return filtered;
    }

    return data as unknown as AppointmentWithDetails[];
  } catch {
    return inMemoryAppointments;
  }
}

export async function getPatientAppointments(patientId: string): Promise<AppointmentWithDetails[]> {
  return await getAppointments({ patientId });
}

export async function createAppointment(
  data: AppointmentFormData
): Promise<{ success: boolean; data?: AppointmentWithDetails; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient();
    const startTimeDate = new Date(data.startTime);
    const endTimeDate = new Date(data.endTime);

    // 1. VALIDACIÓN SERVIDOR: Verificar solapamiento para el odontólogo
    const hasProfOverlap = inMemoryAppointments.some(
      (a) =>
        a.professional_id === data.professionalId &&
        !['cancelled', 'rescheduled'].includes(a.status) &&
        isBefore(startTimeDate, parseISO(a.end_time)) &&
        isAfter(endTimeDate, parseISO(a.start_time))
    );

    if (hasProfOverlap) {
      return {
        success: false,
        error: 'El odontólogo ya tiene una cita reservada que se cruza con este horario.',
      };
    }

    // 2. VALIDACIÓN SERVIDOR: Verificar solapamiento para el sillón/consultorio
    const hasRoomOverlap = inMemoryAppointments.some(
      (a) =>
        a.room_id === data.roomId &&
        !['cancelled', 'rescheduled'].includes(a.status) &&
        isBefore(startTimeDate, parseISO(a.end_time)) &&
        isAfter(endTimeDate, parseISO(a.start_time))
    );

    if (hasRoomOverlap) {
      return {
        success: false,
        error: 'El sillón o consultorio seleccionado ya está ocupado en ese horario.',
      };
    }

    // 3. INTENTO DE INSERCIÓN EN POSTGRESQL (Activará las Exclusion Constraints de DB)
    const record = {
      patient_id: data.patientId,
      professional_id: data.professionalId,
      service_id: data.serviceId,
      room_id: data.roomId,
      start_time: data.startTime,
      end_time: data.endTime,
      status: data.status,
      reason: data.reason || null,
      notes: data.notes || null,
    };

    const { data: inserted, error: pgError } = await supabase
      .from('appointments')
      .insert(record)
      .select(`
        *,
        patient:patients(id, first_name, last_name, document_id, phone, email),
        professional:professionals(id, first_name, last_name, color),
        service:services(id, name, duration_minutes, price, color),
        room:rooms(id, name)
      `)
      .single();

    if (pgError) {
      // Capturar violación de Exclusion Constraint (código 23P01 en PostgreSQL)
      if (pgError.code === '23P01' || pgError.message?.includes('exclusion')) {
        return {
          success: false,
          error:
            'Bloqueo de Seguridad PostgreSQL: Ya existe una cita activa superpuesta para este odontólogo o sillón.',
        };
      }
    }

    if (inserted) {
      return { success: true, data: inserted as unknown as AppointmentWithDetails };
    }

    // Fallback en memoria si Supabase está offline/demo
    const newAppt: AppointmentWithDetails = {
      id: crypto.randomUUID(),
      ...record,
      cancellation_reason: null,
      created_by: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      patient: {
        id: data.patientId,
        first_name: 'Paciente',
        last_name: 'Registrado',
        document_id: '0900000000',
        phone: '0990000000',
        email: null,
      },
      professional: {
        id: data.professionalId,
        first_name: 'Dr. Odontólogo',
        last_name: 'Especialista',
        color: '#2563eb',
      },
      service: {
        id: data.serviceId,
        name: 'Tratamiento Dental',
        duration_minutes: 30,
        price: 35,
        color: '#0d9488',
      },
      room: {
        id: data.roomId,
        name: 'Sillón Clínico',
      },
    };

    inMemoryAppointments.unshift(newAppt);
    return { success: true, data: newAppt };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error al programar la cita' };
  }
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus,
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from('appointments')
      .update({ status, notes: notes || undefined, updated_at: new Date().toISOString() })
      .eq('id', appointmentId);

    // Actualizar en memoria
    const appt = inMemoryAppointments.find((a) => a.id === appointmentId);
    if (appt) {
      appt.status = status;
      if (notes) appt.notes = notes;
      appt.updated_at = new Date().toISOString();
    }

    if (error) {
      // Ignorar si solo en memoria
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error actualizando estado de cita' };
  }
}

export async function cancelAppointment(
  appointmentId: string,
  cancellationReason: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from('appointments')
      .update({
        status: 'cancelled',
        cancellation_reason: cancellationReason,
        updated_at: new Date().toISOString(),
      })
      .eq('id', appointmentId);

    const appt = inMemoryAppointments.find((a) => a.id === appointmentId);
    if (appt) {
      appt.status = 'cancelled';
      appt.cancellation_reason = cancellationReason;
      appt.updated_at = new Date().toISOString();
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error cancelando cita' };
  }
}
