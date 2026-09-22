import { z } from 'zod';

export const professionalSchema = z.object({
  firstName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim(),
  lastName: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100, 'El apellido no puede exceder 100 caracteres')
    .trim(),
  documentId: z
    .string()
    .min(5, 'La identificación debe tener al menos 5 caracteres')
    .max(20, 'La identificación no puede exceder 20 caracteres')
    .trim(),
  licenseNumber: z
    .string()
    .min(3, 'El número de colegiatura debe tener al menos 3 caracteres')
    .max(50, 'El número de colegiatura no puede exceder 50 caracteres')
    .trim(),
  phone: z
    .string()
    .min(7, 'El teléfono debe tener al menos 7 dígitos')
    .max(20, 'El teléfono no puede exceder 20 dígitos')
    .trim(),
  email: z.string().email('Correo electrónico no válido').trim(),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Color hexadecimal inválido')
    .default('#2563eb'),
  specialtyIds: z.array(z.string().uuid()).min(1, 'Seleccione al menos una especialidad'),
  isActive: z.boolean().default(true),
});

export const scheduleSchema = z.object({
  professionalId: z.string().uuid(),
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, 'Formato de hora HH:MM'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, 'Formato de hora HH:MM'),
  isActive: z.boolean().default(true),
}).refine((data) => data.endTime > data.startTime, {
  message: 'La hora de fin debe ser posterior a la de inicio',
  path: ['endTime'],
});

export type ProfessionalFormData = z.infer<typeof professionalSchema>;
export type ScheduleFormData = z.infer<typeof scheduleSchema>;
