/**
 * @forge/portal - Main Workspace Portal & Org Canvas Service
 * Serves on Port 3001 (Ingress /portal via Reverse Proxy)
 * Meta Astryx Enterprise Baseline (v2.0.0 LTS)
 */

import { getAstryxHeaderHtml, getAstryxStyles } from '@forge/ui';
import { createLogger, createSafeHandler } from '@forge/sdk';

const PORT = Number(process.env.PORTAL_PORT || process.env.PORT || 3001);
const logger = createLogger('portal-service');

function renderPortalHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SG Forge Portal - Main Workspace & Org Canvas</title>
  <style>${getAstryxStyles()}</style>
</head>
<body>
  ${getAstryxHeaderHtml('PORTAL', 'MAIN WORKSPACE')}
  <main class="astryx-container">
    <div class="astryx-card" style="margin-bottom: 1.5rem;">
      <h1 style="font-size: 1.75rem; margin-bottom: 0.5rem; color: var(--forge-text-main);">🏢 Main Portal & Org Canvas</h1>
      <p style="color: var(--forge-text-muted); margin-bottom: 1.5rem;">Interactive 2D organizational workspace, employee directory, and Forge App launcher.</p>
      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
        <a href="/" class="astryx-btn btn-outline">&larr; Return to Platform Hub</a>
        <a href="/devcenter" class="astryx-btn btn-outline">Developer Center &rarr;</a>
      </div>
    </div>

    <div class="astryx-grid">
      <div class="astryx-card">
        <h3 style="color: var(--forge-text-main); margin-bottom: 0.5rem;">🌐 Semantic Org Canvas</h3>
        <p style="font-size: 0.9rem; color: var(--forge-text-muted);">Visual 2D zoomable graph rendering Macro, Meso, and Micro organizational units.</p>
      </div>
      <div class="astryx-card">
        <h3 style="color: var(--forge-text-main); margin-bottom: 0.5rem;">🧩 Forge App Launcher</h3>
        <p style="font-size: 0.9rem; color: var(--forge-text-muted);">Role-aware sandbox micro-app launcher with OAuth & short-lived token scoping.</p>
      </div>
      <div class="astryx-card">
        <h3 style="color: var(--forge-text-main); margin-bottom: 0.5rem;">🛡️ Hierarchical RBAC</h3>
        <p style="font-size: 0.9rem; color: var(--forge-text-muted);">Department clearance, dynamic metadata, and app access approval queues.</p>
      </div>
    </div>
  </main>
</body>
</html>`;
}

export function startPortalServer(port: number = PORT) {
  const handler = createSafeHandler('portal-service', async (req: Request) => {
    const url = new URL(req.url);
    if (url.pathname.endsWith('/health')) {
      return Response.json({ status: 'ok', service: 'portal', port, uptime: process.uptime() });
    }
    return new Response(renderPortalHtml(), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  });

  return Bun.serve({
    port,
    fetch: handler,
  });
}

if (import.meta.main) {
  startPortalServer();
  logger.info(`🏢 Main Portal running on http://localhost:${PORT}`);
}
