import { prisma } from "../../utils/prisma.js";
import {
  validateVideoId,
  validateVideoPayload,
} from "../../validators/videoValidators.js";

export async function getAllVideos() {
  return prisma.video.findMany({
    include: { category: true },
  });
}

export async function getVideoById(id) {
  const videoId = validateVideoId(id);
  return prisma.video.findUnique({
    where: { id: videoId },
    include: { category: true },
  });
}

export async function createVideo({ title, description, url, categoryId }) {
  validateVideoPayload({ title, url, categoryId });

  return prisma.video.create({
    data: {
      title,
      description,
      url,
      categoryId,
    },
  });
}

export async function updateVideo(id, { title, description, url, categoryId }) {
  return prisma.video.update({
    where: { id: Number(id) },
    data: {
      title,
      description,
      url,
      categoryId,
    },
  });
}

export async function deleteVideo(id) {
  await prisma.comment.deleteMany({
    where: { videoId: Number(id) },
  });

  return prisma.video.delete({
    where: { id: Number(id) },
  });
}

export async function findVideo(id) {
  return prisma.video.findUnique({
    where: { id: Number(id) },
  });
}
