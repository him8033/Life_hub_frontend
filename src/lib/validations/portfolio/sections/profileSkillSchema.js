// src/lib/validations/portfolio/sections/profileSkillSchema.js

import { z } from 'zod';

export const profileSkillSchema = z.object({
    skill_id: z
        .union([
            z.string().min(1, 'Please select a skill'),
            z.number().transform((val) => String(val))
        ])
        .transform((val) => String(val))
        .refine((val) => val.length > 0, {
            message: 'Please select a skill'
        }),

    level: z
        .union([
            z.string().transform((val) => {
                const num = parseInt(val, 10);
                if (isNaN(num)) return 3;
                return Math.min(Math.max(num, 1), 5);
            }),
            z.number().min(1).max(5)
        ])
        .default(3),

    years_of_experience: z
        .union([
            z.string().transform((val) => {
                if (val === '' || val === undefined || val === null) return 0;
                const num = parseFloat(val);
                return isNaN(num) ? 0 : Math.min(Math.max(num, 0), 50);
            }),
            z.number().min(0).max(50)
        ])
        .default(0)
        .optional(),

    is_featured: z
        .union([
            z.string().transform((val) => val === 'true'),
            z.boolean()
        ])
        .default(false),
});