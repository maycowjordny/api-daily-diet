import { randomUUID } from "crypto";
import { knex } from "../../database";
import { UserSchemaType } from "../../routes/schemas/routes.schema";

export class UserRepository {
  async create({ name, email, password }: UserSchemaType) {
    const [userId] = await knex("users")
      .insert({
        id: randomUUID(),
        name,
        email,
        password,
      })
      .returning("id");
    return userId;
  }
}
