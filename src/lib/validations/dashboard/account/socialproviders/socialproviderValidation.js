/**
 * Social Provider Validation Schemas
 * Basic format validation only - business logic handled by backend
 */

import { z } from 'zod';

// Create Social Provider Schema (basic format validation)
export const createSocialProviderSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
    description: z.string().optional().or(z.literal('')),
    is_active: z.boolean().optional(),
    provider_metadata: z.string().optional().or(z.literal('')),
});

// Edit Social Provider Schema (basic format validation)
export const editSocialProviderSchema = z.object({
    name: z.string().min(1, 'Name is required').optional(),
    slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens').optional(),
    description: z.string().optional().or(z.literal('')),
    is_active: z.boolean().optional(),
    provider_metadata: z.string().optional().or(z.literal('')),
});