import { randomUUID } from "crypto";
import { knex } from "../../database";
import {
  MealSchemaType,
  UserSchemaType,
} from "../../routes/schemas/routes.schema";

export class MealsRepository {
  async create(
    title: string,
    description: string,
    is_diet: boolean,
    user_id: string
  ) {
    const response = await knex("meals").insert({
      id: randomUUID(),
      title,
      description,
      is_diet,
      user_id,
    });
    return response;
  }

  async list(userID: string) {
    const meals = await knex("meals").where("user_id", userID).select();

    return {
      meals,
    };
  }

  async listById(id: string, userID: string) {
    const meals = await knex("meals")
      .where({
        id,
        user_id: userID,
      })
      .select();

    return { meals };
  }

  async update(
    title: string,
    description: string,
    is_diet: boolean,
    id: string,
    userID: string
  ) {
    await knex("meals")
      .update({
        title,
        description,
        is_diet,
      })
      .where({
        id,
        user_id: userID,
      });
  }

  async delete(id: string, userID: string) {
    await knex("meals")
      .where({
        id,
        user_id: userID,
      })
      .delete();
  }

  async metrics(userID: string) {
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
  }
}
