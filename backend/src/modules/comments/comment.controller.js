import { prisma } from "../../utils/prisma.js";

export async function commentRoutes(app) {
  app.get("/comments", async () => {
    return prisma.comment.findMany({
      include: { user: true, video: true },
    });
  });

  app.get("/videos/:videoId/comments", async (req, res) => {
    const { videoId } = req.params;

    if (isNaN(Number(videoId))) {
      return res.status(400).send({ error: "Invalid video ID" });
    }

    const comments = await prisma.comment.findMany({
      where: { videoId: Number(videoId) },
      include: { user: true },
    });

    return res.send(comments);
  });

  app.post("/comments", async (req, res) => {
    const { userId, videoId, message } = req.body;

    if (!userId || !videoId || !message) {
      return res.status(400).send({ error: "Missing required fields" });
    }

    try {
      const comment = await prisma.comment.create({
        data: {
          userId,
          videoId,
          message,
          timestamp: new Date(),
        },
      });

      return res.status(201).send(comment);
    } catch {
      return res.status(500).send({ error: "Server error" });
    }
  });

  app.delete("/comments/:id", async (req, res) => {
    const { id } = req.params;

    if (isNaN(Number(id))) {
      return res.status(400).send({ error: "Invalid comment ID" });
    }

    try {
      await prisma.comment.delete({
        where: { id: Number(id) },
      });

      return res.status(204).send();
    } catch {
      return res.status(404).send({ error: "Comment not found" });
    }
  });
}