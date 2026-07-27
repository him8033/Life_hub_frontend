import { z } from 'zod';

export const basicInfoSchema = z.object({
    first_name: z
        .string()
        .min(1, 'First name is required')
        .max(100, 'First name must be less than 100 characters')
        .trim()
        .regex(/^[a-zA-Z\s\-']+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),

    last_name: z
        .string()
        .max(100, 'Last name must be less than 100 characters')
        .regex(/^[a-zA-Z\s\-']*$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes')
        .optional()
        .or(z.literal('')),

    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address')
        .max(255, 'Email must be less than 255 characters')
        .toLowerCase()
        .trim(),

    phone: z
        .string()
        .max(20, 'Phone must be less than 20 characters')
        .regex(/^[+\d\s\-()]{0,20}$/, 'Phone number contains invalid characters')
        .optional()
        .or(z.literal('')),

    summary: z
        .string()
        .max(1000, 'Summary must be less than 1000 characters')
        .optional()
        .or(z.literal('')),

    full_address: z
        .string()
        .max(500, 'Address must be less than 500 characters')
        .optional()
        .or(z.literal('')),

    website: z
        .string()
        .url('Please enter a valid URL (e.g., https://example.com)')
        .max(255, 'Website URL must be less than 255 characters')
        .optional()
        .or(z.literal(''))
        .transform((val) => {
            // Automatically add https:// if missing and not empty
            if (val && !val.startsWith('http://') && !val.startsWith('https://')) {
                return `https://${val}`;
            }
            return val;
        }),
});