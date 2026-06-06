import { z } from 'zod';

export const customSectionSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255).trim(),
    content: z.string().min(1, 'Content is required'),
});