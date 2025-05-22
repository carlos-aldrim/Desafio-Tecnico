const validRoles = ["user", "admin"];

export function validateRequiredFields({ name, email, password }) {
  if (!name || !email || !password) {
    throw {
      status: 400,
      message: "Missing required fields",
    };
  }
}

export function validateUserRole(role) {
  if (role && !validRoles.includes(role)) {
    throw {
      status: 400,
      message: "Invalid role. Must be 'user' or 'admin'.",
    };
  }
}

export function validateUserExists(user, message = "User not found") {
  if (!user) {
    throw {
      status: 404,
      message,
    };
  }
}
