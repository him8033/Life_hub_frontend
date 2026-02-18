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

// Step 1: Basic Information Schema
export const basicInfoSchema = z.object({
    name: z.string()
        .min(3, 'Name must be at least 3 characters')
        .max(255, 'Name cannot exceed 255 characters'),

    slug: z.string()
        .min(3, 'Slug must be at least 3 characters')
        .max(255, 'Slug cannot exceed 255 characters')
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format. Use lowercase letters, numbers, and hyphens only'),

    short_description: z.string()
        .max(500, 'Short description cannot exceed 500 characters')
        .optional(),

    categories: z.array(z.string())
        .min(1, 'Select at least one category')
        .max(5, 'You can select up to 5 categories'),
});

// Step 2: Location & Address Schema
export const locationSchema = z.object({
    // REQUIRED
    country: z.string().min(1, 'Country is required'),
    state: z.string().min(1, 'State is required'),

    // OPTIONAL hierarchy
    district: z.string().optional().or(z.literal('')),
    sub_district: z.string().optional().or(z.literal('')),
    village: z.string().optional().or(z.literal('')),
    pincode: z.string().optional().or(z.literal('')),

    // Address
    full_address: z.string()
        .min(10, 'Address must be at least 10 characters')
        .max(500, 'Address cannot exceed 500 characters'),

    // Coordinates (optional with validation)
    latitude: z.string()
        .regex(/^-?([0-8]?[0-9]|90)(\.[0-9]{1,8})?$/, 'Invalid latitude format (-90 to 90)')
        .optional()
        .or(z.literal('')),

    longitude: z.string()
        .regex(/^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,8})?$/, 'Invalid longitude format (-180 to 180)')
        .optional()
        .or(z.literal('')),
});

// Conditional validation: If one coordinate is provided, the other should be too
export const locationSchemaWithConditional = locationSchema.refine(
    (data) => {
        const hasLat = data.latitude && data.latitude.trim() !== '';
        const hasLng = data.longitude && data.longitude.trim() !== '';
        return !(hasLat !== hasLng); // Both or none
    },
    {
        message: "Please provide both latitude and longitude, or leave both empty",
        path: ["longitude"], // Show error on longitude field
    }
);

// Step 3: Pricing & Timing Schema
export const practicalInfoSchema = z.object({
    entry_fee: z.string().min(1, "Entry fee is required").or(z.literal("0")),
    opening_time: z.string().optional(),
    closing_time: z.string().optional(),
    best_time_to_visit: z.string()
        .max(100, "Best time to visit should not exceed 100 characters")
        .optional(),
    long_description: z.string()
        .min(50, "Description must be at least 50 characters")
        .max(2000, "Description should not exceed 2000 characters"),
});