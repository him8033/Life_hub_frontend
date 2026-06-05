import { z } from 'zod';

export const achievementSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(255, 'Title must be less than 255 characters')
        .trim(),
    description: z
        .string()
        .max(500, 'Description must be less than 500 characters')
        .optional()
        .or(z.literal('')),
});