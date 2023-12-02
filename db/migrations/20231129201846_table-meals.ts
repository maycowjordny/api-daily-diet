import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("meals", async (table) => {
    table.uuid("id").primary().notNullable();
    table.uuid("user_id").references("id").inTable("users").onDelete("CASCADE");
    table.text("title").notNullable();
    table.text("description").notNullable();
    table.boolean("is_diet").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("meals");
}
