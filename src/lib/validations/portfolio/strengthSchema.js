import { z } from 'zod';

export const strengthSchema = z.object({
    title: z
        .string()
        .min(1, 'Strength title is required')
        .max(255, 'Title must be less than 255 characters')
        .trim(),
});