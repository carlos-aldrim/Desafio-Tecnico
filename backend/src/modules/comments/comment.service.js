import { prisma } from "../../utils/prisma.js";

export async function getAllComments() {
  return prisma.comment.findMany({
    include: { user: true, video: true },
  });
}

export async function getCommentsByVideoId(videoId) {
  return prisma.comment.findMany({
    where: { videoId: Number(videoId) },
    include: { user: true },
  });
}

export async function createComment({ userId, videoId, message }) {
  return prisma.comment.create({
    data: {
      userId,
      videoId,
      message,
      timestamp: new Date(),
    },
  });
}

export async function deleteCommentById(id) {
  return prisma.comment.delete({
    where: { id: Number(id) },
  });
}