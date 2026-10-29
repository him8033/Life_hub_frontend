/**
 * Role Validation Schemas
 * Basic format validation only - business logic handled by backend
 */

import { z } from 'zod';

// Create Role Schema (basic format validation)
export const createRoleSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
    description: z.string().optional().or(z.literal('')),
    is_active: z.boolean().optional(),
});

// Edit Role Schema (basic format validation)
export const editRoleSchema = z.object({
    name: z.string().min(1, 'Name is required').optional(),
    slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens').optional(),
    description: z.string().optional().or(z.literal('')),
    is_active: z.boolean().optional(),
});