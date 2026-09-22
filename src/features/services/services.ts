import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Service, Room } from '@/types/app.types';

const defaultServices: Service[] = [
  { id: '33333333-3333-3333-3333-333333333301', name: 'Evaluación y Diagnóstico Inicial', description: 'Examen clínico dental completo y planificación.', duration_minutes: 30, price: 25.0, color: '#0284c7', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '33333333-3333-3333-3333-333333333302', name: 'Limpieza Dental y Profilaxis', description: 'Eliminación de sarro con ultrasonido y flúor.', duration_minutes: 45, price: 40.0, color: '#059669', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '33333333-3333-3333-3333-333333333303', name: 'Restauración Resina Simple', description: 'Obturación estética fotocurada.', duration_minutes: 45, price: 45.0, color: '#2563eb', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '33333333-3333-3333-3333-333333333304', name: 'Control y Ajuste de Ortodoncia', description: 'Revisión periódica de brackets y cambio de arcos.', duration_minutes: 30, price: 35.0, color: '#db2777', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '33333333-3333-3333-3333-333333333305', name: 'Endodoncia Unirradicular', description: 'Tratamiento de conductos en diente anterior.', duration_minutes: 90, price: 130.0, color: '#7c3aed', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '33333333-3333-3333-3333-333333333306', name: 'Extracción Dental Simple', description: 'Exodoncia con anestesia local sin colgajo.', duration_minutes: 45, price: 50.0, color: '#d97706', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '33333333-3333-3333-3333-333333333307', name: 'Blanqueamiento Dental LED', description: 'Sesión clínica de blanqueamiento con lámpara.', duration_minutes: 60, price: 160.0, color: '#0891b2', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const defaultRooms: Room[] = [
  { id: '22222222-2222-2222-2222-222222222201', name: 'Sillón 1 - Principal', description: 'Operatoria general y endodoncia con Rx digital.', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '22222222-2222-2222-2222-222222222202', name: 'Sillón 2 - Ortodoncia y Cirugía', description: 'Quirúrgico y monitor panorámico.', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '22222222-2222-2222-2222-222222222203', name: 'Sillón 3 - Profilaxis y Estética', description: 'Ergonómico para limpiezas y blanqueamiento.', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export async function getServices(): Promise<Service[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from('services').select('*').order('name');
    if (error || !data || data.length === 0) return defaultServices;
    return data as Service[];
  } catch {
    return defaultServices;
  }
}

export async function getRooms(): Promise<Room[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from('rooms').select('*').order('name');
    if (error || !data || data.length === 0) return defaultRooms;
    return data as Room[];
  } catch {
    return defaultRooms;
  }
}
