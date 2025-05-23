const Category = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
  },
};

export const Video = {
  type: "object",
  properties: {
    id: { type: "string" },
    title: { type: "string" },
    description: { type: "string" },
    url: { type: "string" },
    categoryId: { type: "string" },
    category: Category,
  },
};

export const CreateVideoBody = {
  type: "object",
  required: ["title", "url", "categoryId"],
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    url: { type: "string" },
    categoryId: { type: "string" },
  },
};

export const UpdateVideoBody = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    url: { type: "string" },
    categoryId: { type: "string" },
  },
};

export const VideosArray = {
  type: "array",
  items: Video,
};

export const MessageResponse = {
  type: "object",
  properties: {
    message: { type: "string" },
  },
};
