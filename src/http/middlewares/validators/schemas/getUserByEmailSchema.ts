import * as z from 'zod';

export const getUserByEmailSchema = z.object({
  params: z.object({
    email: z.email('Invalid email address'),
  }),
});
