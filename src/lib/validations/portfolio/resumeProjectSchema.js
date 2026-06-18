import { z } from 'zod';

export const resumeProjectSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255).trim(),
    snapshot_id: z.string().min(1, 'Snapshot is required'),
    template_id: z.string().min(1, 'Template is required'),
    font_family: z.string().default('Poppins'),
    primary_color: z.string().default('#2563EB'),
    layout: z.string().default('single_column'),
    is_public: z.enum(['true', 'false']),
});