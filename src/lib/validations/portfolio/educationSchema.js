import { z } from 'zod';

export const educationSchema = z.object({
    degree_name: z
        .string()
        .min(1, 'Degree name is required')
        .max(255, 'Degree name must be less than 255 characters')
        .trim(),
    institution_name: z
        .string()
        .min(1, 'Institution name is required')
        .max(255, 'Institution name must be less than 255 characters')
        .trim(),
    start_date: z
        .string()
        .min(1, 'Start date is required'),
    end_date: z
        .string()
        .optional()
        .or(z.literal('')),
    is_current: z.enum(['true', 'false']),
    score: z
        .string()
        .max(50, 'Score must be less than 50 characters')
        .optional()
        .or(z.literal('')),
    description: z
        .string()
        .max(500, 'Description must be less than 500 characters')
        .optional()
        .or(z.literal('')),
    full_address: z
        .string()
        .max(500, 'Address must be less than 500 characters')
        .optional()
        .or(z.literal('')),
}).refine((data) => {
    if (data.is_current == 'true' && data.end_date) {
        return false;
    }
    return true;
}, {
    message: "Current education should not have an end date",
    path: ['end_date'],
});