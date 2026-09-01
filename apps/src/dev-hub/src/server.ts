/**
 * @forge/dev-hub - Developer Playground & SDK Documentation Gateway
 * Serves on Port 3003 (Ingress /gateway via Reverse Proxy)
 * Meta Astryx Enterprise Baseline (v2.0.0 LTS)
 */

import { createLogger, createSafeHandler } from '@forge/sdk';
import { renderDevHubHtml } from './frontend/hub-view';

const PORT = Number(process.env.DEV_HUB_PORT || process.env.PORT || 3003);
const logger = createLogger('dev-hub');

export function startDevHubServer(port: number = PORT) {
  const handler = createSafeHandler('dev-hub', async (req: Request) => {
    const url = new URL(req.url);

    if (url.pathname.endsWith('/health')) {
      return Response.json({
        status: 'ok',
        service: 'dev-hub',
        port,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      });
    }

    return new Response(renderDevHubHtml(), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  });

  const server = Bun.serve({
    port,
    fetch: handler,
  });

  const shutdown = () => {
    logger.info('Received termination signal. Gracefully shutting down Dev Hub...');
    server.stop(true);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  return server;
}

if (import.meta.main) {
  startDevHubServer();
  logger.info(`📚 Developer Hub running on http://localhost:${PORT}`);
}
