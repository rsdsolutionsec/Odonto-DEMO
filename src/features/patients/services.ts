import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Patient } from '@/types/app.types';
import { PatientFormData } from '@/lib/validations/patient.schema';

// Datos de fallback cuando la base de datos Supabase aún no tiene credenciales en .env.local
let inMemoryPatients: Patient[] = [
  {
    id: '55555555-5555-5555-5555-555555555501',
    first_name: 'Juan',
    last_name: 'Pérez Morales',
    document_id: '0919283746',
    birth_date: '1988-04-15',
    gender: 'male',
    phone: '0981112233',
    whatsapp: '0981112233',
    email: 'juan.perez@example.com',
    address: 'Av. 9 de Octubre y Pichincha',
    emergency_contact_name: 'Carmen Morales (Madre)',
    emergency_contact_phone: '0994445566',
    status: 'active',
    notes: 'Sensibilidad dental en cuadrante inferior izquierdo.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '55555555-5555-5555-5555-555555555502',
    first_name: 'María',
    last_name: 'Fernández Loor',
    document_id: '0928374655',
    birth_date: '1995-11-23',
    gender: 'female',
    phone: '0972223344',
    whatsapp: '0972223344',
    email: 'maria.fernandez@example.com',
    address: 'Urdesa Central, Calle 3ra #204',
    emergency_contact_name: 'Jorge Fernández (Hermano)',
    emergency_contact_phone: '0985556677',
    status: 'active',
    notes: 'Paciente en tratamiento ortodóncico activo.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '55555555-5555-5555-5555-555555555503',
    first_name: 'Carlos',
    last_name: 'Ruiz Zambrano',
    document_id: '0937465564',
    birth_date: '1982-08-09',
    gender: 'male',
    phone: '0963334455',
    whatsapp: '0963334455',
    email: 'carlos.ruiz@example.com',
    address: 'Ceibos, Mz 14 Villa 8',
    emergency_contact_name: 'Patricia Zambrano (Esposa)',
    emergency_contact_phone: '0996667788',
    status: 'active',
    notes: 'Alergia leve a la penicilina reportada.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '55555555-5555-5555-5555-555555555504',
    first_name: 'Sofía',
    last_name: 'Montero Vélez',
    document_id: '0946556473',
    birth_date: '2001-02-18',
    gender: 'female',
    phone: '0954445566',
    whatsapp: '0954445566',
    email: 'sofia.montero@example.com',
    address: 'Samborondón Km 2.5',
    emergency_contact_name: 'Elena Vélez (Madre)',
    emergency_contact_phone: '0977778899',
    status: 'active',
    notes: 'Interés en blanqueamiento dental y estética.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

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
    if (error || !data || data.length === 0) {
      // Usar lista en memoria si Supabase no está conectado
      let filtered = [...inMemoryPatients];
      if (status) filtered = filtered.filter((p) => p.status === status);
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.first_name.toLowerCase().includes(s) ||
            p.last_name.toLowerCase().includes(s) ||
            p.document_id.includes(s) ||
            p.phone.includes(s)
        );
      }
      return filtered;
    }
    return data as Patient[];
  } catch {
    return inMemoryPatients;
  }
}

export async function getPatientById(id: string): Promise<Patient | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from('patients').select('*').eq('id', id).single();
    if (error || !data) {
      return inMemoryPatients.find((p) => p.id === id) || null;
    }
    return data as Patient;
  } catch {
    return inMemoryPatients.find((p) => p.id === id) || null;
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
        // En memoria si Supabase no está activo
        const idx = inMemoryPatients.findIndex((p) => p.id === id);
        if (idx !== -1) {
          inMemoryPatients[idx] = { ...inMemoryPatients[idx], ...record, updated_at: new Date().toISOString() };
          return { success: true, data: inMemoryPatients[idx] };
        }
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
        const newPatient: Patient = {
          id: crypto.randomUUID(),
          ...record,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        inMemoryPatients.unshift(newPatient);
        return { success: true, data: newPatient };
      }
      return { success: true, data: data as Patient };
    }
  } catch (err: any) {
    return { success: false, error: err.message || 'Error guardando paciente' };
  }
}
