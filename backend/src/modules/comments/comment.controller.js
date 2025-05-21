import { prisma } from "../../utils/prisma.js";

export async function commentRoutes(app) {
  app.get("/comments", async () => {
    return prisma.comment.findMany({
      include: { user: true, video: true },
    });
  });

  app.get("/videos/:videoId/comments", async (req, res) => {
    const { videoId } = req.params;
    const comments = await prisma.comment.findMany({
      where: { videoId: Number(videoId) },
      include: { user: true },
    });
    return comments;
  });

  app.post("/comments", async (req, res) => {
    const { userId, videoId, message } = req.body;

    if (!userId || !videoId || !message) {
      return res.status(400).send({ error: "Missing fields" });
    }

    const comment = await prisma.comment.create({
      data: {
        userId,
        videoId,
        message,
        timestamp: new Date(),
      },
    });

    return comment;
  });
}
