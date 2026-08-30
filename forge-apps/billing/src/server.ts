/**
 * Forge App: Invoicing & Billing Service (Port 8086)
 * Dedicated Turso SQLite Database Instance with Isolated Observability
 */

import { join } from 'node:path';
import { authGuard, createLogger, createSafeHandler } from '@forge/sdk';
import { getAstryxHeaderHtml, getAstryxStyles } from '@forge/ui';
import type { AuthUser } from '@forge/types';

const LOG_DIR = join(import.meta.dir, '..', 'logs');
const logger = createLogger('billing', LOG_DIR);
const PORT = Number(process.env.PORT || 8086);

function renderAppHtml(user?: AuthUser): string {
  const userName = user?.displayName || 'Billing Administrator';
  const userEmail = user?.email || 'billing.admin@forge.internal';
  const userRole = user?.roles?.[0] || 'Billing Admin Clearance';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SG Forge - Billing Micro-App</title>
  <style>${getAstryxStyles()}</style>
</head>
<body>
  ${getAstryxHeaderHtml('BILLING', 'LEDGER APP')}
  <main class="astryx-container">
    <div class="astryx-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h1 style="font-size: 1.5rem; color: var(--forge-text-main); margin: 0;">🧾 Invoicing & Billing Service</h1>
        <span style="font-size: 0.8rem; background: rgba(62, 207, 142, 0.15); color: var(--forge-primary); border: 1px solid var(--forge-primary); border-radius: 9999px; padding: 0.25rem 0.6rem; font-weight: 600;">🛡️ ${userRole}</span>
      </div>
      <p style="color: var(--forge-text-muted); margin-bottom: 1.25rem;">
        High-security financial ledger accessible only by billing administrators. Verified session for <strong>${userName}</strong> (<code>${userEmail}</code>).
      </p>
      <div style="background: var(--forge-bg-elevated); padding: 1rem; border-radius: var(--forge-radius); border: 1px solid var(--forge-border); margin-bottom: 1.5rem;">
        <span style="font-size: 0.85rem; color: var(--forge-primary);">Database: <code>billing_turso.db</code> (Isolated libSQL)</span>
      </div>
      <div style="display: flex; gap: 0.75rem;">
        <a href="/portal" class="astryx-btn btn-outline">&larr; Return to Workspace Portal</a>
        <a href="/" class="astryx-btn btn-outline">Platform Hub &rarr;</a>
      </div>
    </div>
  </main>
  <script>
    window.onerror = function(msg, src, lineno, colno, err) {
      fetch('/api/logs/browser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service: 'billing', severity: 'ERROR', message: msg, timestamp: new Date().toISOString() })
      }).catch(function() {});
    };
  </script>
</body>
</html>`;
}

export function startBillingServer(port: number = PORT) {
  const handler = createSafeHandler('billing', async (req: Request) => {
    const url = new URL(req.url);

    if (url.pathname === '/health' || url.pathname.endsWith('/health')) {
      const memMb = Number((process.memoryUsage().rss / (1024 * 1024)).toFixed(1));
      return Response.json({
        status: 'ok',
        app: 'billing',
        port,
        livez: true,
        readyz: true,
        memoryMb: memMb,
        db: 'turso_billing.db',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      });
    }

    if (url.pathname === '/api/logs/browser' && req.method === 'POST') {
      const body: any = await req.json().catch(() => ({}));
      logger.logBrowserEvent(body.severity || 'INFO', body.message || 'Browser event', body);
      return Response.json({ status: 'ok' });
    }

    // 🛡️ Zero-Trust Auth & RBAC Guard (Strict Billing Admin Clearance)
    const auth = authGuard(req, {
      appName: 'Invoicing & Billing Service',
      requiredRoles: ['roles/billing.admin', 'roles/super_admin'],
    });

    if (!auth.authenticated) {
      return auth.response!;
    }

    return new Response(renderAppHtml(auth.user), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }, LOG_DIR);

  const server = Bun.serve({
    port,
    fetch: handler,
  });

  const shutdown = () => {
    logger.info('Received termination signal. Gracefully shutting down Billing Service...');
    server.stop(true);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  return server;
}

if (import.meta.main) {
  startBillingServer();
  logger.info(`[SYSTEM_BOOT] 🧾 Billing microservice running on http://localhost:${PORT}`);
}

