import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Service, Room } from '@/types/app.types';

export async function getServices(): Promise<Service[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from('services').select('*').order('name');
    if (error || !data) return [];
    return data as Service[];
  } catch {
    return [];
  }
}

export async function getRooms(): Promise<Room[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from('rooms').select('*').order('name');
    if (error || !data) return [];
    return data as Room[];
  } catch {
    return [];
  }
}
