import { z } from 'zod';

export const patientSchema = z.object({
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
    .min(5, 'La identificación o cédula debe tener al menos 5 dígitos')
    .max(20, 'La identificación no puede exceder 20 caracteres')
    .regex(/^[a-zA-Z0-9-]+$/, 'Formato de identificación no válido')
    .trim(),
  birthDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), 'Fecha de nacimiento no válida')
    .refine((val) => new Date(val) <= new Date(), 'La fecha de nacimiento no puede ser futura'),
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: 'Seleccione un sexo válido' }),
  }),
  phone: z
    .string()
    .min(7, 'El teléfono debe tener al menos 7 dígitos')
    .max(20, 'El teléfono no puede exceder 20 caracteres')
    .trim(),
  whatsapp: z.string().max(20).optional().or(z.literal('')),
  email: z.string().email('Correo electrónico no válido').optional().or(z.literal('')),
  address: z.string().max(250, 'La dirección no puede exceder 250 caracteres').optional().or(z.literal('')),
  emergencyContactName: z.string().max(100).optional().or(z.literal('')),
  emergencyContactPhone: z.string().max(20).optional().or(z.literal('')),
  status: z.enum(['active', 'inactive']).default('active'),
  notes: z.string().max(1000, 'Las notas no pueden exceder 1000 caracteres').optional().or(z.literal('')),
});

export type PatientFormData = z.infer<typeof patientSchema>;
