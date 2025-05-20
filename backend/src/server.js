import { buildApp } from './app.js';

async function start() {
  const app = await buildApp();

  app.addHook('onRequest', (req, reply, done) => {
    app.log.info({ method: req.method, url: req.url });
    done();
  });

  app.listen({ port: 3000 }, () => {
    console.log('🚀 Server running at http://localhost:3000');
  });
}

start();
