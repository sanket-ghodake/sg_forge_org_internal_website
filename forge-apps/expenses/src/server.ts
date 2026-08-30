/**
 * Forge App: Expense Approval Engine (Port 8085)
 * Dedicated Turso SQLite Database Instance with Isolated Observability
 */

import { join } from 'node:path';
import { createLogger, createSafeHandler } from '@forge/sdk';
import { getAstryxHeaderHtml, getAstryxStyles } from '@forge/ui';

const LOG_DIR = join(import.meta.dir, '..', 'logs');
const logger = createLogger('expenses', LOG_DIR);
const PORT = Number(process.env.PORT || 8085);

function renderAppHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SG Forge - Expenses Micro-App</title>
  <style>${getAstryxStyles()}</style>
</head>
<body>
  ${getAstryxHeaderHtml('EXPENSES', 'FINANCE APP')}
  <main class="astryx-container">
    <div class="astryx-card">
      <h1 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--forge-text-main);">💳 Expense Approval Engine</h1>
      <p style="color: var(--forge-text-muted); margin-bottom: 1.25rem;">Isolated micro-app running with its dedicated Turso SQLite database.</p>
      <div style="background: var(--forge-bg-elevated); padding: 1rem; border-radius: var(--forge-radius); border: 1px solid var(--forge-border); margin-bottom: 1.5rem;">
        <span style="font-size: 0.85rem; color: var(--forge-primary);">Database: <code>expenses_turso.db</code> (Isolated libSQL)</span>
      </div>
      <a href="/" class="astryx-btn btn-outline">&larr; Return to Platform Hub</a>
    </div>
  </main>
  <script>
    window.onerror = function(msg, src, lineno, colno, err) {
      fetch('/api/logs/browser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service: 'expenses', severity: 'ERROR', message: msg, timestamp: new Date().toISOString() })
      }).catch(function() {});
    };
  </script>
</body>
</html>`;
}

export function startExpensesServer(port: number = PORT) {
  const handler = createSafeHandler('expenses', async (req: Request) => {
    const url = new URL(req.url);

    if (url.pathname === '/health' || url.pathname.endsWith('/health')) {
      const memMb = Number((process.memoryUsage().rss / (1024 * 1024)).toFixed(1));
      return Response.json({
        status: 'ok',
        app: 'expenses',
        port,
        livez: true,
        readyz: true,
        memoryMb: memMb,
        db: 'turso_expenses.db',
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
    logger.info('Received termination signal. Gracefully shutting down Expenses Service...');
    server.stop(true);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  return server;
}

if (import.meta.main) {
  startExpensesServer();
  logger.info(`[SYSTEM_BOOT] 💳 Expenses microservice running on http://localhost:${PORT}`);
}

