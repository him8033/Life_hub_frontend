import { z } from 'zod';

export const socialLinkSchema = z.object({
    platform_name: z
        .string()
        .min(1, 'Platform is required')
        .max(100, 'Platform name must be less than 100 characters'),
    url: z
        .string()
        .min(1, 'URL is required')
        .url('Please enter a valid URL')
        .max(500, 'URL must be less than 500 characters'),
});