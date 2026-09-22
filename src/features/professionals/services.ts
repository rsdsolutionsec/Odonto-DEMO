import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Specialty, ProfessionalWithSpecialties } from '@/types/app.types';

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
