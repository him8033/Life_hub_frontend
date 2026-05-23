import { z } from 'zod';

export const portfolioThemeSchema = z.object({
    name: z
        .string()
        .min(1, 'Theme name is required')
        .max(255, 'Theme name must be less than 255 characters')
        .trim(),

    is_premium: z.enum(['true', 'false']),

    is_active: z.enum(['true', 'false']),
});