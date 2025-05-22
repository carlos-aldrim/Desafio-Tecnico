import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { JaegerExporter } from "@opentelemetry/exporter-jaeger";

export async function startTracing() {
  const jaegerExporter = new JaegerExporter({
    endpoint: "http://localhost:14268/api/traces",
  });

  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [SemanticResourceAttributes.SERVICE_NAME]: "my-fastify-service",
    }),
    traceExporter: jaegerExporter,
    traceExporter: new JaegerExporter(),
    instrumentations: [getNodeAutoInstrumentations()],
  });

  console.log("Inicializando tracing...");

  await sdk.start();

  console.log("Tracing initialized");
}
