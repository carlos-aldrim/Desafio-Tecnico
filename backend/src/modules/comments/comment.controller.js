import {
  getAllComments,
  getCommentsByVideoId,
  createComment,
  deleteCommentById,
} from "./comment.service.js";

import {
  CreateCommentBody,
  CreateCommentResponse,
  CommentsArray,
} from "./comment.schema.js";

export async function commentRoutes(app) {
  app.get("/comments", {
    schema: {
      description: "Lista todos os comentários",
      tags: ["Comments"],
      response: {
        200: CommentsArray,
      },
    },
    handler: async () => {
      return getAllComments();
    },
  });

  app.get("/videos/:videoId/comments", {
    schema: {
      description: "Lista os comentários de um vídeo específico",
      tags: ["Comments"],
      params: {
        type: "object",
        properties: {
          videoId: { type: "string" },
        },
        required: ["videoId"],
      },
      response: {
        200: CommentsArray,
        400: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
    handler: async (req, res) => {
      const { videoId } = req.params;

      if (isNaN(Number(videoId))) {
        return res.status(400).send({ error: "Invalid video ID" });
      }

      const comments = await getCommentsByVideoId(videoId);
      return res.send(comments);
    },
  });

  app.post("/comments", {
    schema: {
      description: "Cria um novo comentário",
      tags: ["Comments"],
      body: CreateCommentBody,
      response: {
        201: CreateCommentResponse,
        400: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
        500: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
    handler: async (req, res) => {
      const { userId, videoId, message } = req.body;

      if (!userId || !videoId || !message) {
        return res.status(400).send({ error: "Missing required fields" });
      }

      try {
        const comment = await createComment({ userId, videoId, message });
        return res.status(201).send(comment);
      } catch (err) {
        return res.status(500).send({ error: "Server error" });
      }
    },
  });

  app.delete("/comments/:id", {
    schema: {
      description: "Remove um comentário pelo ID",
      tags: ["Comments"],
      params: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
        required: ["id"],
      },
      response: {
        204: { type: "null" },
        400: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
        404: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
    handler: async (req, res) => {
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
    },
  });
}
