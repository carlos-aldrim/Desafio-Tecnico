const User = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    email: { type: "string" },
  },
};

const Video = {
  type: "object",
  properties: {
    id: { type: "string" },
    title: { type: "string" },
    description: { type: "string" },
  },
};

export const Comment = {
  type: "object",
  properties: {
    id: { type: "string" },
    user: User,
    video: Video,
    message: { type: "string" },
    createdAt: { type: "string", format: "date-time" },
  },
};
export const CreateCommentBody = {
  type: "object",
  required: ["userId", "videoId", "message"],
  properties: {
    userId: { type: "string" },
    videoId: { type: "string" },
    message: { type: "string" },
  },
};

export const CreateCommentResponse = Comment;

export const CommentsArray = {
  type: "array",
  items: Comment,
};
