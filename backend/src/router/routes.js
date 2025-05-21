import { userRoutes } from "../modules/users/user.controller.js";
import { videoRoutes } from "../modules/videos/video.controller.js";
import { categoryRoutes } from "../modules/categories/category.controller.js";
import { commentRoutes } from "../modules/comments/comment.controller.js";

export async function registerRoutes(app) {
  app.register(userRoutes);
  app.register(videoRoutes);
  app.register(categoryRoutes);
  app.register(commentRoutes);
}
