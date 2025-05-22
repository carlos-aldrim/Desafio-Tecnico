export function validateCategoryId(id) {
  const categoryId = Number(id);

  if (!categoryId || isNaN(categoryId) || categoryId <= 0) {
    throw { status: 400, message: "Invalid ID" };
  }

  return categoryId;
}

export function validateCategoryName(name) {
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    throw { status: 400, message: "Name is required" };
  }

  return name.trim();
}
