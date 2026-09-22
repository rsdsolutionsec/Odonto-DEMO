import { createServerSupabaseClient } from '@/lib/supabase/server';
import { AppointmentWithDetails, AppointmentStatus, Appointment } from '@/types/app.types';
import { AppointmentFormData } from '@/lib/validations/appointment.schema';

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
    if (error || !data) {
      return [];
    }

    return data as unknown as AppointmentWithDetails[];
  } catch {
    return [];
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

    // INTENTO DE INSERCIÓN EN POSTGRESQL (Activará las Exclusion Constraints de DB)
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
            'Bloqueo de Seguridad PostgreSQL: Ya existe una cita activa superpuesta para este odontólogo o sillón en este horario.',
        };
      }
      return { success: false, error: pgError.message };
    }

    if (inserted) {
      return { success: true, data: inserted as unknown as AppointmentWithDetails };
    }

    return { success: false, error: 'No se pudo crear la cita.' };
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

    if (error) {
      return { success: false, error: error.message };
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

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error cancelando cita' };
  }
}
