import request from "supertest";
import { buildApp } from "../src/app.js";
import { prisma } from "../src/utils/prisma.js";

describe("Category Tests", () => {
  let app;

  beforeAll(async () => {
    app = await buildApp({ isTest: true });
  });

  afterAll(async () => {
    await app.close();
  });

  test("Should create a new category", async () => {
    const res = await request(app.server).post("/categories").send({
      name: "Test 001"
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("Test 001");

    await prisma.category.delete({ where: { id: res.body.id } });
  });

  test("Should not create category without name", async () => {
    const res = await request(app.server).post("/categories").send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Name is required");
  });

  test("Should return list of categories", async () => {
    const category = await prisma.category.create({ data: { name: "Test 002" } });

    const res = await request(app.server).get("/categories");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body.some((cat) => cat.id === category.id)).toBe(true);

    await prisma.category.delete({ where: { id: category.id } });
  });
});
