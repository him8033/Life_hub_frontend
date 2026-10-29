/**
 * OTP Purpose Validation Schemas
 * Basic format validation only - business logic handled by backend
 */

import { z } from "zod";

// Reusable numeric validations (basic format)
const expirySecondsSchema = z.coerce
    .number()
    .int("Expiry time must be an integer")
    .positive("Expiry time must be positive");

const maxAttemptsSchema = z.coerce
    .number()
    .int("Max attempts must be an integer")
    .positive("Max attempts must be positive");

const resendCooldownSchema = z.coerce
    .number()
    .int("Resend cooldown must be an integer")
    .nonnegative("Resend cooldown cannot be negative");

// Create OTP Purpose Schema (basic format validation)
export const createOTPPurposeSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required").regex(
        /^[a-z0-9-]+$/,
        "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
    description: z.string().optional().or(z.literal("")),
    expiry_seconds: expirySecondsSchema,
    max_attempts: maxAttemptsSchema,
    resend_cooldown_seconds: resendCooldownSchema,
    is_active: z.boolean().optional(),
});

// Edit OTP Purpose Schema (basic format validation)
export const editOTPPurposeSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    slug: z.string().min(1, "Slug is required").regex(
        /^[a-z0-9-]+$/,
        "Slug must contain only lowercase letters, numbers, and hyphens"
    ).optional(),
    description: z.string().optional().or(z.literal("")),
    expiry_seconds: expirySecondsSchema.optional(),
    max_attempts: maxAttemptsSchema.optional(),
    resend_cooldown_seconds: resendCooldownSchema.optional(),
    is_active: z.boolean().optional(),
});