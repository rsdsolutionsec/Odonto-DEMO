import { z } from 'zod';

export const appointmentSchema = z.object({
  patientId: z.string().uuid('Seleccione un paciente válido'),
  professionalId: z.string().uuid('Seleccione un odontólogo válido'),
  serviceId: z.string().uuid('Seleccione un tratamiento o servicio válido'),
  roomId: z.string().uuid('Seleccione un consultorio o sillón válido'),
  startTime: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), 'Fecha y hora de inicio no válida'),
  endTime: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), 'Fecha y hora de finalización no válida'),
  status: z
    .enum([
      'pending',
      'confirmed',
      'checked_in',
      'in_progress',
      'completed',
      'cancelled',
      'no_show',
      'rescheduled',
    ])
    .default('pending'),
  reason: z.string().max(500, 'El motivo no puede exceder 500 caracteres').optional().or(z.literal('')),
  notes: z.string().max(1000, 'Las notas no pueden exceder 1000 caracteres').optional().or(z.literal('')),
}).refine((data) => new Date(data.endTime) > new Date(data.startTime), {
  message: 'La hora de finalización debe ser posterior a la hora de inicio',
  path: ['endTime'],
});

export const cancelAppointmentSchema = z.object({
  appointmentId: z.string().uuid('ID de cita inválido'),
  cancellationReason: z.string().min(3, 'Indique el motivo de la cancelación').max(500),
});

export const updateAppointmentStatusSchema = z.object({
  appointmentId: z.string().uuid('ID de cita inválido'),
  status: z.enum([
    'pending',
    'confirmed',
    'checked_in',
    'in_progress',
    'completed',
    'cancelled',
    'no_show',
    'rescheduled',
  ]),
  notes: z.string().max(500).optional(),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;
export type CancelAppointmentData = z.infer<typeof cancelAppointmentSchema>;
export type UpdateAppointmentStatusData = z.infer<typeof updateAppointmentStatusSchema>;
