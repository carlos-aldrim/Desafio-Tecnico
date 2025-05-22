export function validateVideoId(id) {
  const parsedId = Number(id);
  if (isNaN(parsedId) || parsedId <= 0) {
    const error = new Error("Invalid video ID");
    error.status = 400;
    throw error;
  }
  return parsedId;
}

export function validateVideoPayload({ title, url, categoryId }) {
  const errors = [];

  if (!title || typeof title !== "string") {
    errors.push("Title is required and must be a string");
  }

  if (!url || typeof url !== "string") {
    errors.push("URL is required and must be a string");
  }

  if (!categoryId || isNaN(Number(categoryId))) {
    errors.push("Category ID is required and must be a number");
  }

  if (errors.length) {
    const error = new Error(errors.join("; "));
    error.status = 400;
    throw error;
  }
}
