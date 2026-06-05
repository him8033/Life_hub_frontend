import { z } from 'zod';

export const projectSchema = z.object({
    project_name: z.string().min(1, 'Project name is required').max(255).trim(),
    short_description: z.string().min(1, 'Short description is required').max(500).trim(),
    full_description: z.string().max(2000).optional().or(z.literal('')),
    code_url: z.string().url('Invalid URL').optional().or(z.literal('')),
    live_url: z.string().url('Invalid URL').optional().or(z.literal('')),
    is_live: z.enum(['true', 'false']),
    is_featured: z.enum(['true', 'false']),
    priority: z.number().int().min(0).optional(),
});