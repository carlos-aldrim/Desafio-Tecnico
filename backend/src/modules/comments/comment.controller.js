import {
  getAllComments,
  getCommentsByVideoId,
  createComment,
  deleteCommentById
} from "./comment.service.js";

export async function commentRoutes(app) {
  app.get("/comments", async () => {
    return getAllComments();
  });

  app.get("/videos/:videoId/comments", async (req, res) => {
    const { videoId } = req.params;

    if (isNaN(Number(videoId))) {
      return res.status(400).send({ error: "Invalid video ID" });
    }

    const comments = await getCommentsByVideoId(videoId);
    return res.send(comments);
  });

  app.post("/comments", async (req, res) => {
    const { userId, videoId, message } = req.body;

    if (!userId || !videoId || !message) {
      return res.status(400).send({ error: "Missing required fields" });
    }

    try {
      const comment = await createComment({ userId, videoId, message });
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
      await deleteCommentById(id);
      return res.status(204).send();
    } catch {
      return res.status(404).send({ error: "Comment not found" });
    }
  });
}
