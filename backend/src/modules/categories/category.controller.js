import { prisma } from "../../utils/prisma.js";

export async function categoryRoutes(app) {
  app.get("/categories", async () => {
    return prisma.category.findMany();
  });

  app.post("/categories", async (req, res) => {
    const { name } = req.body;

    if (!name) {
      return res.status(400).send({ error: "Name is required" });
    }

    const category = await prisma.category.create({ data: { name } });
    return category;
  });

  app.get("/categories/:id", async (req, res) => {
    const categoryId = Number(req.params.id);

    if (!categoryId) {
      return res.status(400).send({ error: "Invalid ID" });
    }

    try {
      const categoryWithVideos = await prisma.category.findUnique({
        where: { id: categoryId },
        select: {
          id: true,
          name: true,
          videos: {
            select: {
              id: true,
              title: true,
              description: true,
              url: true,
            },
          },
        },
      });

      if (!categoryWithVideos) {
        return res.status(404).send({ error: "Category not found" });
      }

      return res.send(categoryWithVideos);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Server error" });
    }
  });

  app.put("/categories/:id", async (req, res) => {
    const categoryId = Number(req.params.id);
    const { name } = req.body;

    if (!categoryId) {
      return res.status(400).send({ error: "Invalid ID" });
    }

    if (!name) {
      return res.status(400).send({ error: "Name is required" });
    }

    try {
      const existingCategory = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!existingCategory) {
        return res.status(404).send({ error: "Category not found" });
      }

      const updatedCategory = await prisma.category.update({
        where: { id: categoryId },
        data: { name },
      });

      return res.send(updatedCategory);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Server error" });
    }
  });

  app.delete("/categories/:id", async (req, res) => {
    const categoryId = Number(req.params.id);
  
    if (!categoryId) {
      return res.status(400).send({ error: "Invalid ID" });
    }
  
    try {
      const existingCategory = await prisma.category.findUnique({
        where: { id: categoryId },
        include: { videos: true },
      });
  
      if (!existingCategory) {
        return res.status(404).send({ error: "Category not found" });
      }
  
      for (const video of existingCategory.videos) {
        await prisma.comment.deleteMany({
          where: { videoId: video.id },
        });
  
        await prisma.video.delete({
          where: { id: video.id },
        });
      }
  
      await prisma.category.delete({
        where: { id: categoryId },
      });
  
      return res.send({ message: "Category deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Server error" });
    }
  });  
}
