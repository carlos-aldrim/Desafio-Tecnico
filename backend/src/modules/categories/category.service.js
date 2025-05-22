import { prisma } from "../../utils/prisma.js";
import { validateCategoryId, validateCategoryName } from "../../validators/categoryValidators.js";

export async function getAllCategories() {
  return prisma.category.findMany();
}

export async function createCategory(name) {
  const validName = validateCategoryName(name);

  const category = await prisma.category.create({ data: { name: validName } });
  return category;
}

export async function getCategoryById(categoryId) {
  const validId = validateCategoryId(categoryId);

  const categoryWithVideos = await prisma.category.findUnique({
    where: { id: validId },
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
    throw { status: 404, message: "Category not found" };
  }

  return categoryWithVideos;
}

export async function updateCategory(categoryId, name) {
  const validId = validateCategoryId(categoryId);
  const validName = validateCategoryName(name);

  const existingCategory = await prisma.category.findUnique({
    where: { id: validId },
  });

  if (!existingCategory) {
    throw { status: 404, message: "Category not found" };
  }

  const updatedCategory = await prisma.category.update({
    where: { id: validId },
    data: { name: validName },
  });

  return updatedCategory;
}

export async function deleteCategory(categoryId) {
  const validId = validateCategoryId(categoryId);

  const existingCategory = await prisma.category.findUnique({
    where: { id: validId },
    include: { videos: true },
  });

  if (!existingCategory) {
    throw { status: 404, message: "Category not found" };
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
    where: { id: validId },
  });

  return { message: "Category deleted successfully" };
}
