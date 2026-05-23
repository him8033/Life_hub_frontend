import { z } from 'zod';

export const resumeTemplateSchema = z.object({
    name: z
        .string()
        .min(1, 'Template name is required')
        .max(255, 'Template name must be less than 255 characters')
        .trim(),

    is_ats_friendly: z.enum(['true', 'false']),

    is_premium: z.enum(['true', 'false']),

    is_active: z.enum(['true', 'false']),
});