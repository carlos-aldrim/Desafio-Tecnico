import { UserService } from "./user.service.js";

export async function userRoutes(app) {
  app.get("/users", async (req, res) => {
    const users = await UserService.listUsers();
    return res.send(users);
  });

  app.post("/users", async (req, res) => {
    try {
      const user = await UserService.createUser(req.body);
      return res.status(201).send(user);
    } catch (err) {
      return res.status(err.status || 500).send({ error: err.message });
    }
  });

  app.post("/login", async (req, reply) => {
    try {
      const user = await UserService.login(req.body);
      const token = app.jwt.sign({ id: user.id, email: user.email });
      return { token };
    } catch (err) {
      return reply.status(err.status || 500).send({ error: err.message });
    }
  });

  app.decorate("authenticate", async function (req, reply) {
    try {
      await req.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  app.get("/profile", { preHandler: [app.authenticate] }, async (req, res) => {
    try {
      const user = await UserService.getUserById(req.user.id);
      if (!user) return res.status(404).send({ error: "User not found" });
      return { user };
    } catch (err) {
      return res.status(500).send({ error: "Internal server error" });
    }
  });

  app.put(
    "/users/:id",
    { preHandler: [app.authenticate] },
    async (req, res) => {
      try {
        const updatedUser = await UserService.updateUser(
          req.params.id,
          req.body
        );
        return res.send(updatedUser);
      } catch (err) {
        return res.status(err.status || 500).send({ error: err.message });
      }
    }
  );

  app.delete(
    "/users/:id",
    { preHandler: [app.authenticate] },
    async (req, res) => {
      try {
        const result = await UserService.deleteUser(req.params.id);
        console.log('Delete result:', result);
        return res.send(result);
      } catch (err) {
        return res.status(err.status || 500).send({ error: err.message });
      }
    }
  );

  app.get("/admins", { preHandler: [app.authenticate] }, async (req, res) => {
    const admins = await UserService.listAdmins();
    return res.send(admins);
  });

  app.get(
    "/users/:id",
    { preHandler: [app.authenticate] },
    async (req, res) => {
      const user = await UserService.getUserById(req.params.id);
      if (!user) return res.status(404).send({ error: "User not found" });
      return res.send(user);
    }
  );
}
