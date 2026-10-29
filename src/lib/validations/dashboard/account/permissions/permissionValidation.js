/**
 * Permission Validation Schemas
 * Basic format validation only - business logic handled by backend
 */

import { z } from 'zod';

// Create Permission Schema (basic format validation)
export const createPermissionSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
    module: z.string().optional().or(z.literal('')),
    description: z.string().optional().or(z.literal('')),
    is_active: z.boolean().optional(),
});

// Edit Permission Schema (basic format validation)
export const editPermissionSchema = z.object({
    name: z.string().min(1, 'Name is required').optional(),
    slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens').optional(),
    module: z.string().optional().or(z.literal('')),
    description: z.string().optional().or(z.literal('')),
    is_active: z.boolean().optional(),
});