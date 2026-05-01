import { z } from 'zod';

export const profileSchema = z.object({
    first_name: z
        .string()
        .trim()
        .min(1, 'First name is required')
        .max(100, 'First name must be less than 100 characters')
        .regex(
            /^[A-Za-z\s]+$/,
            'First name can only contain letters'
        ),

    last_name: z
        .string()
        .trim()
        .min(1, 'Last name is required')
        .max(100, 'Last name must be less than 100 characters')
        .regex(
            /^[A-Za-z\s]+$/,
            'Last name can only contain letters'
        ),

    email: z
        .union([
            z.string().email('Please enter a valid email address'),
            z.literal('')
        ]),

    phone_number: z
        .string()
        .trim()
        .optional()
        .or(z.literal(''))
        .refine(
            (value) => {
                if (!value) return true;

                return /^[6-9]\d{9}$/.test(value);
            },
            {
                message: 'Enter a valid 10-digit Indian mobile number',
            }
        ),

    headline: z
        .string()
        .max(255, 'Headline must be less than 255 characters')
        .optional()
        .or(z.literal('')),

    bio: z
        .string()
        .max(500, 'Bio must be less than 500 characters')
        .optional()
        .or(z.literal('')),

    date_of_birth: z
        .union([
            z
                .string()
                .refine((date) => {
                    const parsed = new Date(date);

                    if (isNaN(parsed.getTime())) {
                        return false;
                    }

                    if (parsed > new Date()) {
                        return false;
                    }

                    const minimumAgeDate = new Date();
                    minimumAgeDate.setFullYear(
                        minimumAgeDate.getFullYear() - 13
                    );

                    return parsed <= minimumAgeDate;
                }, 'You must be at least 13 years old'),
            z.literal('')
        ]),

    full_address: z
        .string()
        .max(500, 'Address must be less than 500 characters')
        .optional()
        .or(z.literal('')),

    country: z.string().optional().or(z.literal('')),
    state: z.string().optional().or(z.literal('')),
    district: z.string().optional().or(z.literal('')),
    sub_district: z.string().optional().or(z.literal('')),
    village: z.string().optional().or(z.literal('')),
    pincode: z.string().optional().or(z.literal('')),
});