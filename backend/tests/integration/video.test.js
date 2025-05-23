import request from "supertest";
import { buildApp } from "../../src/app.js";
import { prisma } from "../../src/utils/prisma.js";

describe("Video Routes", () => {
  let app;

  beforeAll(async () => {
    app = await buildApp({ isTest: true });
  });

  afterAll(async () => {
    await app.close();
  });

  test("Should create a new video", async () => {
    const category = await prisma.category.create({
      data: { name: "Documentário" }
    });

    const res = await request(app.server).post("/videos").send({
      title: "A História da Internet",
      description: "Documentário sobre a evolução da internet.",
      url: "https://videosite.com/internet-history.mp4",
      categoryId: category.id,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe("A História da Internet");

    await prisma.video.delete({ where: { id: Number(res.body.id) } });
    await prisma.category.delete({ where: { id: Number(category.id) } });
  });

  test("Should not create a video with missing fields", async () => {
    const category = await prisma.category.create({
      data: { name: "Educação" }
    });

    const res = await request(app.server).post("/videos").send({
      title: "Curso de Física Básica",
      url: "",
      categoryId: category.id,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Missing fields");

    await prisma.category.delete({ where: { id: Number(category.id) } });
  });

  test("Should return all videos", async () => {
    const category = await prisma.category.create({
      data: { name: "Tecnologia" }
    });

    const video = await prisma.video.create({
      data: {
        title: "O Futuro da IA",
        description: "Explorando o impacto da inteligência artificial.",
        url: "https://videosite.com/ia-futuro.mp4",
        categoryId: category.id,
      },
    });

    const res = await request(app.server).get("/videos");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    await prisma.video.delete({ where: { id: Number(video.id) } });
    await prisma.category.delete({ where: { id: Number(category.id) } });
  });

  test("Should return a specific video by ID", async () => {
    const category = await prisma.category.create({
      data: { name: "Cinema" }
    });

    const video = await prisma.video.create({
      data: {
        title: "Making of de um Filme",
        description: "Os bastidores da produção de um longa.",
        url: "https://videosite.com/making-of.mp4",
        categoryId: category.id,
      },
    });

    const res = await request(app.server).get(`/videos/${video.id}`);

    expect(res.statusCode).toBe(200);
    expect(Number(res.body.id)).toBe(video.id);
    expect(Number(res.body.categoryId)).toBe(category.id);

    await prisma.video.delete({ where: { id: Number(video.id) } });
    await prisma.category.delete({ where: { id: Number(category.id) } });
  });

  test("Should return 404 for non-existent video", async () => {
    const res = await request(app.server).get("/videos/99999");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Video not found");
  });

  test("Should update an existing video", async () => {
    const category = await prisma.category.create({
      data: { name: "Atualização" }
    });

    const video = await prisma.video.create({
      data: {
        title: "Título Antigo",
        description: "Descrição antiga",
        url: "https://videosite.com/old.mp4",
        categoryId: category.id,
      },
    });

    const res = await request(app.server).put(`/videos/${video.id}`).send({
      title: "Título Atualizado",
      description: "Descrição atualizada com mais detalhes.",
      url: "https://videosite.com/updated.mp4",
      categoryId: category.id,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Título Atualizado");

    await prisma.video.delete({ where: { id: Number(video.id) } });
    await prisma.category.delete({ where: { id: Number(category.id) } });
  });

  test("Should delete a video", async () => {
    const category = await prisma.category.create({
      data: { name: "Remoção" }
    });

    const video = await prisma.video.create({
      data: {
        title: "Video Temporário",
        description: "Será removido em breve.",
        url: "https://videosite.com/temp.mp4",
        categoryId: category.id,
      },
    });

    const res = await request(app.server).delete(`/videos/${video.id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Video deleted successfully");

    await prisma.category.delete({ where: { id: Number(category.id) } });
  });

  test("Should return an empty list after deletion", async () => {
    const category = await prisma.category.create({
      data: { name: "Exclusão" }
    });

    const video = await prisma.video.create({
      data: {
        title: "Video Único",
        description: "Deve ser o único e será excluído.",
        url: "https://videosite.com/unique.mp4",
        categoryId: category.id,
      },
    });

    await request(app.server).delete(`/videos/${video.id}`);

    const res = await request(app.server).get("/videos");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.find((v) => v.id === video.id)).toBeUndefined();

    await prisma.category.delete({ where: { id: Number(category.id) } });
  });
});