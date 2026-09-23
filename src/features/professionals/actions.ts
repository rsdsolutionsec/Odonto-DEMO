'use server';

import { revalidatePath } from 'next/cache';
import { professionalSchema } from '@/lib/validations/professional.schema';
import { saveProfessional } from './services';

export async function createProfessionalAction(rawData: unknown) {
  const result = professionalSchema.safeParse(rawData);
  if (!result.success) {
    return {
      success: false,
      error: 'Datos del odontólogo no válidos',
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const res = await saveProfessional(result.data);
  if (res.success) {
    revalidatePath('/profesionales');
    revalidatePath('/agenda');
    revalidatePath('/citas');
    revalidatePath('/');
  }
  return res;
}

export async function updateProfessionalAction(id: string, rawData: unknown) {
  const result = professionalSchema.safeParse(rawData);
  if (!result.success) {
    return {
      success: false,
      error: 'Datos del odontólogo no válidos',
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const res = await saveProfessional(result.data, id);
  if (res.success) {
    revalidatePath('/profesionales');
    revalidatePath('/agenda');
    revalidatePath('/citas');
    revalidatePath('/');
  }
  return res;
}
