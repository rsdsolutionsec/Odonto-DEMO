import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Specialty, ProfessionalWithSpecialties } from '@/types/app.types';
import { ProfessionalFormData } from '@/lib/validations/professional.schema';

export async function getSpecialties(): Promise<Specialty[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from('specialties').select('*').order('name');
    if (error || !data) return [];
    return data as Specialty[];
  } catch {
    return [];
  }
}

export async function getProfessionals(): Promise<ProfessionalWithSpecialties[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('professionals')
      .select('*, professional_specialties(specialty:specialties(*))')
      .order('last_name');

    if (error || !data) {
      return [];
    }

    return data.map((item: any) => ({
      ...item,
      specialties: item.professional_specialties?.map((ps: any) => ps.specialty) || [],
    })) as ProfessionalWithSpecialties[];
  } catch {
    return [];
  }
}

export async function getProfessionalById(id: string): Promise<ProfessionalWithSpecialties | null> {
  const all = await getProfessionals();
  return all.find((p) => p.id === id) || null;
}

export async function saveProfessional(
  formData: ProfessionalFormData,
  id?: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient();
    const record = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      document_id: formData.documentId,
      license_number: formData.licenseNumber,
      phone: formData.phone,
      email: formData.email,
      color: formData.color,
      is_active: formData.isActive,
    };

    let professionalId = id;

    if (id) {
      const { error: profError } = await supabase
        .from('professionals')
        .update(record)
        .eq('id', id);

      if (profError) {
        return { success: false, error: profError.message };
      }

      // Eliminar especialidades previas
      await supabase
        .from('professional_specialties')
        .delete()
        .eq('professional_id', id);
    } else {
      const { data: newProf, error: profError } = await supabase
        .from('professionals')
        .insert(record)
        .select()
        .single();

      if (profError || !newProf) {
        return { success: false, error: profError?.message || 'Error al crear profesional' };
      }
      professionalId = newProf.id;

      // Crear horarios estándar de Lunes a Viernes (días 1 a 5) de 08:30 a 17:30
      const defaultSchedules = [1, 2, 3, 4, 5].map((day) => ({
        professional_id: professionalId,
        day_of_week: day,
        start_time: '08:30:00',
        end_time: '17:30:00',
        is_active: true,
      }));
      await supabase.from('professional_schedules').insert(defaultSchedules);
    }

    // Insertar nuevas relaciones con especialidades
    if (formData.specialtyIds && formData.specialtyIds.length > 0 && professionalId) {
      const specRecords = formData.specialtyIds.map((specId) => ({
        professional_id: professionalId,
        specialty_id: specId,
      }));
      await supabase.from('professional_specialties').insert(specRecords);
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error guardando profesional' };
  }
}
