// src/lib/validations/portfolio/sections/socialLinkSchema.js

import { z } from 'zod';

export const socialLinkSchema = z.object({
    platform_name: z
        .string()
        .min(1, 'Platform is required')
        .max(100, 'Platform name must be less than 100 characters')
        .trim(),
    custom_platform_name: z
        .string()
        .max(100, 'Custom platform name must be less than 100 characters')
        .optional()
        .transform((val) => val?.trim() || ''),
    url: z
        .string()
        .min(1, 'URL is required')
        .url('Please enter a valid URL')
        .max(500, 'URL must be less than 500 characters')
        .trim()
        .transform((val) => {
            if (val && !val.startsWith('http://') && !val.startsWith('https://')) {
                return `https://${val}`;
            }
            return val;
        }),
}).refine(
    (data) => {
        // If platform_name is "Other", custom_platform_name is required
        if (data.platform_name === 'Other' && !data.custom_platform_name) {
            return false;
        }
        return true;
    },
    {
        message: 'Please enter a custom platform name',
        path: ['custom_platform_name'],
    }
);