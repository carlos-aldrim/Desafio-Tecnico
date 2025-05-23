export const User = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    email: { type: "string" },
    role: { type: "string"}
  },
};

export const CreateUserBody = {
  type: "object",
  required: ["name", "email", "password"],
  properties: {
    name: { type: "string" },
    email: { type: "string" },
    password: { type: "string" },
  },
};

export const CreateUserResponse = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    email: { type: "string" },
  },
};

export const UsersArray = {
  type: "array",
  items: User,
};

