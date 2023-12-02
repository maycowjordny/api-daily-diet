import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.uuid("id").primary().notNullable();
    table.text("name");
    table.text("email").unique();
    table.text("password");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("users");
}
