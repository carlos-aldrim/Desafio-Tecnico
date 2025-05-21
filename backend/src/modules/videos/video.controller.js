import { prisma } from "../../utils/prisma.js";

export async function videoRoutes(app) {
  app.get("/videos", async () => {
    return prisma.video.findMany({ include: { category: true } });
  });

  app.get("/videos/:id", async (req, res) => {
    const { id } = req.params;
    const video = await prisma.video.findUnique({
      where: { id: Number(id) },
      include: { category: true },
    });

    if (!video) {
      return res.status(404).send({ error: "Video not found" });
    }
    return video;
  });

  app.post("/videos", async (req, res) => {
    const { title, description, url, categoryId } = req.body;

    if (!title || !url || !categoryId) {
      return res.status(400).send({ error: "Missing fields" });
    }

    const video = await prisma.video.create({
      data: { title, description, url, categoryId },
    });

    return video;
  });

  app.delete("/videos/:id", async (req, res) => {
    const { id } = req.params;

    await prisma.video.delete({ where: { id: Number(id) } });

    return { message: "Video deleted successfully" };
  });
}