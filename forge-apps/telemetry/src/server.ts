/**
 * Forge App: Live Telemetry Dashboard (Port 8087)
 * Dedicated Turso SQLite Database Instance with Isolated Observability
 */

import { join } from 'node:path';
import { createLogger, createSafeHandler } from '@forge/sdk';
import { getAstryxHeaderHtml, getAstryxStyles } from '@forge/ui';

const LOG_DIR = join(import.meta.dir, '..', 'logs');
const logger = createLogger('telemetry', LOG_DIR);
const PORT = Number(process.env.PORT || 8087);

function renderAppHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SG Forge - Telemetry Micro-App (Public)</title>
  <style>${getAstryxStyles()}</style>
</head>
<body>
  ${getAstryxHeaderHtml('TELEMETRY', 'PUBLIC DASHBOARD')}
  <main class="astryx-container">
    <div class="astryx-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h1 style="font-size: 1.5rem; color: var(--forge-text-main); margin: 0;">📡 Live Telemetry Dashboard</h1>
        <span style="font-size: 0.8rem; background: rgba(62, 207, 142, 0.15); color: var(--forge-primary); border: 1px solid var(--forge-primary); border-radius: 9999px; padding: 0.25rem 0.6rem; font-weight: 600;">🌐 PUBLIC ACCESS</span>
      </div>
      <p style="color: var(--forge-text-muted); margin-bottom: 1.25rem;">
        Public observability micro-app. No authentication or login required. Displays real-time telemetry metrics to all visitors.
      </p>
      <div style="background: var(--forge-bg-elevated); padding: 1rem; border-radius: var(--forge-radius); border: 1px solid var(--forge-border); margin-bottom: 1.5rem;">
        <span style="font-size: 0.85rem; color: var(--forge-primary);">Database: <code>telemetry_turso.db</code> (Isolated libSQL)</span>
      </div>
      <div style="display: flex; gap: 0.75rem;">
        <a href="/" class="astryx-btn btn-outline">&larr; Return to Platform Hub</a>
        <a href="/portal" class="astryx-btn btn-outline">Workspace Portal &rarr;</a>
      </div>
    </div>
  </main>
  <script>
    window.onerror = function(msg, src, lineno, colno, err) {
      fetch('/api/logs/browser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service: 'telemetry', severity: 'ERROR', message: msg, timestamp: new Date().toISOString() })
      }).catch(function() {});
    };
  </script>
</body>
</html>`;
}

export function startTelemetryServer(port: number = PORT) {
  const handler = createSafeHandler('telemetry', async (req: Request) => {
    const url = new URL(req.url);

    if (url.pathname === '/health' || url.pathname.endsWith('/health')) {
      const memMb = Number((process.memoryUsage().rss / (1024 * 1024)).toFixed(1));
      return Response.json({
        status: 'ok',
        app: 'telemetry',
        port,
        livez: true,
        readyz: true,
        memoryMb: memMb,
        db: 'turso_telemetry.db',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      });
    }

    if (url.pathname === '/api/logs/browser' && req.method === 'POST') {
      const body: any = await req.json().catch(() => ({}));
      logger.logBrowserEvent(body.severity || 'INFO', body.message || 'Browser event', body);
      return Response.json({ status: 'ok' });
    }

    return new Response(renderAppHtml(), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }, LOG_DIR);

  const server = Bun.serve({
    port,
    fetch: handler,
  });

  const shutdown = () => {
    logger.info('Received termination signal. Gracefully shutting down Telemetry Service...');
    server.stop(true);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  return server;
}

if (import.meta.main) {
  startTelemetryServer();
  logger.info(`[SYSTEM_BOOT] 📡 Telemetry microservice running on http://localhost:${PORT}`);
}

