import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Professional, Specialty, ProfessionalWithSpecialties } from '@/types/app.types';

const defaultSpecialties: Specialty[] = [
  { id: '11111111-1111-1111-1111-111111111101', name: 'Odontología General', description: 'Atención primaria y limpiezas.', created_at: new Date().toISOString() },
  { id: '11111111-1111-1111-1111-111111111102', name: 'Ortodoncia', description: 'Brackets y alineación.', created_at: new Date().toISOString() },
  { id: '11111111-1111-1111-1111-111111111103', name: 'Endodoncia', description: 'Tratamiento de conductos.', created_at: new Date().toISOString() },
  { id: '11111111-1111-1111-1111-111111111104', name: 'Rehabilitación Oral', description: 'Prótesis y coronas.', created_at: new Date().toISOString() },
  { id: '11111111-1111-1111-1111-111111111105', name: 'Cirugía Maxilofacial', description: 'Extracciones complejas.', created_at: new Date().toISOString() },
];

let inMemoryProfessionals: ProfessionalWithSpecialties[] = [
  {
    id: '44444444-4444-4444-4444-444444444401',
    user_id: null,
    first_name: 'Carlos',
    last_name: 'Mendoza',
    document_id: '0918273645',
    license_number: 'OD-4821',
    phone: '0991234567',
    email: 'dr.mendoza@odonto.com',
    color: '#2563eb',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    specialties: [defaultSpecialties[0], defaultSpecialties[2]],
  },
  {
    id: '44444444-4444-4444-4444-444444444402',
    user_id: null,
    first_name: 'Andrea',
    last_name: 'Suárez',
    document_id: '0927364518',
    license_number: 'OD-5932',
    phone: '0982345678',
    email: 'dra.suarez@odonto.com',
    color: '#db2777',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    specialties: [defaultSpecialties[1]],
  },
  {
    id: '44444444-4444-4444-4444-444444444403',
    user_id: null,
    first_name: 'Roberto',
    last_name: 'Valdivieso',
    document_id: '0936451827',
    license_number: 'OD-6104',
    phone: '0973456789',
    email: 'dr.valdivieso@odonto.com',
    color: '#059669',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    specialties: [defaultSpecialties[3], defaultSpecialties[4]],
  },
];

export async function getSpecialties(): Promise<Specialty[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from('specialties').select('*').order('name');
    if (error || !data || data.length === 0) return defaultSpecialties;
    return data as Specialty[];
  } catch {
    return defaultSpecialties;
  }
}

export async function getProfessionals(): Promise<ProfessionalWithSpecialties[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('professionals')
      .select('*, professional_specialties(specialty:specialties(*))')
      .order('last_name');

    if (error || !data || data.length === 0) {
      return inMemoryProfessionals;
    }

    return data.map((item: any) => ({
      ...item,
      specialties: item.professional_specialties?.map((ps: any) => ps.specialty) || [],
    })) as ProfessionalWithSpecialties[];
  } catch {
    return inMemoryProfessionals;
  }
}

export async function getProfessionalById(id: string): Promise<ProfessionalWithSpecialties | null> {
  const all = await getProfessionals();
  return all.find((p) => p.id === id) || null;
}
