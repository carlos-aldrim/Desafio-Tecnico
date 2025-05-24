import { startTracing } from './otel.js';
import { buildApp } from "./app.js";
import { prisma } from "./utils/prisma.js";
import { hashPassword } from "./utils/hash.js";

async function createDefaultAdmin() {
  const existingAdmin = await prisma.user.findFirst({
    where: { role: "admin", email: "admin@admin.com" },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@admin.com",
        password: hashPassword("admin123"),
        role: "admin",
      },
    });
    console.log("🛠️ Admin padrão criado com sucesso.");
  } else {
    console.log("✅ Admin padrão já existe.");
  }
}

async function start() {
  await startTracing();

  const app = await buildApp();

  await createDefaultAdmin();

  const PORT = process.env.PORT || 3000;
  await app.listen({ port: PORT, host: '0.0.0.0' });
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);

  process.on('SIGTERM', async () => {
    process.exit(0);
  });
}

start();