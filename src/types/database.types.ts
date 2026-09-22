export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'admin' | 'receptionist' | 'dentist';
export type PatientStatus = 'active' | 'inactive';
export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'checked_in'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'rescheduled';

export type ReminderChannel = 'whatsapp' | 'email' | 'sms';
export type ReminderStatus = 'pending' | 'sent' | 'failed' | 'cancelled';
export type GenderType = 'male' | 'female' | 'other';

export type Relationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          first_name: string;
          last_name: string;
          email: string;
          phone: string | null;
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          first_name: string;
          last_name: string;
          email: string;
          phone?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: Relationship[];
      };
      specialties: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
        };
        Relationships: Relationship[];
      };
      professionals: {
        Row: {
          id: string;
          user_id: string | null;
          first_name: string;
          last_name: string;
          document_id: string;
          license_number: string;
          phone: string;
          email: string;
          color: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          first_name: string;
          last_name: string;
          document_id: string;
          license_number: string;
          phone: string;
          email: string;
          color?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          first_name?: string;
          last_name?: string;
          document_id?: string;
          license_number?: string;
          phone?: string;
          email?: string;
          color?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: Relationship[];
      };
      professional_specialties: {
        Row: {
          professional_id: string;
          specialty_id: string;
          created_at: string;
        };
        Insert: {
          professional_id: string;
          specialty_id: string;
          created_at?: string;
        };
        Update: {
          professional_id?: string;
          specialty_id?: string;
          created_at?: string;
        };
        Relationships: Relationship[];
      };
      patients: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          document_id: string;
          birth_date: string;
          gender: GenderType;
          phone: string;
          whatsapp: string | null;
          email: string | null;
          address: string | null;
          emergency_contact_name: string | null;
          emergency_contact_phone: string | null;
          status: PatientStatus;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name: string;
          document_id: string;
          birth_date: string;
          gender: GenderType;
          phone: string;
          whatsapp?: string | null;
          email?: string | null;
          address?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          status?: PatientStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          document_id?: string;
          birth_date?: string;
          gender?: GenderType;
          phone?: string;
          whatsapp?: string | null;
          email?: string | null;
          address?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          status?: PatientStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: Relationship[];
      };
      services: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          duration_minutes: number;
          price: number;
          color: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          duration_minutes: number;
          price?: number;
          color?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          duration_minutes?: number;
          price?: number;
          color?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: Relationship[];
      };
      rooms: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: Relationship[];
      };
      professional_schedules: {
        Row: {
          id: string;
          professional_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          professional_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          professional_id?: string;
          day_of_week?: number;
          start_time?: string;
          end_time?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: Relationship[];
      };
      schedule_blocks: {
        Row: {
          id: string;
          professional_id: string | null;
          room_id: string | null;
          title: string;
          reason: string | null;
          start_time: string;
          end_time: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          professional_id?: string | null;
          room_id?: string | null;
          title: string;
          reason?: string | null;
          start_time: string;
          end_time: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          professional_id?: string | null;
          room_id?: string | null;
          title?: string;
          reason?: string | null;
          start_time?: string;
          end_time?: string;
          created_at?: string;
        };
        Relationships: Relationship[];
      };
      appointments: {
        Row: {
          id: string;
          patient_id: string;
          professional_id: string;
          service_id: string;
          room_id: string;
          start_time: string;
          end_time: string;
          status: AppointmentStatus;
          reason: string | null;
          notes: string | null;
          cancellation_reason: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          professional_id: string;
          service_id: string;
          room_id: string;
          start_time: string;
          end_time: string;
          status?: AppointmentStatus;
          reason?: string | null;
          notes?: string | null;
          cancellation_reason?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          patient_id?: string;
          professional_id?: string;
          service_id?: string;
          room_id?: string;
          start_time?: string;
          end_time?: string;
          status?: AppointmentStatus;
          reason?: string | null;
          notes?: string | null;
          cancellation_reason?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: Relationship[];
      };
      appointment_status_history: {
        Row: {
          id: string;
          appointment_id: string;
          previous_status: AppointmentStatus | null;
          new_status: AppointmentStatus;
          changed_by: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          appointment_id: string;
          previous_status?: AppointmentStatus | null;
          new_status: AppointmentStatus;
          changed_by?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          appointment_id?: string;
          previous_status?: AppointmentStatus | null;
          new_status?: AppointmentStatus;
          changed_by?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: Relationship[];
      };
      appointment_reminders: {
        Row: {
          id: string;
          appointment_id: string;
          reminder_type: string;
          channel: ReminderChannel;
          scheduled_for: string;
          sent_at: string | null;
          status: ReminderStatus;
          response_payload: Json | null;
          error_message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          appointment_id: string;
          reminder_type?: string;
          channel?: ReminderChannel;
          scheduled_for: string;
          sent_at?: string | null;
          status?: ReminderStatus;
          response_payload?: Json | null;
          error_message?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          appointment_id?: string;
          reminder_type?: string;
          channel?: ReminderChannel;
          scheduled_for?: string;
          sent_at?: string | null;
          status?: ReminderStatus;
          response_payload?: Json | null;
          error_message?: string | null;
          created_at?: string;
        };
        Relationships: Relationship[];
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          entity: string;
          entity_id: string;
          old_data: Json | null;
          new_data: Json | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          entity: string;
          entity_id: string;
          old_data?: Json | null;
          new_data?: Json | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          entity?: string;
          entity_id?: string;
          old_data?: Json | null;
          new_data?: Json | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Relationships: Relationship[];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
      patient_status: PatientStatus;
      appointment_status: AppointmentStatus;
      reminder_channel: ReminderChannel;
      reminder_status: ReminderStatus;
      gender_type: GenderType;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
