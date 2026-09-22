import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Patient } from '@/types/app.types';
import { PatientFormData } from '@/lib/validations/patient.schema';

export async function getPatients(search?: string, status?: string): Promise<Patient[]> {
  try {
    const supabase = await createServerSupabaseClient();
    let query = supabase.from('patients').select('*').order('created_at', { ascending: false });

    if (status && (status === 'active' || status === 'inactive')) {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,document_id.ilike.%${search}%,phone.ilike.%${search}%`
      );
    }

    const { data, error } = await query;
    if (error || !data) {
      return [];
    }
    return data as Patient[];
  } catch {
    return [];
  }
}

export async function getPatientById(id: string): Promise<Patient | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from('patients').select('*').eq('id', id).single();
    if (error || !data) {
      return null;
    }
    return data as Patient;
  } catch {
    return null;
  }
}

export async function savePatient(formData: PatientFormData, id?: string): Promise<{ success: boolean; data?: Patient; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient();
    const record = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      document_id: formData.documentId,
      birth_date: formData.birthDate,
      gender: formData.gender,
      phone: formData.phone,
      whatsapp: formData.whatsapp || null,
      email: formData.email || null,
      address: formData.address || null,
      emergency_contact_name: formData.emergencyContactName || null,
      emergency_contact_phone: formData.emergencyContactPhone || null,
      status: formData.status,
      notes: formData.notes || null,
    };

    if (id) {
      const { data, error } = await supabase
        .from('patients')
        .update(record)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, data: data as Patient };
    } else {
      const { data, error } = await supabase
        .from('patients')
        .insert(record)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, data: data as Patient };
    }
  } catch (err: any) {
    return { success: false, error: err.message || 'Error guardando paciente' };
  }
}
