'use server';

import { revalidatePath } from 'next/cache';
import { serviceSchema } from '@/lib/validations/service.schema';
import { roomSchema } from '@/lib/validations/room.schema';
import { saveService, saveRoom } from './services';

// Server Actions para Servicios
export async function createServiceAction(rawData: unknown) {
  const result = serviceSchema.safeParse(rawData);
  if (!result.success) {
    return {
      success: false,
      error: 'Datos de servicio no válidos',
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const res = await saveService(result.data);
  if (res.success) {
    revalidatePath('/servicios');
    revalidatePath('/agenda');
    revalidatePath('/citas');
  }
  return res;
}

export async function updateServiceAction(id: string, rawData: unknown) {
  const result = serviceSchema.safeParse(rawData);
  if (!result.success) {
    return {
      success: false,
      error: 'Datos de servicio no válidos',
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const res = await saveService(result.data, id);
  if (res.success) {
    revalidatePath('/servicios');
    revalidatePath('/agenda');
    revalidatePath('/citas');
  }
  return res;
}

// Server Actions para Consultorios (Rooms)
export async function createRoomAction(rawData: unknown) {
  const result = roomSchema.safeParse(rawData);
  if (!result.success) {
    return {
      success: false,
      error: 'Datos del consultorio no válidos',
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const res = await saveRoom(result.data);
  if (res.success) {
    revalidatePath('/consultorios');
    revalidatePath('/agenda');
    revalidatePath('/citas');
  }
  return res;
}

export async function updateRoomAction(id: string, rawData: unknown) {
  const result = roomSchema.safeParse(rawData);
  if (!result.success) {
    return {
      success: false,
      error: 'Datos del consultorio no válidos',
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const res = await saveRoom(result.data, id);
  if (res.success) {
    revalidatePath('/consultorios');
    revalidatePath('/agenda');
    revalidatePath('/citas');
  }
  return res;
}
