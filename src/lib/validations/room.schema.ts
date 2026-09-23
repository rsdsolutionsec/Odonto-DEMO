import { z } from 'zod';

export const roomSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre del consultorio o sillón debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim(),
  description: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional()
    .or(z.literal('')),
  isActive: z.boolean().default(true),
});

export type RoomFormData = z.infer<typeof roomSchema>;
