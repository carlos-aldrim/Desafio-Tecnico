import request from "supertest";
import { buildApp } from "../src/app.js";
import { prisma } from "../src/utils/prisma.js";

describe("Video Tests", () => {
  let app;

  beforeAll(async () => {
    app = await buildApp({ isTest: true });
  });

  afterAll(async () => {
    await app.close();
  });

  test("Should create a new video", async () => {
    const category = await prisma.category.create({
      data: { name: "Test 001" }
    });

    const res = await request(app.server).post("/videos").send({
      title: "Test 001",
      description: "teste",
      url: "https://teste.com/video.mp4",
      categoryId: category.id,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe("Test 001");

    await prisma.video.delete({ where: { id: res.body.id } });
    await prisma.category.delete({ where: { id: category.id } });
  });

  test("Should not create a video with missing fields", async () => {
    const category = await prisma.category.create({
      data: { name: "Test 002" }
    });

    const res = await request(app.server).post("/videos").send({
      title: "Teste 002",
      url: "",
      categoryId: category.id,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Missing fields");

    await prisma.category.delete({ where: { id: category.id } });
  });

  test("Should return all videos", async () => {
    const category = await prisma.category.create({
      data: { name: "Test 003" }
    });

    const video = await prisma.video.create({
      data: {
        title: "Test 003",
        description: "teste",
        url: "https://teste.com/movie.mp4",
        categoryId: category.id,
      },
    });

    const res = await request(app.server).get("/videos");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    await prisma.video.delete({ where: { id: video.id } });
    await prisma.category.delete({ where: { id: category.id } });
  });

  test("Should return a specific video by ID", async () => {
    const category = await prisma.category.create({
      data: { name: "Test 004" }
    });

    const video = await prisma.video.create({
      data: {
        title: "Test 004",
        description: "teste",
        url: "https://teste.com/movie.mp4",
        categoryId: category.id,
      },
    });

    const res = await request(app.server).get(`/videos/${video.id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", video.id);
    expect(res.body.category).toHaveProperty("id", category.id);

    await prisma.video.delete({ where: { id: video.id } });
    await prisma.category.delete({ where: { id: category.id } });
  });

  test("Should return 404 for non-existent video", async () => {
    const res = await request(app.server).get("/videos/99999");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Video not found");
  });

  test("Should delete a video", async () => {
    const category = await prisma.category.create({
      data: { name: "Test 005" }
    });

    const video = await prisma.video.create({
      data: {
        title: "Test 005",
        description: "teste",
        url: "https://teste.com/movie.mp4",
        categoryId: category.id,
      },
    });

    const res = await request(app.server).delete(`/videos/${video.id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Video deleted successfully");

    await prisma.category.delete({ where: { id: category.id } });
  });

  test("Should return an empty list after deletion", async () => {
    const category = await prisma.category.create({
      data: { name: "Test 006" }
    });

    const video = await prisma.video.create({
      data: {
        title: "Teste 006",
        description: "teste",
        url: "https://teste.com/only.mp4",
        categoryId: category.id,
      },
    });

    await request(app.server).delete(`/videos/${video.id}`);

    const res = await request(app.server).get("/videos");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.find((v) => v.id === video.id)).toBeUndefined();

    await prisma.category.delete({ where: { id: category.id } });
  });
});
