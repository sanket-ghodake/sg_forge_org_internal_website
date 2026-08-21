/**
 * @forge/dev-dashboard - Developer Monitoring & Live Log Dashboard
 * Serves on Port 3002 (Ingress /devcenter via Reverse Proxy)
 * Meta Astryx Enterprise Baseline (v2.0.0 LTS)
 */

import { getAstryxHeaderHtml, getAstryxStyles } from '@forge/ui';
import { createLogger, createSafeHandler } from '@forge/sdk';

const PORT = Number(process.env.DEV_DASHBOARD_PORT || process.env.PORT || 3002);
const logger = createLogger('dev-dashboard');

function renderDashboardHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SG Forge - Developer Dashboard & Diagnostics</title>
  <style>${getAstryxStyles()}</style>
</head>
<body>
  ${getAstryxHeaderHtml('DEV', 'MONITORING DASHBOARD')}
  <main class="astryx-container">
    <div class="astryx-card" style="margin-bottom: 1.5rem;">
      <h1 style="font-size: 1.75rem; margin-bottom: 0.5rem; color: var(--forge-text-main);">📊 Developer Monitoring Dashboard</h1>
      <p style="color: var(--forge-text-muted); margin-bottom: 1.5rem;">Real-time container metrics, live streaming system logs, and Turso database health diagnostics.</p>
      <div style="display: flex; gap: 0.75rem;">
        <a href="/" class="astryx-btn btn-outline">&larr; Return to Platform Hub</a>
        <a href="/gateway" class="astryx-btn btn-outline">Developer Hub &rarr;</a>
      </div>
    </div>

    <div class="astryx-grid">
      <div class="astryx-card">
        <h3 style="color: var(--forge-text-main); margin-bottom: 0.5rem;">📈 Resource Telemetry</h3>
        <p style="font-size: 0.9rem; color: var(--forge-text-muted);">Real-time memory, CPU, and active connection tracking across all services.</p>
      </div>
      <div class="astryx-card">
        <h3 style="color: var(--forge-text-main); margin-bottom: 0.5rem;">📜 Live Log Streams</h3>
        <p style="font-size: 0.9rem; color: var(--forge-text-muted);">Unified live stdout/stderr tailing with request trace IDs.</p>
      </div>
      <div class="astryx-card">
        <h3 style="color: var(--forge-text-main); margin-bottom: 0.5rem;">🗄️ Turso DB Explorer</h3>
        <p style="font-size: 0.9rem; color: var(--forge-text-muted);">Inspect isolated Turso SQLite schemas and active per-app connections.</p>
      </div>
    </div>
  </main>
</body>
</html>`;
}

export function startDevDashboardServer(port: number = PORT) {
  const handler = createSafeHandler('dev-dashboard', async (req: Request) => {
    const url = new URL(req.url);
    if (url.pathname.endsWith('/health')) {
      return Response.json({ status: 'ok', service: 'dev-dashboard', port, uptime: process.uptime() });
    }
    return new Response(renderDashboardHtml(), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  });

  return Bun.serve({
    port,
    fetch: handler,
  });
}

if (import.meta.main) {
  startDevDashboardServer();
  logger.info(`📊 Developer Dashboard running on http://localhost:${PORT}`);
}
