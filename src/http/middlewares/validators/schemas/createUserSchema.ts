import * as z from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'name is required'),
    email: z.email('Invalid email address'),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
