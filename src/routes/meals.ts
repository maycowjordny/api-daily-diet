import { FastifyInstance } from "fastify";
import { MealsController } from "../controller/MealsController";
const mealsController = new MealsController();

export async function mealsRoutes(app: FastifyInstance) {
  app.post("/", mealsController.create);

  app.get("/", mealsController.list);

  app.get("/:id", mealsController.listById);

  app.put("/:id", mealsController.update);

  app.delete("/:id", mealsController.delete);

  app.get("/metrics", mealsController.metrics);
}
