import { z } from 'zod';

export const profileSkillSchema = z.object({
    skill_id: z.string().min(1, 'Skill is required'),
    level: z.string().min(1).max(5).default(3),
    years_of_experience: z.string().min(0).max(50).optional(),
    is_featured: z.enum(['true', 'false']),
});