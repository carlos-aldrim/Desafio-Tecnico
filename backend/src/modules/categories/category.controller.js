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
}
