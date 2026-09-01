/**
 * @forge/dev-dashboard - Developer Monitoring & Live Telemetry Server (2026 LTS)
 * Serves on Port 3002 (Ingress /devcenter via Reverse Proxy)
 * Google SRE Observability & Meta Astryx Enterprise Baseline (v2.0.0 LTS)
 */

import { createLogger, createSafeHandler, handleBrandAssetRequest } from '@forge/sdk';
import { handleApiRequest } from './backend/api-handlers';
import { renderDashboardHtml } from './frontend/ui-renderer';
import { platformDb } from './db';

const PORT = Number(process.env.DEV_DASHBOARD_PORT || process.env.PORT || 3002);
const logger = createLogger('dev-dashboard');

export function startDevDashboardServer(port: number = PORT) {
  const handler = createSafeHandler('dev-dashboard', async (req: Request) => {
    const startMs = performance.now();
    const url = new URL(req.url);

    // 0. Static Brand Asset Interceptor
    const assetRes = handleBrandAssetRequest(req);
    if (assetRes) return assetRes;

    // 1. Dual-Probe Health Probes
    if (url.pathname.endsWith('/health') || url.pathname.endsWith('/livez') || url.pathname.endsWith('/readyz')) {
      const res = Response.json({
        status: 'ok',
        service: 'dev-dashboard',
        port,
        uptime: process.uptime(),
        memoryMb: Number((process.memoryUsage().rss / (1024 * 1024)).toFixed(1)),
        timestamp: Date.now(),
      });
      platformDb.recordTraffic('dev-dashboard', url.pathname, req.method, 200, Number((performance.now() - startMs).toFixed(2)));
      return res;
    }

    // 2. API Endpoints
    const apiResponse = await handleApiRequest(req, url);
    if (apiResponse) {
      if (!url.pathname.includes('/api/logs/stream') && !url.pathname.includes('/api/analytics/traffic')) {
        const duration = Number((performance.now() - startMs).toFixed(2));
        platformDb.recordTraffic('dev-dashboard', url.pathname, req.method, apiResponse.status || 200, duration);
      }
      return apiResponse;
    }

    // 3. UI Dashboard Delivery
    const duration = Number((performance.now() - startMs).toFixed(2));
    platformDb.recordTraffic('dev-dashboard', url.pathname, req.method, 200, duration);
    return new Response(renderDashboardHtml(), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  });

  const server = Bun.serve({
    port,
    fetch: handler,
  });

  const shutdown = () => {
    logger.info('Received termination signal. Gracefully shutting down Developer Dashboard...');
    server.stop(true);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  return server;
}

if (import.meta.main) {
  startDevDashboardServer();
  logger.info(`📊 Developer Dashboard running on http://localhost:${PORT}`);
}
