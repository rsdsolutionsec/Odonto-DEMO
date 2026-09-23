import { createServerSupabaseClient } from '@/lib/supabase/server';
import { parseISO, addMinutes, isBefore, isAfter, isValid } from 'date-fns';
import { TimeSlot } from '@/types/app.types';

export interface AvailabilityParams {
  professionalId: string;
  serviceId: string;
  date: string; // Formato YYYY-MM-DD
  roomId?: string;
}

export async function calculateAvailableSlots({
  professionalId,
  serviceId,
  date,
  roomId,
}: AvailabilityParams): Promise<{ slots: TimeSlot[]; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient();

    // 1. Obtener duración del servicio
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('id, duration_minutes, is_active')
      .eq('id', serviceId)
      .single();

    if (serviceError || !service) {
      return { slots: [], error: 'Servicio no encontrado o inactivo' };
    }

    const durationMinutes = service.duration_minutes;

    // 2. Determinar día de la semana (0: Domingo, 1: Lunes, ... 6: Sábado) usando fecha local
    const [year, month, day] = date.split('-').map(Number);
    const targetDate = new Date(year, month - 1, day);
    if (!isValid(targetDate)) {
      return { slots: [], error: 'Fecha no válida' };
    }
    const dayOfWeek = targetDate.getDay();

    // 3. Obtener el horario laboral del profesional para este día
    const { data: schedules, error: scheduleError } = await supabase
      .from('professional_schedules')
      .select('start_time, end_time')
      .eq('professional_id', professionalId)
      .eq('day_of_week', dayOfWeek)
      .eq('is_active', true);

    if (scheduleError || !schedules || schedules.length === 0) {
      // El profesional no atiende este día
      return { slots: [] };
    }

    // 4. Obtener citas existentes en esa fecha (considerando la zona horaria clínica Ecuador UTC-5)
    const startOfDay = new Date(`${date}T00:00:00-05:00`).toISOString();
    const endOfDay = new Date(`${date}T23:59:59-05:00`).toISOString();

    const { data: appointments, error: apptError } = await supabase
      .from('appointments')
      .select('id, start_time, end_time, professional_id, room_id, status')
      .not('status', 'in', '("cancelled","rescheduled")')
      .or(`professional_id.eq.${professionalId}${roomId ? `,room_id.eq.${roomId}` : ''}`)
      .gte('start_time', startOfDay)
      .lte('start_time', endOfDay);

    if (apptError) {
      console.error('Error fetching appointments for availability:', apptError);
    }

    // 5. Obtener bloqueos de agenda (vacaciones, ausencias, mantenimiento)
    const { data: blocks } = await supabase
      .from('schedule_blocks')
      .select('start_time, end_time, professional_id, room_id')
      .or(`professional_id.eq.${professionalId},room_id.eq.${roomId || '00000000-0000-0000-0000-000000000000'}`)
      .gte('start_time', startOfDay)
      .lte('start_time', endOfDay);

    const generatedSlots: TimeSlot[] = [];
    const slotInterval = 15; // Intervalo de búsqueda cada 15 minutos

    // Recorrer cada turno laboral del profesional
    for (const schedule of schedules) {
      // Usar zona horaria clínica de Ecuador (-05:00) para garantizar consistencia absoluta
      const cleanStartTime = schedule.start_time.length === 5 ? `${schedule.start_time}:00` : schedule.start_time;
      const cleanEndTime = schedule.end_time.length === 5 ? `${schedule.end_time}:00` : schedule.end_time;

      const shiftStart = new Date(`${date}T${cleanStartTime}-05:00`);
      const shiftEnd = new Date(`${date}T${cleanEndTime}-05:00`);

      let currentSlotStart = shiftStart;

      while (true) {
        const currentSlotEnd = addMinutes(currentSlotStart, durationMinutes);

        // Si el final de la cita excede la jornada de trabajo, termina este turno
        if (isAfter(currentSlotEnd, shiftEnd)) {
          break;
        }

        const slotStartISO = currentSlotStart.toISOString();
        const slotEndISO = currentSlotEnd.toISOString();

        // Verificar colisión con citas del profesional
        const profCollision = (appointments || []).some((appt) => {
          if (appt.professional_id !== professionalId) return false;
          const aStart = parseISO(appt.start_time);
          const aEnd = parseISO(appt.end_time);
          return isBefore(currentSlotStart, aEnd) && isAfter(currentSlotEnd, aStart);
        });

        // Verificar colisión con el consultorio/sillón si está definido
        const roomCollision = roomId
          ? (appointments || []).some((appt) => {
              if (appt.room_id !== roomId) return false;
              const aStart = parseISO(appt.start_time);
              const aEnd = parseISO(appt.end_time);
              return isBefore(currentSlotStart, aEnd) && isAfter(currentSlotEnd, aStart);
            })
          : false;

        // Verificar colisión con bloqueos
        const blockCollision = (blocks || []).some((block) => {
          const bStart = parseISO(block.start_time);
          const bEnd = parseISO(block.end_time);
          return isBefore(currentSlotStart, bEnd) && isAfter(currentSlotEnd, bStart);
        });

        const isAvailable = !profCollision && !roomCollision && !blockCollision;

        let reasonUnavailable: string | undefined;
        if (profCollision) reasonUnavailable = 'Odontólogo ocupado en otra cita';
        else if (roomCollision) reasonUnavailable = 'Sillón ocupado en esa hora';
        else if (blockCollision) reasonUnavailable = 'Horario bloqueado';

        generatedSlots.push({
          startTime: slotStartISO,
          endTime: slotEndISO,
          available: isAvailable,
          reasonUnavailable,
        });

        // Avanzar el siguiente slot
        currentSlotStart = addMinutes(currentSlotStart, slotInterval);
      }
    }

    return { slots: generatedSlots };
  } catch (err: any) {
    console.error('Error calculando disponibilidad:', err);
    return { slots: [], error: err.message || 'Error en cálculo de disponibilidad' };
  }
}
