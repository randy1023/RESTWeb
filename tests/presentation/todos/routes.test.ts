import request from "supertest";
import { TestServer } from "../../test.server";
import { prisma } from "../../../src/data/postgres";

describe("test on todo endpoints", () => {
  const todo1 = { text: "Hola mundo 1" };
  const todo2 = { text: "Hola mundo 2" };
  beforeAll(async () => {
    await TestServer.start();
  });
  beforeEach(async () => {
    await prisma.todo.deleteMany();
  });

  test("should return all Todos api/todos", async () => {
    await prisma.todo.createMany({
      data: [todo1, todo2],
    });

    const { body } = await request(TestServer.app)
      .get("/api/todos")
      .expect(200);

    expect(body).toBeInstanceOf(Array);
    expect(body.length).toBe(2);
    expect(body[0].text).toBe(todo1.text);
    expect(body[1].text).toBe(todo2.text);
  });

  test("should return a Todo api/todos/:id", async () => {
    const todo = await prisma.todo.create({
      data: todo1,
    });
    const app = TestServer.app;

    const { body } = await request(app)
      .get(`/api/todos/${todo.id}`)
      .expect(200);

    expect(body).toEqual({
      id: todo.id,
      text: todo1.text,
      completedAt: todo.completedAt,
    });
  });

  test("should return a 404 not found error api/todos/:id", async () => {
    const badID = 100;
    const { body, badRequest } = await request(TestServer.app)
      .get(`/api/todos/${badID}`)
      .expect(404);

    expect(body).toEqual({
      error: `Todo with id ${badID} not found`,
    });
  });

  test("should create a todo with api/todos/:id", async () => {
    const { body } = await request(TestServer.app)
      .post(`/api/todos`)
      .send(todo1)
      .expect(201);

    expect(body).toEqual({
      id: expect.any(Number),
      text: todo1.text,
      completedAt: null,
    });
  });
  test("should return a error if text not exist api/todos/:id", async () => {
    const { body } = await request(TestServer.app)
      .post(`/api/todos`)
      .send({})
      .expect(400);
    expect(body).toEqual({
      error: "Text property is requiered",
    });
  });

  test("should return a error if text exist but is a empty string api/todos/:id", async () => {
    const { body } = await request(TestServer.app)
      .post(`/api/todos`)
      .send({ text: "" })
      .expect(400);
    expect(body).toEqual({
      error: "Text property is requiered",
    });
  });

  test("should return an updated todo api/todos/:id", async () => {
    const text = "Hola mundo update";
    const completedAt = "2025-10-07";
    const todo = await prisma.todo.create({ data: todo1 });

    const { body } = await request(TestServer.app)
      .put(`/api/todos/${todo.id}`)
      .send({ text, completedAt })
      .expect(200);
    expect(body).toEqual({
      id: todo.id,
      text,
      completedAt: "2025-10-07T00:00:00.000Z",
    });
  });
  test("should return a 404 if todo not found", async () => {
    const badID = 100;
    const { body } = await request(TestServer.app)
      .put(`/api/todos/${badID}`)
      .send({})
      .expect(404);

    expect(body).toEqual({
      error: `Todo with id ${badID} not found`,
    });
  });
  test("should return a todo only with date updated", async () => {
    const completedAt = "2025-10-07";
    const todo = await prisma.todo.create({ data: todo1 });
    const { body } = await request(TestServer.app)
      .put(`/api/todos/${todo.id}`)
      .send({ completedAt })
      .expect(200);

    expect(body).toEqual({
      id: todo.id,
      text: todo.text,
      completedAt: "2025-10-07T00:00:00.000Z",
    });
  });
  test("should return a todo only with text updated", async () => {
    const text = "Hola mundo update";
    const todo = await prisma.todo.create({ data: todo1 });
    const { body } = await request(TestServer.app)
      .put(`/api/todos/${todo.id}`)
      .send({ text })
      .expect(200);

    expect(body).toEqual({
      id: todo.id,
      text: text,
      completedAt: null,
    });
  });
  test("should delete a TODO api/todos/:id", async () => {
    const todo = await prisma.todo.create({ data: todo1 });
    const { body } = await request(TestServer.app)
      .delete(`/api/todos/${todo.id}`)
      .expect(200);

    expect(body).toEqual({
      id: todo.id,
      text: todo.text,
      completedAt: todo.completedAt,
    });
  });

  test("should return 404 if TODO do not exist api/todos/:id", async () => {
    const { body } = await request(TestServer.app)
      .delete(`/api/todos/99999`)
      .expect(404);

    expect(body).toEqual({ error: "Todo with id 99999 not found" });
  });

  afterAll(() => {
    TestServer.close();
  });
});
