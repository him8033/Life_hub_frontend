import { z } from 'zod';

export const skillCategorySchema = z.object({
    name: z
        .string()
        .min(1, 'Category name is required')
        .max(100, 'Category name must be less than 100 characters')
        .trim(),

    slug: z
        .string()
        .min(1, 'Slug is required')
        .max(100, 'Slug must be less than 100 characters')
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            'Use lowercase letters, numbers, and hyphens only'
        )
        .trim(),

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

    is_active: z
        .enum(['true', 'false'])
        .transform((val) => val === 'true'),
});