import {
  getAllVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  findVideo,
} from "./video.service.js";

export async function videoRoutes(app) {
  app.get("/videos", async () => {
    return getAllVideos();
  });

  app.get("/videos/:id", async (req, res) => {
    const { id } = req.params;

    const video = await getVideoById(id);

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

    const video = await createVideo({ title, description, url, categoryId });

    return video;
  });

  app.put("/videos/:id", async (req, res) => {
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

    return updatedVideo;
  });

  app.delete("/videos/:id", async (req, res) => {
    const { id } = req.params;

    await deleteVideo(id);

    return { message: "Video deleted successfully" };
  });
}