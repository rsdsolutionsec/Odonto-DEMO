import { Database } from './database.types';

export type UserRole = Database['public']['Tables']['profiles']['Row']['role'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Patient = Database['public']['Tables']['patients']['Row'];
export type Professional = Database['public']['Tables']['professionals']['Row'];
export type Specialty = Database['public']['Tables']['specialties']['Row'];
export type Service = Database['public']['Tables']['services']['Row'];
export type Room = Database['public']['Tables']['rooms']['Row'];
export type ProfessionalSchedule = Database['public']['Tables']['professional_schedules']['Row'];
export type ScheduleBlock = Database['public']['Tables']['schedule_blocks']['Row'];
export type Appointment = Database['public']['Tables']['appointments']['Row'];
export type AppointmentStatus = Database['public']['Tables']['appointments']['Row']['status'];
export type AppointmentStatusHistory = Database['public']['Tables']['appointment_status_history']['Row'];

// Cita enriquecida con relaciones para la Agenda y Listados
export interface AppointmentWithDetails extends Appointment {
  patient: Pick<Patient, 'id' | 'first_name' | 'last_name' | 'document_id' | 'phone' | 'email'>;
  professional: Pick<Professional, 'id' | 'first_name' | 'last_name' | 'color'>;
  service: Pick<Service, 'id' | 'name' | 'duration_minutes' | 'price' | 'color'>;
  room: Pick<Room, 'id' | 'name'>;
}

// Profesional con sus especialidades
export interface ProfessionalWithSpecialties extends Professional {
  specialties: Specialty[];
  schedules?: ProfessionalSchedule[];
}

// Slot de tiempo disponible para agendamiento
export interface TimeSlot {
  startTime: string; // ISO String
  endTime: string;   // ISO String
  available: boolean;
  reasonUnavailable?: string;
}

// Métricas para el Dashboard
export interface DashboardStats {
  todayTotal: number;
  todayPending: number;
  todayConfirmed: number;
  todayCheckedIn: number;
  todayInProgress: number;
  todayCompleted: number;
  todayCancelled: number;
  todayNoShow: number;
  totalActivePatients: number;
}
