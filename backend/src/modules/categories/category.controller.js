import * as categoryService from "./category.service.js";
import {
  Category,
  CreateCategoryBody,
  CreateCategoryResponse,
  CategoriesArray,
  CategoryWithVideos,
} from "./category.schema.js";

export async function categoryRoutes(app) {
  app.get("/categories", {
    schema: {
      description: "Lista todas as categorias",
      tags: ["Categories"],
      response: {
        200: CategoriesArray,
      },
    },
    handler: async (req, res) => {
      try {
        const categories = await categoryService.getAllCategories();
        return res.send(categories);
      } catch (error) {
        console.error(error);
        return res.status(500).send({ error: "Server error" });
      }
    },
  });

  app.post("/categories", {
    schema: {
      description: "Cria uma nova categoria",
      tags: ["Categories"],
      body: CreateCategoryBody,
      response: {
        200: CreateCategoryResponse,
      },
    },
    handler: async (req, res) => {
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
    },
  });

  app.get("/categories/:id", {
    schema: {
      description: "Busca uma categoria por ID com seus vídeos",
      tags: ["Categories"],
      params: {
        type: "object",
        properties: {
          id: { type: "number" },
        },
      },
      response: {
        200: CategoryWithVideos,
        404: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
    handler: async (req, res) => {
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
    },
  });

  app.put("/categories/:id", {
    schema: {
      description: "Atualiza uma categoria pelo ID",
      tags: ["Categories"],
      params: {
        type: "object",
        properties: {
          id: { type: "number" },
        },
      },
      body: CreateCategoryBody,
      response: {
        200: Category,
      },
    },
    handler: async (req, res) => {
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
    },
  });

  app.delete("/categories/:id", {
    schema: {
      description: "Remove uma categoria pelo ID",
      tags: ["Categories"],
      params: {
        type: "object",
        properties: {
          id: { type: "number" },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
    handler: async (req, res) => {
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
    },
  });
}