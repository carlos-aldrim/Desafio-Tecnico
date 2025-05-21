import { buildApp } from "./app.js";

async function start() {
  const app = await buildApp();

  await app.listen({ port: 3000 });
  console.log("🚀 Server running at http://localhost:3000");
}

start();
