import { z } from 'zod';

export const basicInfoSchema = z.object({
    first_name: z
        .string()
        .min(1, 'First name is required')
        .max(100, 'First name must be less than 100 characters')
        .trim(),
    last_name: z
        .string()
        .max(100, 'Last name must be less than 100 characters')
        .optional()
        .or(z.literal('')),
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email address'),
    phone: z
        .string()
        .max(20, 'Phone must be less than 20 characters')
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
        .url('Invalid website URL')
        .optional()
        .or(z.literal('')),
});