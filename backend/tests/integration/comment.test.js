import request from "supertest";
import { buildApp } from "../../src/app.js";
import { prisma } from "../../src/utils/prisma.js";
import { hashPassword } from "../../src/utils/hash.js";

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
        name: "João da Silva",
        email: "joao.silva@teste.com",
        password: hashPassword("senha123"),
      },
    });

    const category = await prisma.category.create({
      data: { name: "Aula" },
    });

    const video = await prisma.video.create({
      data: {
        title: "Como usar o Prisma",
        url: "https://meusite.com/video-prisma",
        categoryId: category.id,
      },
    });

    const res = await request(app.server).post("/comments").send({
      userId: user.id,
      videoId: video.id,
      message: "Muito bom esse tutorial, obrigado!"
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.message).toBe("Muito bom esse tutorial, obrigado!");

    await prisma.comment.delete({ where: { id: Number(res.body.id) } });
    await prisma.video.delete({ where: { id: Number(video.id) } });
    await prisma.category.delete({ where: { id: Number(category.id) } });
    await prisma.user.delete({ where: { id: Number(user.id) } });
  });

  test("Should fail to create comment with missing fields", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Maria Oliveira",
        email: "maria.oliveira@teste.com",
        password: hashPassword("senha123"),
      },
    });

    const res = await request(app.server).post("/comments").send({
      userId: user.id,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Bad Request");

    await prisma.user.delete({ where: { id: user.id } });
  });

  test("Should fail to create comment with non-existent user", async () => {
    const category = await prisma.category.create({
      data: { name: "Escola" },
    });

    const video = await prisma.video.create({
      data: {
        title: "Aulas de Matemática",
        url: "https://exemplo.com/matematica",
        categoryId: category.id,
      },
    });

    const res = await request(app.server).post("/comments").send({
      userId: 99999,
      videoId: video.id,
      message: "Comentário com usuário inválido",
    });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error");

    await prisma.video.delete({ where: { id: Number(video.id) } });
    await prisma.category.delete({ where: { id: Number(category.id) } });
  });

  test("Should fail to create comment with non-existent video", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Carlos Mendes",
        email: "carlos.mendes@teste.com",
        password: hashPassword("senha123"),
      },
    });

    const res = await request(app.server).post("/comments").send({
      userId: user.id,
      videoId: 99999,
      message: "Comentário com vídeo inválido",
    });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error");

    await prisma.user.delete({ where: { id: Number(user.id) } });
  });

  test("Should return all comments with user and video info", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Ana Clara",
        email: "ana.clara@teste.com",
        password: hashPassword("senha123"),
      },
    });

    const category = await prisma.category.create({
      data: { name: "Design" },
    });

    const video = await prisma.video.create({
      data: {
        title: "Introdução ao Figma",
        url: "https://exemplo.com/figma",
        categoryId: category.id,
      },
    });

    const comment = await prisma.comment.create({
      data: {
        userId: user.id,
        videoId: video.id,
        message: "Ótimo vídeo!",
      },
    });

    const res = await request(app.server).get("/comments");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("user");
    expect(res.body[0]).toHaveProperty("video");

    await prisma.comment.delete({ where: { id: Number(comment.id) } });
    await prisma.video.delete({ where: { id: Number(video.id) } });
    await prisma.category.delete({ where: { id: Number(category.id) } });
    await prisma.user.delete({ where: { id: Number(user.id) } });
  });

  test("Should return comments for specific video", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Bruno Souza",
        email: "bruno.souza@teste.com",
        password: hashPassword("senha123"),
      },
    });

    const category = await prisma.category.create({
      data: { name: "História" },
    });

    const video = await prisma.video.create({
      data: {
        title: "Revolução Francesa",
        url: "https://exemplo.com/historia",
        categoryId: category.id,
      },
    });

    const comment = await prisma.comment.create({
      data: {
        userId: user.id,
        videoId: video.id,
        message: "Muito interessante!",
      },
    });

    const res = await request(app.server).get(`/videos/${video.id}/comments`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("user");
    expect(Number(res.body[0].id)).toBe(comment.id);

    await prisma.comment.delete({ where: { id: Number(comment.id) } });
    await prisma.video.delete({ where: { id: Number(video.id) } });
    await prisma.category.delete({ where: { id: Number(category.id) } });
    await prisma.user.delete({ where: { id: Number(user.id) } });
  });

  test("Should fail to get comments with invalid video ID", async () => {
    const res = await request(app.server).get("/videos/abc/comments");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid video ID");
  });

  test("Should delete a comment", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Lúcia Santos",
        email: "lucia.santos@teste.com",
        password: hashPassword("senha123"),
      },
    });

    const category = await prisma.category.create({
      data: { name: "Ciência" },
    });

    const video = await prisma.video.create({
      data: {
        title: "Física Quântica",
        url: "https://exemplo.com/fisica",
        categoryId: category.id,
      },
    });

    const comment = await prisma.comment.create({
      data: {
        userId: user.id,
        videoId: video.id,
        message: "Incrível!",
      },
    });

    const res = await request(app.server).delete(`/comments/${comment.id}`);

    expect(res.statusCode).toBe(204);

    await prisma.video.delete({ where: { id: Number(video.id) } });
    await prisma.category.delete({ where: { id: Number(category.id) } });
    await prisma.user.delete({ where: { id: Number(user.id) } });
  });

  test("Should return 400 when deleting comment with invalid ID", async () => {
    const res = await request(app.server).delete("/comments/abc");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid comment ID");
  });

  test("Should return 404 when deleting non-existent comment", async () => {
    const res = await request(app.server).delete("/comments/999999");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Comment not found");
  });
});