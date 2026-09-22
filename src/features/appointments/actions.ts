'use server';

import { revalidatePath } from 'next/cache';
import {
  appointmentSchema,
  cancelAppointmentSchema,
  updateAppointmentStatusSchema,
} from '@/lib/validations/appointment.schema';
import {
  createAppointment,
  updateAppointmentStatus,
  cancelAppointment,
} from './services';
import { calculateAvailableSlots } from '@/lib/scheduling/availability';

export async function createAppointmentAction(rawData: unknown) {
  const result = appointmentSchema.safeParse(rawData);
  if (!result.success) {
    return {
      success: false,
      error: 'Por favor complete todos los campos obligatorios correctamente.',
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const res = await createAppointment(result.data);
  if (res.success) {
    revalidatePath('/agenda');
    revalidatePath('/citas');
    revalidatePath('/');
  }
  return res;
}

export async function updateAppointmentStatusAction(rawData: unknown) {
  const result = updateAppointmentStatusSchema.safeParse(rawData);
  if (!result.success) {
    return { success: false, error: 'Datos de estado no válidos' };
  }

  const res = await updateAppointmentStatus(
    result.data.appointmentId,
    result.data.status,
    result.data.notes
  );

  if (res.success) {
    revalidatePath('/agenda');
    revalidatePath('/citas');
    revalidatePath('/');
  }
  return res;
}

export async function cancelAppointmentAction(rawData: unknown) {
  const result = cancelAppointmentSchema.safeParse(rawData);
  if (!result.success) {
    return { success: false, error: 'Debe ingresar un motivo de cancelación' };
  }

  const res = await cancelAppointment(
    result.data.appointmentId,
    result.data.cancellationReason
  );

  if (res.success) {
    revalidatePath('/agenda');
    revalidatePath('/citas');
    revalidatePath('/');
  }
  return res;
}

export async function getAvailabilitySlotsAction(params: {
  professionalId: string;
  serviceId: string;
  date: string;
  roomId?: string;
}) {
  return await calculateAvailableSlots(params);
}
