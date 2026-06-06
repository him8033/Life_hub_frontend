import { z } from 'zod';

export const snapshotSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(200, 'Title must be less than 200 characters')
        .trim(),
    target_role: z
        .string()
        .max(200, 'Target role must be less than 200 characters')
        .optional()
        .or(z.literal('')),
    description: z
        .string()
        .max(500, 'Description must be less than 500 characters')
        .optional()
        .or(z.literal('')),
    visibility: z.enum(['private', 'public']).optional(),
});