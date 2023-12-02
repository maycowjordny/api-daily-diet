import { FastifyReply, FastifyRequest } from "fastify";
import {
  UserIdSchema,
  mealSchema,
  paramsSchema,
} from "../routes/schemas/routes.schema";
import { MealsRepository } from "../repository/MealsRepository/mealsRepository";

export class MealsController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { title, description, is_diet } = mealSchema.parse(request.body);

      const mealsRepository = new MealsRepository();

      const cookie = UserIdSchema.parse(request.cookies);

      await mealsRepository.create(title, description, is_diet, cookie.userID);

      return reply.status(201).send({ message: "Meal created successfully" });
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const cookie = UserIdSchema.parse(request.cookies);

      const mealsRepository = new MealsRepository();

      const meals = await mealsRepository.list(cookie.userID);

      return reply.status(200).send(meals);
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  }

  async listById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const cookie = UserIdSchema.parse(request.cookies);
      const { id } = paramsSchema.parse(request.params);

      const mealsRepository = new MealsRepository();
      const meals = await mealsRepository.listById(id, cookie.userID);

      return reply.status(200).send(meals);
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = paramsSchema.parse(request.params);
      const { title, description, is_diet } = mealSchema.parse(request.body);
      const cookie = UserIdSchema.parse(request.cookies);

      const mealsRepositoy = new MealsRepository();
      await mealsRepositoy.update(
        title,
        description,
        is_diet,
        id,
        cookie.userID
      );
      return reply.status(200).send({ message: "Meal updated successfully" });
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = paramsSchema.parse(request.params);
      const cookie = UserIdSchema.parse(request.cookies);

      const mealsRepository = new MealsRepository();
      await mealsRepository.delete(id, cookie.userID);

      return reply.status(200).send({ message: "Meal deleted successfully" });
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  }

  async metrics(request: FastifyRequest, reply: FastifyReply) {
    try {
      const cookie = UserIdSchema.parse(request.cookies);

      const mealsRepository = new MealsRepository();
      const metricMeals = await mealsRepository.metrics(cookie.userID);

      return reply.status(200).send(metricMeals);
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  }
}
