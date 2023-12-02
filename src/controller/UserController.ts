import { FastifyReply, FastifyRequest } from "fastify";
import { userSchema } from "../routes/schemas/routes.schema";
import { UserRepository } from "../repository/UserRepository/userRepository";

export class Controller {
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { name, email, password } = userSchema.parse(request.body);

      const userRepository = new UserRepository();

      const response = await userRepository.create({ name, email, password });

      reply.cookie("userID", response.id, {
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });

      return reply.status(201).send();
    } catch (err: any) {
      if (err.code == "SQLITE_CONSTRAINT") {
        reply.status(500).send({ message: "Email already exists" });
      }

      return reply.status(500).send({ error: err.message });
    }
  }
}
