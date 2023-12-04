import { randomUUID } from "crypto";
import { knex } from "../../database";

export class MealsRepository {
  async create(
    title: string,
    description: string,
    is_diet: boolean,
    user_id: string
  ) {
    const [response] = await knex("meals")
      .insert({
        id: randomUUID(),
        title,
        description,
        is_diet,
        user_id,
      })
      .returning("id");
    return response.id;
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

    const mealsList = await knex("meals")
      .where("user_id", userID)
      .orderBy("created_at")
      .select("is_diet");

    let bestSequence = 0;
    let currentSequence = 0;

    for (const meals of mealsList) {
      if (meals.is_diet == true) {
        bestSequence++;
      } else {
        bestSequence = Math.max(bestSequence, currentSequence);
        currentSequence = 0;
      }
    }

    bestSequence = Math.max(bestSequence, currentSequence);
    return {
      ...mealsInDiet,
      ...mealsOutOfDiet,
      bestSequence,
    };
  }
}
