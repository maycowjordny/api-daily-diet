import { it, beforeAll, afterAll, describe, expect, beforeEach } from "vitest";
import { app } from "../src/app";
import request from "supertest";
import { execSync } from "node:child_process";

describe("Meals routes", () => {
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

  it("should be able to create a new meal when is_diet is true", async () => {
    const RESPONSE_MESSAGE = {
      message: "Meal created successfully",
      mealsId: expect.any(String),
    };

    const createUser = await request(app.server).post("/users").send({
      name: "teste",
      email: "teste@gmail.com",
      password: "123",
    });
    const [cookies] = createUser.get("Set-Cookie");

    const response = await request(app.server)
      .post("/meals")
      .set("Cookie", cookies)
      .send({
        title: "New meal",
        description: "New description",
        is_diet: true,
      })
      .expect(201);

    expect(response.body).toEqual(RESPONSE_MESSAGE);
  });

  it("should be able to create a new meal when is_diet is false", async () => {
    const RESPONSE_MESSAGE = {
      message: "Meal created successfully",
      mealsId: expect.any(String),
    };
    const createUser = await request(app.server).post("/users").send({
      name: "teste",
      email: "teste@gmail.com",
      password: "123",
    });
    const [cookies] = createUser.get("Set-Cookie");

    const response = await request(app.server)
      .post("/meals")
      .set("Cookie", cookies)
      .send({
        title: "New meal",
        description: "New description",
        is_diet: false,
      })
      .expect(201);

    expect(response.body).toEqual(RESPONSE_MESSAGE);
  });

  it("should be able to list all meals", async () => {
    const TITLE = "New meal";
    const DESCRIPTION = "New description";
    const createUser = await request(app.server).post("/users").send({
      name: "teste",
      email: "teste@gmail.com",
      password: "123",
    });
    const [cookies] = createUser.get("Set-Cookie");

    await request(app.server).post("/meals").set("Cookie", cookies).send({
      title: TITLE,
      description: DESCRIPTION,
      is_diet: false,
    });

    await request(app.server).post("/meals").set("Cookie", cookies).send({
      title: "New meal",
      description: "New description",
      is_diet: true,
    });

    await request(app.server)
      .get("/meals")
      .set("Cookie", cookies)
      .send()
      .expect(200);
  });

  it("should be able to list a meal by id", async () => {
    const TITLE = "New meal";
    const DESCRIPTION = "New description";

    const createUser = await request(app.server).post("/users").send({
      name: "teste",
      email: "teste@gmail.com",
      password: "123",
    });
    const [cookies] = createUser.get("Set-Cookie");

    const meal = await request(app.server)
      .post("/meals")
      .set("Cookie", cookies)
      .send({
        title: TITLE,
        description: DESCRIPTION,
        is_diet: true,
      });

    const mealsId = meal.body.mealsId;

    await request(app.server)
      .get(`/meals/${mealsId}`)
      .set("Cookie", cookies)
      .expect(200);
  });

  it("should be able to update a meal by id", async () => {
    const TITLE = "New meal";
    const DESCRIPTION = "New description";

    const TITLE_UPDATED = "New meal updated";
    const DESCRIPTION_UPDATED = "New description updated";

    const createUser = await request(app.server).post("/users").send({
      name: "teste",
      email: "teste@gmail.com",
      password: "123",
    });
    const [cookies] = createUser.get("Set-Cookie");

    const meal = await request(app.server)
      .post("/meals")
      .set("Cookie", cookies)
      .send({
        title: TITLE,
        description: DESCRIPTION,
        is_diet: true,
      });

    const mealsId = meal.body.mealsId;

    await request(app.server)
      .put(`/meals/${mealsId}`)
      .set("Cookie", cookies)
      .send({
        title: TITLE_UPDATED,
        description: DESCRIPTION_UPDATED,
        is_diet: false,
      })
      .expect(200);
  });

  it("should be able to delete a meal by id", async () => {
    const TITLE = "New meal";
    const DESCRIPTION = "New description";

    const createUser = await request(app.server).post("/users").send({
      name: "teste",
      email: "teste@gmail.com",
      password: "123",
    });
    const [cookies] = createUser.get("Set-Cookie");

    const meal = await request(app.server)
      .post("/meals")
      .set("Cookie", cookies)
      .send({
        title: TITLE,
        description: DESCRIPTION,
        is_diet: true,
      });

    const mealsId = meal.body.mealsId;

    await request(app.server)
      .delete(`/meals/${mealsId}`)
      .set("Cookie", cookies)
      .expect(200);
  });

  it("should be able to get meal metrics", async () => {
    const TITLE = "New meal";
    const DESCRIPTION = "New description";

    const createUser = await request(app.server).post("/users").send({
      name: "teste",
      email: "teste@gmail.com",
      password: "123",
    });
    const [cookies] = createUser.get("Set-Cookie");

    await request(app.server).post("/meals").set("Cookie", cookies).send({
      title: TITLE,
      description: DESCRIPTION,
      is_diet: true,
    });

    await request(app.server).post("/meals").set("Cookie", cookies).send({
      title: TITLE,
      description: DESCRIPTION,
      is_diet: false,
    });

    await request(app.server).get(`/meals`).set("Cookie", cookies);

    const metric = await request(app.server)
      .get("/meals/metrics")
      .set("Cookie", cookies)
      .expect(200);
  });
});
