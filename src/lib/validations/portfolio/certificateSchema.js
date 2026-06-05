import { z } from 'zod';

export const certificateSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255).trim(),
    issued_by: z.string().max(255).optional().or(z.literal('')),
    issued_date: z.string().optional().or(z.literal('')),
    expiry_date: z.string().optional().or(z.literal('')),
    credential_id: z.string().max(255).optional().or(z.literal('')),
    certificate_url: z.string().url('Invalid URL').optional().or(z.literal('')),
    description: z.string().max(500).optional().or(z.literal('')),
}).refine((data) => {
    if (data.issued_date && data.expiry_date && data.expiry_date < data.issued_date) return false;
    return true;
}, { message: "Expiry date cannot be before issued date", path: ['expiry_date'] });