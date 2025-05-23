import request from "supertest";
import { buildApp } from "../../src/app.js";
import { prisma } from "../../src/utils/prisma.js";

describe("Category Routes", () => {
  let app;

  beforeAll(async () => {
    app = await buildApp({ isTest: true });
  });

  afterAll(async () => {
    await app.close();
  });

  test("Should create a new category", async () => {
    const res = await request(app.server).post("/categories").send({
      name: "Educacional"
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("Educacional");

    await prisma.category.delete({ where: { id: res.body.id } });
  });

  test("Should not create category without name", async () => {
    const res = await request(app.server).post("/categories").send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Bad Request");
  });

  test("Should return list of categories", async () => {
    const category = await prisma.category.create({ data: { name: "Inovação" } });

    const res = await request(app.server).get("/categories");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body.some((cat) => cat.id === category.id)).toBe(true);

    await prisma.category.delete({ where: { id: category.id } });
  });

  test("Should get category by ID", async () => {
    const category = await prisma.category.create({ data: { name: "Saúde" } });

    const res = await request(app.server).get(`/categories/${category.id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", category.id);
    expect(res.body).toHaveProperty("name", "Saúde");

    await prisma.category.delete({ where: { id: category.id } });
  });

  test("Should return 404 if category not found", async () => {
    const res = await request(app.server).get("/categories/999999");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Category not found");
  });

  test("Should return 400 for invalid ID", async () => {
    const res = await request(app.server).get("/categories/abc");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Bad Request");
  });

  test("Should update a category", async () => {
    const category = await prisma.category.create({ data: { name: "Esportes" } });

    const res = await request(app.server)
      .put(`/categories/${category.id}`)
      .send({ name: "Esportes e Aventura" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("name", "Esportes e Aventura");

    await prisma.category.delete({ where: { id: category.id } });
  });

  test("Should return 404 when updating non-existent category", async () => {
    const res = await request(app.server).put("/categories/999999").send({ name: "Ficção" });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Category not found");
  });

  test("Should return 400 when updating without name", async () => {
    const category = await prisma.category.create({ data: { name: "Negócios" } });

    const res = await request(app.server).put(`/categories/${category.id}`).send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Bad Request");

    await prisma.category.delete({ where: { id: category.id } });
  });

  test("Should delete a category", async () => {
    const category = await prisma.category.create({ data: { name: "Jornal" } });

    const res = await request(app.server).delete(`/categories/${category.id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Category deleted successfully");
  });

  test("Should return 404 when deleting non-existent category", async () => {
    const res = await request(app.server).delete("/categories/999999");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Category not found");
  });

  test("Should return 400 when deleting with invalid ID", async () => {
    const res = await request(app.server).delete("/categories/invalid");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Bad Request");
  });
});