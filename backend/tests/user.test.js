import request from "supertest";
import { buildApp } from "../src/app.js";
import { prisma } from "../src/utils/prisma.js";
import { hashPassword } from "../src/utils/hash.js";

describe("User Tests", () => {
  let app;

  beforeAll(async () => {
    app = await buildApp({ isTest: true });
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [
            "joana.silva@example.com",
            "maria.santos@example.com",
            "carlos.pereira@example.com",
            "ana.magalhaes@example.com",
            "renato.oliveira@example.com",
            "lucas.ferreira@example.com",
            "teste.missing@example.com",
            "invalido.role@example.com",
            "admin.teste@example.com",
            "user.teste@example.com",
            "nao.existe@example.com",
          ],
        },
      },
    });
  });

  test("Criação de usuário com sucesso", async () => {
    const res = await request(app.server).post("/users").send({
      name: "Joana Silva",
      email: "joana.silva@example.com",
      password: "SenhaSegura123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.email).toBe("joana.silva@example.com");
  });

  test("Não deve permitir e-mail duplicado", async () => {
    await prisma.user.create({
      data: {
        name: "Maria Santos",
        email: "maria.santos@example.com",
        password: hashPassword("Senha123!"),
      },
    });

    const res = await request(app.server).post("/users").send({
      name: "Maria S.",
      email: "maria.santos@example.com",
      password: "OutraSenha456",
    });

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty("error", "Email already registered");
  });

  test("Campos obrigatórios ausentes", async () => {
    const res = await request(app.server).post("/users").send({
      email: "teste.missing@example.com",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Missing required fields");
  });

  test("Role inválida", async () => {
    const res = await request(app.server).post("/users").send({
      name: "Ana Magalhães",
      email: "invalido.role@example.com",
      password: "Segura123",
      role: "superuser",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid role. Must be 'user' or 'admin'.");
  });

  test("Login com sucesso", async () => {
    await prisma.user.create({
      data: {
        name: "Carlos Pereira",
        email: "carlos.pereira@example.com",
        password: hashPassword("Senha123@"),
      },
    });

    const res = await request(app.server).post("/login").send({
      email: "carlos.pereira@example.com",
      password: "Senha123@",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("Login com senha inválida", async () => {
    await prisma.user.create({
      data: {
        name: "Carlos Pereira",
        email: "carlos.pereira@example.com",
        password: hashPassword("Senha123@"),
      },
    });

    const res = await request(app.server).post("/login").send({
      email: "carlos.pereira@example.com",
      password: "SenhaErrada",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "Invalid credentials");
  });

  test("Login com usuário inexistente", async () => {
    const res = await request(app.server).post("/login").send({
      email: "nao.existe@example.com",
      password: "Senha123!",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "Invalid credentials");
  });

  test("Perfil autenticado", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Renato Oliveira",
        email: "renato.oliveira@example.com",
        password: hashPassword("Senha123$"),
      },
    });

    const login = await request(app.server).post("/login").send({
      email: "renato.oliveira@example.com",
      password: "Senha123$",
    });

    const res = await request(app.server)
      .get("/profile")
      .set("Authorization", `Bearer ${login.body.token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe("renato.oliveira@example.com");
  });

  test("Negar /profile sem token", async () => {
    const res = await request(app.server).get("/profile");
    expect(res.statusCode).toBe(401);
  });

  test("Negar /profile com token inválido", async () => {
    const res = await request(app.server)
      .get("/profile")
      .set("Authorization", "Bearer token.invalido");

    expect(res.statusCode).toBe(401);
  });

  test("Atualização de nome com sucesso", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Lucas Ferreira",
        email: "lucas.ferreira@example.com",
        password: hashPassword("MinhaSenha123"),
      },
    });

    const login = await request(app.server).post("/login").send({
      email: "lucas.ferreira@example.com",
      password: "MinhaSenha123",
    });

    const res = await request(app.server)
      .put(`/users/${user.id}`)
      .set("Authorization", `Bearer ${login.body.token}`)
      .send({ name: "Lucas F. Atualizado" });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Lucas F. Atualizado");
  });

  test("Atualizar usuário inexistente", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Temp User",
        email: "user.teste@example.com",
        password: hashPassword("123Senha"),
      },
    });

    const login = await request(app.server).post("/login").send({
      email: "user.teste@example.com",
      password: "123Senha",
    });

    const res = await request(app.server)
      .put(`/users/999999`)
      .set("Authorization", `Bearer ${login.body.token}`)
      .send({ name: "Novo Nome" });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "User not found");

    await prisma.user.delete({ where: { id: user.id } });
  });

  test("Deletar usuário com sucesso", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Ana Magalhães",
        email: "ana.magalhaes@example.com",
        password: hashPassword("Senha456@"),
      },
    });

    const login = await request(app.server).post("/login").send({
      email: "ana.magalhaes@example.com",
      password: "Senha456@",
    });

    const res = await request(app.server)
      .delete(`/users/${user.id}`)
      .set("Authorization", `Bearer ${login.body.token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User deleted successfully");
  });

  test("Listar apenas admins", async () => {
    const admin = await prisma.user.create({
      data: {
        name: "Admin Teste",
        email: "admin.teste@example.com",
        password: hashPassword("Admin123!"),
        role: "admin",
      },
    });

    const user = await prisma.user.create({
      data: {
        name: "Usuário Comum",
        email: "user.teste@example.com",
        password: hashPassword("User123!"),
        role: "user",
      },
    });

    const login = await request(app.server).post("/login").send({
      email: "admin.teste@example.com",
      password: "Admin123!",
    });

    const res = await request(app.server)
      .get("/admins")
      .set("Authorization", `Bearer ${login.body.token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.every((u) => u.role === "admin")).toBe(true);

    await prisma.user.delete({ where: { id: admin.id } });
    await prisma.user.delete({ where: { id: user.id } });
  });

  test("Negar acesso a /admins sem token", async () => {
    const res = await request(app.server).get("/admins");
    expect(res.statusCode).toBe(401);
  });
});
