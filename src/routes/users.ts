import { FastifyInstance } from "fastify";
import { Controller } from "../controller/UserController";

const userConotroller = new Controller();

export async function userRoutes(app: FastifyInstance) {
  app.post("/", userConotroller.create);
}
