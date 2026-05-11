import * as z from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'name is required'),
    email: z.email('Invalid email address'),
    password: z.string().min(8, 'password must be at least 8 characters'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(1, 'password is required'),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
