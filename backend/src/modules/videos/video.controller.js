import {
  getAllVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  findVideo,
} from "./video.service.js";

import {
  Video,
  VideosArray,
  CreateVideoBody,
  UpdateVideoBody,
  MessageResponse,
} from "./video.schema.js";

export async function videoRoutes(app) {
  app.get("/videos", {
    schema: {
      description: "Lista todos os vídeos",
      tags: ["Videos"],
      response: {
        200: VideosArray,
      },
    },
    handler: async () => {
      return getAllVideos();
    },
  });

  app.get("/videos/:id", {
    schema: {
      description: "Busca um vídeo pelo ID",
      tags: ["Videos"],
      params: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
      },
      response: {
        200: Video,
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
      const video = await getVideoById(id);

      if (!video) {
        return res.status(404).send({ error: "Video not found" });
      }

      return video;
    },
  });

  app.post("/videos", {
    schema: {
      description: "Cria um novo vídeo",
      tags: ["Videos"],
      body: CreateVideoBody,
      response: {
        201: Video,
        400: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
    handler: async (req, res) => {
      const { title, description, url, categoryId } = req.body;

      if (!title || !url || !categoryId) {
        return res.status(400).send({ error: "Missing fields" });
      }

      const video = await createVideo({ title, description, url, categoryId });

      return res.status(201).send(video);
    },
  });

  app.put("/videos/:id", {
    schema: {
      description: "Atualiza um vídeo existente",
      tags: ["Videos"],
      params: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
      },
      body: UpdateVideoBody,
      response: {
        200: Video,
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
      const { title, description, url, categoryId } = req.body;

      const video = await findVideo(id);

      if (!video) {
        return res.status(404).send({ error: "Video not found" });
      }

      const updatedVideo = await updateVideo(id, {
        title,
        description,
        url,
        categoryId,
      });

      return res.send(updatedVideo);
    },
  });

  app.delete("/videos/:id", {
    schema: {
      description: "Remove um vídeo pelo ID",
      tags: ["Videos"],
      params: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
      },
      response: {
        200: MessageResponse,
      },
    },
    handler: async (req, res) => {
      const { id } = req.params;

      await deleteVideo(id);

      return { message: "Video deleted successfully" };
    },
  });
}