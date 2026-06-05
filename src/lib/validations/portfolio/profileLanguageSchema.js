import { z } from 'zod';

export const profileLanguageSchema = z.object({
    language_id: z
        .string()
        .min(1, 'Please select a language'),
    proficiency: z
        .string()
        .min(1, 'Please select proficiency level'),
});