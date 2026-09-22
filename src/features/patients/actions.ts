'use server';

import { revalidatePath } from 'next/cache';
import { patientSchema, PatientFormData } from '@/lib/validations/patient.schema';
import { savePatient } from './services';

export async function createPatientAction(rawData: unknown) {
  const result = patientSchema.safeParse(rawData);
  if (!result.success) {
    return {
      success: false,
      error: 'Datos inválidos',
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const res = await savePatient(result.data);
  if (res.success) {
    revalidatePath('/pacientes');
    revalidatePath('/agenda');
  }
  return res;
}

export async function updatePatientAction(id: string, rawData: unknown) {
  const result = patientSchema.safeParse(rawData);
  if (!result.success) {
    return {
      success: false,
      error: 'Datos inválidos',
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const res = await savePatient(result.data, id);
  if (res.success) {
    revalidatePath('/pacientes');
    revalidatePath(`/pacientes/${id}`);
    revalidatePath('/agenda');
  }
  return res;
}
