/**
 * @forge/dev-hub - Developer Playground & SDK Documentation Gateway
 * Serves on Port 3003 (Ingress /gateway via Reverse Proxy)
 * Meta Astryx Enterprise Baseline (v2.0.0 LTS)
 */

import { getAstryxHeaderHtml, getAstryxStyles } from '@forge/ui';
import { createLogger, createSafeHandler } from '@forge/sdk';

const PORT = Number(process.env.DEV_HUB_PORT || process.env.PORT || 3003);
const logger = createLogger('dev-hub');

function renderDevHubHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SG Forge - Developer Hub & SDK Playground</title>
  <style>${getAstryxStyles()}</style>
</head>
<body>
  ${getAstryxHeaderHtml('HUB', 'DEVELOPER GATEWAY')}
  <main class="astryx-container">
    <div class="astryx-card" style="margin-bottom: 1.5rem;">
      <h1 style="font-size: 1.75rem; margin-bottom: 0.5rem; color: var(--forge-text-main);">📚 Developer Hub & SDK Playground</h1>
      <p style="color: var(--forge-text-muted); margin-bottom: 1.5rem;">Interactive API playground, Docker micro-app scaffolding templates, and Forge SDK contracts.</p>
      <div style="display: flex; gap: 0.75rem;">
        <a href="/" class="astryx-btn btn-outline">&larr; Return to Platform Hub</a>
        <a href="/portal" class="astryx-btn btn-outline">Portal &rarr;</a>
      </div>
    </div>

    <div class="astryx-grid">
      <div class="astryx-card">
        <h3 style="color: var(--forge-text-main); margin-bottom: 0.5rem;">📦 Forge SDK Contract</h3>
        <p style="font-size: 0.9rem; color: var(--forge-text-muted);">PostMessage handshake protocol and scoped token validation specifications.</p>
      </div>
      <div class="astryx-card">
        <h3 style="color: var(--forge-text-main); margin-bottom: 0.5rem;">🐳 Docker App Templates</h3>
        <p style="font-size: 0.9rem; color: var(--forge-text-muted);">Lightweight boilerplates for Python (FastAPI), Go (Fiber), and TypeScript micro-apps.</p>
      </div>
      <div class="astryx-card">
        <h3 style="color: var(--forge-text-main); margin-bottom: 0.5rem;">⚡ 1-Command Scaffolding</h3>
        <p style="font-size: 0.9rem; color: var(--forge-text-muted);">Run <code>./run.sh create-app &lt;name&gt;</code> to spin up a fully isolated service.</p>
      </div>
    </div>
  </main>
</body>
</html>`;
}

export function startDevHubServer(port: number = PORT) {
  const handler = createSafeHandler('dev-hub', async (req: Request) => {
    const url = new URL(req.url);
    if (url.pathname.endsWith('/health')) {
      return Response.json({ status: 'ok', service: 'dev-hub', port, uptime: process.uptime() });
    }
    return new Response(renderDevHubHtml(), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  });

  return Bun.serve({
    port,
    fetch: handler,
  });
}

if (import.meta.main) {
  startDevHubServer();
  logger.info(`📚 Developer Hub running on http://localhost:${PORT}`);
}
