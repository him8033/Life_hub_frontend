/**
 * Social Account Validation Schemas
 * Basic format validation only - business logic handled by backend
 */

import { z } from 'zod';

// Create Social Account Schema (basic format validation)
export const createSocialAccountSchema = z.object({
    user_id: z.string().min(1, 'User is required'),
    provider_slug: z.string().min(1, 'Provider is required'),
    provider_user_id: z.string().min(1, 'Provider user ID is required'),
    provider_email: z.string().email('Invalid email address').optional().or(z.literal('')),
    provider_username: z.string().optional().or(z.literal('')),
    avatar_url: z.string().url('Invalid URL').optional().or(z.literal('')),
    provider_metadata: z.string().optional().or(z.literal('')),
});

// Edit Social Account Schema (basic format validation)
export const editSocialAccountSchema = z.object({
    provider_user_id: z.string().min(1, 'Provider user ID is required').optional(),
    provider_email: z.string().email('Invalid email address').optional().or(z.literal('')),
    provider_username: z.string().optional().or(z.literal('')),
    avatar_url: z.string().url('Invalid URL').optional().or(z.literal('')),
    provider_metadata: z.string().optional().or(z.literal('')),
});
