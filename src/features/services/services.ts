import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Service, Room } from '@/types/app.types';
import { ServiceFormData } from '@/lib/validations/service.schema';
import { RoomFormData } from '@/lib/validations/room.schema';

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

export async function getServiceById(id: string): Promise<Service | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from('services').select('*').eq('id', id).single();
    if (error || !data) return null;
    return data as Service;
  } catch {
    return null;
  }
}

export async function saveService(
  formData: ServiceFormData,
  id?: string
): Promise<{ success: boolean; data?: Service; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient();
    const record = {
      name: formData.name,
      description: formData.description || null,
      duration_minutes: formData.durationMinutes,
      price: formData.price,
      color: formData.color,
      is_active: formData.isActive,
    };

    if (id) {
      const { data, error } = await supabase
        .from('services')
        .update(record)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, data: data as Service };
    } else {
      const { data, error } = await supabase
        .from('services')
        .insert(record)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, data: data as Service };
    }
  } catch (err: any) {
    return { success: false, error: err.message || 'Error guardando servicio' };
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

export async function getRoomById(id: string): Promise<Room | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from('rooms').select('*').eq('id', id).single();
    if (error || !data) return null;
    return data as Room;
  } catch {
    return null;
  }
}

export async function saveRoom(
  formData: RoomFormData,
  id?: string
): Promise<{ success: boolean; data?: Room; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient();
    const record = {
      name: formData.name,
      description: formData.description || null,
      is_active: formData.isActive,
    };

    if (id) {
      const { data, error } = await supabase
        .from('rooms')
        .update(record)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, data: data as Room };
    } else {
      const { data, error } = await supabase
        .from('rooms')
        .insert(record)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, data: data as Room };
    }
  } catch (err: any) {
    return { success: false, error: err.message || 'Error guardando consultorio' };
  }
}
