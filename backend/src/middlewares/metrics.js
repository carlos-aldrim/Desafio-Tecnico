import client from "prom-client";

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestDurationMicroseconds = new client.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "code"],
  buckets: [50, 100, 200, 300, 400, 500, 1000],
});

export async function metricsMiddleware(app) {
  app.addHook("onRequest", async (req, reply) => {
    req.startTime = process.hrtime();
  });

  app.addHook("onResponse", async (req, reply) => {
    if (req.startTime) {
      const diff = process.hrtime(req.startTime);
      const responseTimeInMs = diff[0] * 1e3 + diff[1] / 1e6;

      app.log.info(
        {
          reqId: req.id,
          trace_id: req.headers["x-trace-id"],
          method: req.method,
          url: req.url,
          statusCode: reply.statusCode,
          responseTime: responseTimeInMs.toFixed(3),
        },
        "request completed"
      );
    }
  });
}