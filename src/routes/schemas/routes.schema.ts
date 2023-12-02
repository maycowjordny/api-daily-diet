import { number, z } from "zod";

export const transactionParamsSchema = z.object({
  id: z.string().uuid(),
});

export const createTransactionBodySchema = z.object({
  title: z.string(),
  amount: z.number(),
  type: z.enum(["credit", "debit"]),
});

export const mealSchema = z.object({
  title: z.string(),
  description: z.string(),
  is_diet: z.boolean(),
});

export type MealSchemaType = z.infer<typeof mealSchema>;

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

export type UserSchemaType = z.infer<typeof userSchema>;
