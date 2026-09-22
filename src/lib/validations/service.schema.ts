import { z } from 'zod';

export const serviceSchema = z.object({
  name: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(120, 'El nombre no puede exceder 120 caracteres')
    .trim(),
  description: z.string().max(500, 'La descripción no puede exceder 500 caracteres').optional().or(z.literal('')),
  durationMinutes: z
    .number({ invalid_type_error: 'La duración debe ser un número entero' })
    .int('La duración debe ser en minutos enteros')
    .min(10, 'La duración mínima es de 10 minutos')
    .max(480, 'La duración máxima es de 480 minutos (8 horas)'),
  price: z
    .number({ invalid_type_error: 'El precio debe ser un número' })
    .min(0, 'El precio no puede ser negativo'),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Color hexadecimal inválido')
    .default('#0d9488'),
  isActive: z.boolean().default(true),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;
