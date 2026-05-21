import { z } from 'zod';

export const masterLanguageSchema = z.object({
    name: z
        .string()
        .min(1, 'Language name is required')
        .max(100, 'Language name must be less than 100 characters')
        .trim(),
    code: z
        .string()
        .max(10, 'Code must be less than 10 characters')
        .optional()
        .or(z.literal('')),
    icon: z
        .string()
        .max(100, 'Icon must be less than 100 characters')
        .optional()
        .or(z.literal('')),
    position: z.coerce
        .number()
        .int()
        .min(0, 'Position must be 0 or greater')
        .optional(),
});