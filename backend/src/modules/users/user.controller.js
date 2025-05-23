import { UserService } from "./user.service.js";
import {
  CreateUserBody,
  CreateUserResponse,
  UsersArray,
  User,
} from "./user.schema.js";

export async function userRoutes(app) {
  app.get("/users", {
    schema: {
      description: "Lista todos os usuários",
      tags: ["Users"],
      response: {
        200: UsersArray,
      },
    },
    handler: async (req, res) => {
      const users = await UserService.listUsers();
      return res.send(users);
    },
  });

  app.post("/users", {
    schema: {
      description: "Cria um novo usuário",
      tags: ["Users"],
      body: CreateUserBody,
      response: {
        201: CreateUserResponse,
      },
    },
    handler: async (req, res) => {
      try {
        const user = await UserService.createUser(req.body);
        return res.status(201).send(user);
      } catch (err) {
        return res.status(err.status || 500).send({ error: err.message });
      }
    },
  });

  app.post("/login", {
    schema: {
      description: "Realiza login e retorna um token JWT",
      tags: ["Users"],
    },
    handler: async (req, reply) => {
      try {
        const user = await UserService.login(req.body);
        const token = app.jwt.sign({ id: user.id, email: user.email });
        return { token };
      } catch (err) {
        return reply.status(err.status || 500).send({ error: err.message });
      }
    },
  });

  app.decorate("authenticate", async function (req, reply) {
    try {
      await req.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  app.get("/profile", {
    preHandler: [app.authenticate],
    schema: {
      description: "Retorna o perfil do usuário autenticado",
      tags: ["Users"],
      response: {
        200: {
          type: "object",
          properties: {
            user: User,
          },
        },
      },
    },
    handler: async (req, res) => {
      try {
        const user = await UserService.getUserById(req.user.id);
        if (!user) return res.status(404).send({ error: "User not found" });
        return { user };
      } catch (err) {
        return res.status(500).send({ error: "Internal server error" });
      }
    },
  });

  app.put("/users/:id", {
    preHandler: [app.authenticate],
    schema: {
      description: "Atualiza um usuário pelo ID",
      tags: ["Users"],
      params: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
      },
      response: {
        200: User,
      },
    },
    handler: async (req, res) => {
      try {
        const updatedUser = await UserService.updateUser(req.params.id, req.body);
        return res.send(updatedUser);
      } catch (err) {
        return res.status(err.status || 500).send({ error: err.message });
      }
    },
  });

  app.delete("/users/:id", {
    preHandler: [app.authenticate],
    schema: {
      description: "Remove um usuário pelo ID",
      tags: ["Users"],
      params: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
    handler: async (req, res) => {
      try {
        const result = await UserService.deleteUser(req.params.id);
        return res.send(result);
      } catch (err) {
        return res.status(err.status || 500).send({ error: err.message });
      }
    },
  });

  app.get("/admins", {
    preHandler: [app.authenticate],
    schema: {
      description: "Lista os usuários administradores",
      tags: ["Users"],
      response: {
        200: UsersArray,
      },
    },
    handler: async (req, res) => {
      const admins = await UserService.listAdmins();
      return res.send(admins);
    },
  });

  app.get("/users/:id", {
    preHandler: [app.authenticate],
    schema: {
      description: "Busca um usuário pelo ID",
      tags: ["Users"],
      params: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
      },
      response: {
        200: User,
        404: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
    handler: async (req, res) => {
      const user = await UserService.getUserById(req.params.id);
      if (!user) return res.status(404).send({ error: "User not found" });
      return res.send(user);
    },
  });
}
