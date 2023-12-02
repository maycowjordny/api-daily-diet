import { it, beforeAll, afterAll, describe, expect, beforeEach } from "vitest";
import { app } from "../src/app";
import request from "supertest";
import { execSync } from "node:child_process";

describe("User routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync("npm run knex migrate:rollback --all");
    execSync("npm run knex migrate:latest");
  });

  it("should be able to create a user", async () => {
    await request(app.server)
      .post("/users")
      .send({
        name: "teste",
        email: "teste@gmail.com",
        password: "123",
      })
      .expect(201);
  });

  it("should not allow creation of a user with a duplicate email", async () => {
    const DUPLICATED_EMAIL = "teste@gmail.com";
    const RESPONSE_MESSAGE = "Email already exists";

    await request(app.server).post("/users").send({
      name: "teste",
      email: DUPLICATED_EMAIL,
      password: "senha123",
    });

    const response = await request(app.server)
      .post("/users")
      .send({
        name: "teste",
        email: DUPLICATED_EMAIL,
        password: "senha123",
      })
      .expect(500);

    console.log(response.body);
    expect(response.body).toEqual({ message: RESPONSE_MESSAGE });
  });
});
