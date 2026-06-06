// src/lib/validations/spotCategorySchema.js
import { z } from 'zod';

export const spotCategorySchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be less than 50 characters")
        .regex(/^[a-zA-Z0-9\s\-&]+$/, "Name can only contain letters, numbers, spaces, hyphens, and ampersands"),

    slug: z
        .string()
        .min(2, "Slug must be at least 2 characters")
        .max(50, "Slug must be less than 50 characters")
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain only lowercase letters, numbers, and hyphens")
        .refine(slug => !slug.startsWith('-') && !slug.endsWith('-'), {
            message: "Slug cannot start or end with a hyphen",
        }),
});
