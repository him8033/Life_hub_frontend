import { z } from 'zod';

export const socialLinkSchema = z.object({
    platform_name: z
        .string()
        .min(1, 'Platform name is required')
        .max(100, 'Platform name must be less than 100 characters'),
    url: z
        .string()
        .min(1, 'URL is required')
        .url('Please enter a valid URL'),
    icon: z
        .string()
        .max(100, 'Icon must be less than 100 characters')
        .optional()
        .or(z.literal('')),
    is_primary: z.enum(['true', 'false']),
    is_active: z.enum(['true', 'false']),
});