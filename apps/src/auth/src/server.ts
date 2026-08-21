#!/usr/bin/env bun
/**
 * SG Forge - Central Identity & Auth Service
 * Stateless session renewal, user directory & scoped JWT token issuer.
 */

import { createLogger, createSafeHandler } from '@forge/sdk';
import { getAstryxHeaderHtml, getAstryxStyles } from '@forge/ui';

const logger = createLogger('auth-service');
const PORT = Number(process.env.AUTH_PORT || 3004);

export function startAuthServer(port: number = PORT) {
  const handler = createSafeHandler('auth-service', async (req: Request) => {
    const url = new URL(req.url);

    if (url.pathname === '/health' || url.pathname === '/auth/health') {
      return Response.json({
        status: 'ok',
        service: 'auth',
        port,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      });
    }

    return new Response(
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Central Identity & Auth Service - SG Forge</title>
  <style>
    ${getAstryxStyles()}
  </style>
</head>
<body>
  ${getAstryxHeaderHtml('AUTH', 'CENTRAL IDENTITY')}

  <main class="astryx-container" style="max-width: 580px; margin-top: 3rem;">
    <div class="astryx-card" style="text-align: center; padding: 2.5rem 2rem;">
      <div style="display: inline-block; margin-bottom: 1rem;">
        <span class="astryx-badge badge-online">
          <span class="badge-dot"></span> Port :${port} &bull; Active
        </span>
      </div>
      <h1 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--forge-text-main);">Central Identity & Auth Service</h1>
      <p style="font-size: 0.9rem; color: var(--forge-text-muted); margin-bottom: 2rem;">
        Manages scoped JWT issuance, role-based access control (RBAC), and session validation for all Forge Apps.
      </p>

      <div style="display: flex; gap: 1rem; justify-content: center;">
        <a href="/" class="astryx-btn btn-outline">&larr; Return to Platform Hub</a>
        <a href="/portal" class="astryx-btn btn-primary" target="_blank" rel="noopener noreferrer">Open Workspace &rarr;</a>
      </div>
    </div>
  </main>
</body>
</html>`,
      { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  });

  return Bun.serve({
    port,
    fetch: handler,
  });
}

if (import.meta.main) {
  startAuthServer();
  logger.info(`🔒 Auth Service running on http://localhost:${PORT}`);
}
