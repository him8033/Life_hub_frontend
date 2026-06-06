import { z } from 'zod';

export const portfolioProjectSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255).trim(),
    snapshot_id: z.string().min(1, 'Snapshot is required'),
    theme_key: z.string().default('developer_dark'),
    custom_domain: z.string().optional().or(z.literal('')),
    seo_title: z.string().max(255).optional().or(z.literal('')),
    seo_description: z.string().max(500).optional().or(z.literal('')),
    hero_title: z.string().max(255).optional().or(z.literal('')),
    hero_subtitle: z.string().max(500).optional().or(z.literal('')),
    is_public: z.enum(['true', 'false']),
});