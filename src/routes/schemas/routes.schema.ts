import { z } from "zod";

export const mealSchema = z.object({
  title: z.string(),
  description: z.string(),
  is_diet: z.boolean(),
});

export const paramsSchema = z.object({
  id: z.string().uuid(),
});

export const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export const UserIdSchema = z.object({
  userID: z.string(),
});
