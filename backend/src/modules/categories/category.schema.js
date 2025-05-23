export const Category = {
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" },
  },
};

export const CreateCategoryBody = {
  type: "object",
  required: ["name"],
  properties: {
    name: { type: "string" },
  },
};

export const CreateCategoryResponse = Category;

export const CategoriesArray = {
  type: "array",
  items: Category,
};

export const CategoryWithVideos = {
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    videos: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "number" },
          title: { type: "string" },
          url: { type: "string" },
        },
      },
    },
  },
};
