import { z } from 'zod';

export const travelspotSchema = z.object({
    name: z.string()
        .min(1, 'Name is required')
        .max(255, 'Name cannot exceed 255 characters'),

    slug: z.string()
        .min(1, 'Slug is required')
        .max(255, 'Slug cannot exceed 255 characters')
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-friendly (lowercase letters, numbers, hyphens)'),

    short_description: z.string()
        .max(500, 'Description cannot exceed 500 characters')
        .optional()
        .or(z.literal('')),

    long_description: z.string()
        .min(50, 'Long description must be at least 50 characters')
        .max(5000, 'Long description cannot exceed 5000 characters')
        .optional()
        .default(''),

    full_address: z.string()
        .max(1000, 'Address cannot exceed 1000 characters')
        .optional()
        .or(z.literal('')),

    city: z.string()
        .default('Delhi'),

    categories: z.array(z.string()).optional(),

    entry_fee: z.string()
        .regex(/^\d*\.?\d*$/, 'Enter a valid number for entry fee')
        .optional()
        .default(''), // Changed this line

    opening_time: z.string()
        .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Enter time in HH:MM format (24-hour)')
        .optional()
        .default(''), // Changed this line

    closing_time: z.string()
        .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Enter time in HH:MM format (24-hour)')
        .optional()
        .default(''), // Changed this line

    best_time_to_visit: z.string()
        .min(5, 'Best time to visit must be at least 5 characters')
        .max(100, 'Best time to visit cannot exceed 100 characters')
        .optional()
        .default(''), // Changed this line

    latitude: z.string()
        .refine((val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= -90 && parseFloat(val) <= 90), {
            message: 'Latitude must be a valid number between -90 and 90',
        })
        .optional()
        .or(z.literal('')),

    longitude: z.string()
        .refine((val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= -180 && parseFloat(val) <= 180), {
            message: 'Longitude must be a valid number between -180 and 180',
        })
        .optional()
        .or(z.literal('')),

    is_active: z.boolean().default(true),
});

// For API response validation
// export const travelspotResponseSchema = travelspotSchema.extend({
//     id: z.number(),
//     travelspot_id: z.string(),
//     created_at: z.string().datetime(),
//     updated_at: z.string().datetime(),
//     deleted_at: z.string().datetime().nullable(),
//     created_by: z.string().nullable(),
//     updated_by: z.string().nullable(),
// });

// // For list response
// export const travelspotListSchema = z.array(travelspotResponseSchema);

// // For form data transformation
// export const transformTravelspotData = (data) => {
//     const transformed = { ...data };

//     // Convert empty strings to null for optional fields
//     if (transformed.short_description === '') transformed.short_description = null;
//     if (transformed.full_address === '') transformed.full_address = null;
//     if (transformed.latitude === '') transformed.latitude = null;
//     if (transformed.longitude === '') transformed.longitude = null;

//     return transformed;
// };