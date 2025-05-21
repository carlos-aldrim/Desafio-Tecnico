import request from "supertest";
import { buildApp } from "../src/app.js";
import { prisma } from "../src/utils/prisma.js";
import { hashPassword } from "../src/utils/hash.js";

describe("User Tests", () => {
  let app;

  beforeAll(async () => {
    app = await buildApp({ isTest: true });
  });

  afterAll(async () => {
    await app.close();
  });

  test("Should successfully create a new user", async () => {
    const res = await request(app.server).post("/users").send({
      name: "Teste 001",
      email: "teste001@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.email).toBe("teste001@example.com");

    await prisma.user.delete({ where: { id: res.body.id } });
  });

  test("Should not allow creating user with already registered email", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Test 002",
        email: "test002@example.com",
        password: hashPassword("password123"),
      },
    });

    const res = await request(app.server).post("/users").send({
      name: "Test",
      email: "test002@example.com",
      password: "anotherpass",
    });

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty("error", "Email already registered");

    await prisma.user.delete({ where: { id: user.id } });
  });

  test("Should authenticate valid user and return JWT token", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Test 003",
        email: "test003@example.com",
        password: hashPassword("password123"),
      },
    });

    const res = await request(app.server).post("/login").send({
      email: "test003@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");

    await prisma.user.delete({ where: { id: user.id } });
  });

  test("Should return authenticated user information", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Test 004",
        email: "test004@example.com",
        password: hashPassword("password123"),
      },
    });

    const loginRes = await request(app.server).post("/login").send({
      email: "test004@example.com",
      password: "password123",
    });

    const res = await request(app.server)
      .get("/profile")
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe("test004@example.com");

    await prisma.user.delete({ where: { id: user.id } });
  });

  test("Should successfully update the user's name", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Test 005",
        email: "test005@example.com",
        password: hashPassword("password123"),
      },
    });

    const loginRes = await request(app.server).post("/login").send({
      email: "test005@example.com",
      password: "password123",
    });

    const res = await request(app.server)
      .put(`/users/${user.id}`)
      .set("Authorization", `Bearer ${loginRes.body.token}`)
      .send({ name: "Test 005" });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Test 005");

    await prisma.user.delete({ where: { id: user.id } });
  });

  test("Should successfully delete the user", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Test 006",
        email: "test006@example.com",
        password: hashPassword("password123"),
      },
    });

    const loginRes = await request(app.server).post("/login").send({
      email: "test006@example.com",
      password: "password123",
    });

    const res = await request(app.server)
      .delete(`/users/${user.id}`)
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User deleted successfully");
  });
});
