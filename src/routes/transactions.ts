import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";
import {
  createTransactionBodySchema,
  transactionParamsSchema,
} from "./schemas/routes.schema";

export async function transactionsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", async (req, reply) => {});

  app.get(
    "/",
    {
      preHandler: [checkSessionIdExists],
    },
    async (req) => {
      const { sessionId } = req.cookies;

      const transactions = await knex("transactions")
        .where("session_id", sessionId)
        .select();

      return {
        transactions,
      };
    }
  );

  app.get(
    "/:id",
    {
      preHandler: [checkSessionIdExists],
    },
    async (req) => {
      const { sessionId } = req.cookies;
      const { id } = transactionParamsSchema.parse(req.params);

      const transactions = await knex("transactions")
        .where({
          session_id: sessionId,
          id,
        })
        .first();

      return { transactions };
    }
  );

  app.get(
    "/summary",
    {
      preHandler: [checkSessionIdExists],
    },
    async (req) => {
      const { sessionId } = req.cookies;
      const sumary = await knex("transactions")
        .where("session_id", sessionId)
        .sum("amount", { as: "amount" })
        .first();

      return { sumary };
    }
  );

  app.post("/", async (req, reply) => {
    const { title, amount, type } = createTransactionBodySchema.parse(req.body);

    let sessionId = req.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();
      reply.cookie("sessionId", sessionId, {
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });
    }

    await knex("transactions").insert({
      id: randomUUID(),
      title,
      amount: type == "credit" ? amount : amount * -1,
      session_id: sessionId,
    });

    return reply.status(201).send();
  });
}
