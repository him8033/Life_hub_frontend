import { z } from 'zod';

export const hobbySchema = z.object({
    hobby_name: z
        .string()
        .min(1, 'Hobby name is required')
        .max(255, 'Hobby name must be less than 255 characters')
        .trim(),
});