import { z } from 'zod';

export const createBookSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    bookType: z.enum(['fiction', 'non-fiction']),
    genre: z.string().optional(),
    category: z.string().optional(),
    targetAudience: z.string().optional(),
    writingTone: z.number().int().min(1).max(10).optional(),
    themes: z.array(z.string()).optional(),
    chapters: z.array(z.object({
        number: z.number().int().positive(),
        title: z.string().min(1)
    }))
});

export type CreateBookInput = z.infer<typeof createBookSchema>;

export const updateBookSchema = createBookSchema.partial().required({ title: true });
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
