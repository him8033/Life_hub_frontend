/**
 * User Validation Schemas
 * Basic format validation only - business logic handled by backend
 */

import { z } from 'zod';

// Create User Schema (basic format validation)
export const createUserSchema = z.object({
    email: z.string().email('Invalid email address'),
    first_name: z.string().optional().or(z.literal('')),
    last_name: z.string().optional().or(z.literal('')),
    phone_number: z.string().optional().or(z.literal('')),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm_password: z.string().min(8, 'Confirm password is required'),
    roles: z.array(z.string()).optional(),
    send_email: z.boolean().optional(),
}).refine(
    (data) => data.password === data.confirm_password,
    {
        message: "Passwords do not match",
        path: ["confirm_password"],
    }
);

// Edit User Schema (basic format validation)
export const editUserSchema = z.object({
    email: z.string().email('Invalid email address').optional(),
    first_name: z.string().optional().or(z.literal('')),
    last_name: z.string().optional().or(z.literal('')),
    phone_number: z.string().optional().or(z.literal('')),
    roles: z.array(z.string()).optional(),
    new_password: z.string().min(8, 'Password must be at least 8 characters').optional().or(z.literal('')),
    confirm_password: z.string().min(8, 'Confirm password is required').optional().or(z.literal('')),
    send_email: z.boolean().optional(),
}).refine(
    (data) => {
        if (data.new_password || data.confirm_password) {
            return data.new_password === data.confirm_password;
        }
        return true;
    },
    {
        message: "Passwords do not match",
        path: ["confirm_password"],
    }
);

// Update Status Schema (basic format validation)
export const updateUserStatusSchema = z.object({
    status_slug: z.string().optional().or(z.literal('')),
    reason: z.string().max(500, 'Reason must be 500 characters or less').optional().or(z.literal('')),
    send_email: z.boolean().optional(),
});

// Delete User Schema (basic format validation)
export const deleteUserSchema = z.object({
    permanent: z.boolean().optional(),
    reason: z.string().max(500, 'Reason must be 500 characters or less').optional(),
    send_email: z.boolean().optional(),
});