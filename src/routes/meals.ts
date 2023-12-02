import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { randomUUID } from "node:crypto";
import { mealSchema, paramsSchema } from "./schemas/routes.schema";
import { MealsController } from "../controller/MealsController";
const mealsController = new MealsController();

export async function mealsRoutes(app: FastifyInstance) {
  app.post("/", mealsController.create);

  app.get("/", mealsController.list);

  app.get("/:id", mealsController.listById);

  app.put("/:id", mealsController.update);

  app.delete("/:id", mealsController.delete);

  app.get("/metrics", mealsController.metrics);

  /*  

  app.get("/metrics", async (request) => {
    const { userID } = request.cookies;
    const mealsInDiet = await knex("meals")
      .where({ user_id: userID, is_diet: true })
      .count("is_diet", { as: "mealsInDiet" })
      .first();

    const mealsOutOfDiet = await knex("meals")
      .where({ user_id: userID, is_diet: false })
      .count("is_diet", { as: "mealsOutOfDiet" })
      .first();

    const [bestSequence] = await knex.raw(
      "SELECT COUNT(PARTITION_MAX) AS BEST_SEQUENCE FROM (SELECT USER_ID, IS_DIET,ROW_NUMBER() OVER (ORDER BY CREATED_AT) - ROW_NUMBER() OVER (PARTITION BY IS_DIET ORDER BY CREATED_AT) AS PARTITION_MAX FROM MEALS) AS QUERY WHERE IS_DIET = 1 AND PARTITION_MAX = 1 AND QUERY.USER_ID = ?",
      [userID]
    );

    return {
      ...mealsInDiet,
      ...mealsOutOfDiet,
      ...bestSequence,
    };
  });

  }); */
}
