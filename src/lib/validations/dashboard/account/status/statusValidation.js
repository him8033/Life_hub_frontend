/**
 * Status Validation Schemas
 * Basic format validation only - business logic handled by backend
 */

import { z } from 'zod';

// Create Status Schema (basic format validation)
export const createStatusSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
    description: z.string().optional().or(z.literal('')),
    is_active: z.boolean().optional(),
});

// Edit Status Schema (basic format validation)
export const editStatusSchema = z.object({
    name: z.string().min(1, 'Name is required').optional(),
    slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens').optional(),
    description: z.string().optional().or(z.literal('')),
    is_active: z.boolean().optional(),
});