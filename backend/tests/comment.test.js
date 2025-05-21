import request from "supertest";
import { buildApp } from "../src/app.js";
import { prisma } from "../src/utils/prisma.js";
import { hashPassword } from "../src/utils/hash.js";

describe("Comment Tests", () => {
  let app;

  beforeAll(async () => {
    app = await buildApp({ isTest: true });
  });

  afterAll(async () => {
    await app.close();
  });

  test("Should create a new comment", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Teste 0001",
        email: "teste@example.com",
        password: hashPassword("password123"),
      },
    });

    const category = await prisma.category.create({
      data: { name: "Test 001" },
    });

    const video = await prisma.video.create({
      data: {
        title: "Test 001",
        url: "https://example.com/video",
        categoryId: category.id,
      },
    });

    const res = await request(app.server).post("/comments").send({
      userId: user.id,
      videoId: video.id,
      message: "This is a test comment",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.message).toBe("This is a test comment");

    await prisma.comment.delete({ where: { id: res.body.id } });
    await prisma.video.delete({ where: { id: video.id } });
    await prisma.category.delete({ where: { id: category.id } });
    await prisma.user.delete({ where: { id: user.id } });
  });

  test("Should fail to create comment with missing fields", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Teste 002",
        email: "teste@example.com",
        password: hashPassword("password123"),
      },
    });

    const category = await prisma.category.create({
      data: { name: "Test 002" },
    });

    const video = await prisma.video.create({
      data: {
        title: "Test 002",
        url: "https://example.com/video",
        categoryId: category.id,
      },
    });

    const res = await request(app.server).post("/comments").send({
      userId: user.id,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Missing fields");

    await prisma.video.delete({ where: { id: video.id } });
    await prisma.category.delete({ where: { id: category.id } });
    await prisma.user.delete({ where: { id: user.id } });
  });

  test("Should return all comments with user and video info", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Teste 003",
        email: "teste@example.com",
        password: hashPassword("password123"),
      },
    });

    const category = await prisma.category.create({
      data: { name: "Test 003" },
    });

    const video = await prisma.video.create({
      data: {
        title: "Test 003",
        url: "https://example.com/video",
        categoryId: category.id,
      },
    });

    const comment = await prisma.comment.create({
      data: {
        userId: user.id,
        videoId: video.id,
        message: "This is a test comment",
      },
    });

    const res = await request(app.server).get("/comments");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("user");
    expect(res.body[0]).toHaveProperty("video");

    await prisma.comment.delete({ where: { id: comment.id } });
    await prisma.video.delete({ where: { id: video.id } });
    await prisma.category.delete({ where: { id: category.id } });
    await prisma.user.delete({ where: { id: user.id } });
  });

  test("Should return comments for specific video", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Teste 004",
        email: "teste@example.com",
        password: hashPassword("password123"),
      },
    });

    const category = await prisma.category.create({
      data: { name: "Test 004" },
    });

    const video = await prisma.video.create({
      data: {
        title: "Test 004",
        url: "https://example.com/video",
        categoryId: category.id,
      },
    });

    const comment = await prisma.comment.create({
      data: {
        userId: user.id,
        videoId: video.id,
        message: "This is a test comment",
      },
    });

    const res = await request(app.server).get(`/videos/${video.id}/comments`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("user");
    expect(res.body[0].videoId).toBe(video.id);

    await prisma.comment.delete({ where: { id: comment.id } });
    await prisma.video.delete({ where: { id: video.id } });
    await prisma.category.delete({ where: { id: category.id } });
    await prisma.user.delete({ where: { id: user.id } });
  });
});
