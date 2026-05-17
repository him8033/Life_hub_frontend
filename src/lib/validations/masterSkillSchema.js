import { z } from 'zod';

export const masterSkillSchema = z.object({
    name: z
        .string()
        .min(1, 'Skill name is required')
        .max(255, 'Skill name must be less than 255 characters')
        .trim(),

    slug: z
        .string()
        .min(1, 'Slug is required')
        .max(255, 'Slug must be less than 255 characters')
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            'Use lowercase letters, numbers, and hyphens only'
        )
        .trim(),

    category_id: z
        .string()
        .min(1, 'Category is required'),

    icon: z
        .string()
        .max(100, 'Icon must be less than 100 characters')
        .optional()
        .or(z.literal('')),

    description: z
        .string()
        .max(500, 'Description must be less than 500 characters')
        .optional()
        .or(z.literal('')),

    priority: z.coerce
        .number()
        .int()
        .min(0, 'Priority must be 0 or greater')
        .optional(),
});