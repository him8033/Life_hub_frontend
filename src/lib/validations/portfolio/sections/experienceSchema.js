import { z } from 'zod';

export const experienceSchema = z.object({
    company_name: z.string().min(1, 'Company name is required').max(255).trim(),
    role: z.string().min(1, 'Role is required').max(255).trim(),
    employment_type: z.string().min(1, 'Employment type is required').max(100),
    start_date: z.string().min(1, 'Start date is required'),
    end_date: z.string().optional().or(z.literal('')),
    is_current: z.enum(['true', 'false']),
    description: z.string().max(1000).optional().or(z.literal('')),
    full_address: z.string().max(500).optional().or(z.literal('')),
}).refine((data) => {
    if (data.is_current == 'true' && data.end_date) return false;
    return true;
}, { message: "Current job should not have an end date", path: ['end_date'] });