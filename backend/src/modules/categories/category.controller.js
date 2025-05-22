import * as categoryService from "./category.service.js";

export async function categoryRoutes(app) {
  app.get("/categories", async (req, res) => {
    try {
      const categories = await categoryService.getAllCategories();
      return res.send(categories);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Server error" });
    }
  });

  app.post("/categories", async (req, res) => {
    try {
      const category = await categoryService.createCategory(req.body.name);
      return res.send(category);
    } catch (error) {
      if (error.status && error.message) {
        return res.status(error.status).send({ error: error.message });
      }
      console.error(error);
      return res.status(500).send({ error: "Server error" });
    }
  });

  app.get("/categories/:id", async (req, res) => {
    const categoryId = Number(req.params.id);

    try {
      const categoryWithVideos = await categoryService.getCategoryById(categoryId);
      return res.send(categoryWithVideos);
    } catch (error) {
      if (error.status && error.message) {
        return res.status(error.status).send({ error: error.message });
      }
      console.error(error);
      return res.status(500).send({ error: "Server error" });
    }
  });

  app.put("/categories/:id", async (req, res) => {
    const categoryId = Number(req.params.id);

    try {
      const updatedCategory = await categoryService.updateCategory(categoryId, req.body.name);
      return res.send(updatedCategory);
    } catch (error) {
      if (error.status && error.message) {
        return res.status(error.status).send({ error: error.message });
      }
      console.error(error);
      return res.status(500).send({ error: "Server error" });
    }
  });

  app.delete("/categories/:id", async (req, res) => {
    const categoryId = Number(req.params.id);

    try {
      const result = await categoryService.deleteCategory(categoryId);
      return res.send(result);
    } catch (error) {
      if (error.status && error.message) {
        return res.status(error.status).send({ error: error.message });
      }
      console.error(error);
      return res.status(500).send({ error: "Server error" });
    }
  });
}
