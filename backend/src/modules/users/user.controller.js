import { prisma } from "../../utils/prisma.js";
import { hashPassword, comparePassword } from "../../utils/hash.js";

export async function userRoutes(app) {
  app.get("/users", async () => {
    return prisma.user.findMany();
  });

  app.post("/users", async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).send({ error: "Missing required fields" });
    }

    const validRoles = ["user", "admin"];
    const userRole = role || "user";

    if (!validRoles.includes(userRole)) {
      return res
        .status(400)
        .send({ error: "Invalid role. Must be 'user' or 'admin'." });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).send({ error: "Email already registered" });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword(password),
        role: userRole,
      },
    });

    return res.status(201).send(user);
  });

  app.post("/login", async (req, reply) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !comparePassword(password, user.password)) {
      return reply.status(401).send({ error: "Invalid credentials" });
    }

    const token = app.jwt.sign({ id: user.id, email: user.email });

    return { token };
  });

  app.decorate("authenticate", async function (req, reply) {
    try {
      await req.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  app.get("/profile", { preHandler: [app.authenticate] }, async (req, res) => {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  });

  app.put("/users/:id", { preHandler: [app.authenticate] }, async (req, res) => {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const dataToUpdate = {};
    if (name) dataToUpdate.name = name;
    if (email) dataToUpdate.email = email;
    if (password) dataToUpdate.password = hashPassword(password);
    if (role) dataToUpdate.role = role;

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: dataToUpdate,
    });

    return res.send(updatedUser);
  });

  app.delete("/users/:id", { preHandler: [app.authenticate] }, async (req, res) => {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    await prisma.comment.deleteMany({ where: { userId: Number(id) } });

    await prisma.user.delete({ where: { id: Number(id) } });
    return res.send({ message: "User deleted successfully" });
  });

  app.get("/admins", { preHandler: [app.authenticate] }, async (req, res) => {
    const admins = await prisma.user.findMany({
      where: { role: "admin" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return res.send(admins);
  });

  app.get("/users/:id", { preHandler: [app.authenticate] }, async (req, res) => {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    return res.send(user);
  });
}