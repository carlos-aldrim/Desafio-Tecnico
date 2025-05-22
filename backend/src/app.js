import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import cors from "@fastify/cors";
import { registerRoutes } from "./router/routes.js";
import { metricsMiddleware } from './middlewares/metrics.js';

export async function buildApp(options = {}) {
  const app = Fastify({
    logger: options.isTest
      ? false
      : {
          transport: {
            targets: [
              {
                target: "pino-pretty",
                options: {
                  colorize: true,
                  translateTime: "HH:MM:ss",
                  ignore: "pid,hostname",
                },
                level: "info",
              },
              {
                target: "pino/file",
                options: {
                  destination: "./logs/app.log",
                  mkdir: true,
                },
                level: "info",
              },
            ],
          },
        },
  });

  await app.register(cors, {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  });

  await app.register(fastifyJwt, { secret: "your-secret-key" });

  await app.register(await import("@fastify/swagger").then((m) => m.default), {
    routePrefix: "/docs",
    swagger: {
      info: { title: "API Docs", version: "1.0.0" },
    },
    exposeRoute: true,
  });

  app.addHook("onRequest", (req, reply, done) => {
    app.log.info({ method: req.method, url: req.url }, "New request");
    done();
  });

  await registerRoutes(app);

  await metricsMiddleware(app);

  await app.ready();

  return app;
}