import { z } from 'zod';

export const portfolioThemeSchema = z.object({
    name: z
        .string()
        .min(1, 'Theme name is required')
        .max(255, 'Theme name must be less than 255 characters')
        .trim(),
    key: z
        .string()
        .max(100, 'Key must be less than 100 characters')
        .optional()
        .or(z.literal('')),
    description: z
        .string()
        .max(500, 'Description must be less than 500 characters')
        .optional()
        .or(z.literal('')),
    is_premium: z.enum(['true', 'false']),
    is_active: z.enum(['true', 'false']),
});