/**
 * Role Permission Validation Schemas
 * Basic format validation only - business logic handled by backend
 */

import { z } from 'zod';

// Create Role Permission Schema (basic format validation)
export const createRolePermissionSchema = z.object({
    role_slug: z.string().min(1, 'Role is required'),
    permission_slug: z.string().min(1, 'Permission is required'),
});
