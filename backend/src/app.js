import Fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import cors from '@fastify/cors';
import { userRoutes } from './modules/users/user.controller.js';

export async function buildApp() {
  const app = Fastify({ logger: true });

  app.register(cors);
  app.register(fastifyJwt, { secret: 'your-secret-key' });

  app.register(await import('@fastify/swagger').then(m => m.default), {
    routePrefix: '/docs',
    swagger: {
      info: { title: 'API Docs', version: '1.0.0' },
    },
    exposeRoute: true,
  });

  app.get("/ping", async (request, reply) => {
    return { pong: true };
  });

  app.register(userRoutes);

  return app;
}
