/**
 * Forge App: Expense Approval Engine (Port 8085)
 * Dedicated Turso SQLite Database Instance with Isolated Observability & Scoped Hierarchy
 */

import { join } from 'node:path';
import {
  authGuard,
  createLogger,
  createSafeHandler,
  getScopedHierarchy,
  isManagerOf,
} from '@forge/sdk';
import { getAstryxHeaderHtml, getAstryxStyles } from '@forge/ui';
import type { AuthUser, ScopedHierarchyResponse } from '@forge/types';

const LOG_DIR = join(import.meta.dir, '..', 'logs');
const logger = createLogger('expenses', LOG_DIR);
const PORT = Number(process.env.PORT || 8085);

function renderAppHtml(user?: AuthUser, hierarchy?: ScopedHierarchyResponse | null): string {
  const userName = user?.displayName || 'Authorized User';
  const userEmail = user?.email || 'user@forge.internal';
  const userRole = user?.roles?.[0] || 'Standard Access';

  const approver = hierarchy?.managementChain?.[0];
  const reports = hierarchy?.directReports || [];
  const dept = hierarchy?.employee?.departmentName || 'Finance Operations';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SG Forge - Expenses Micro-App</title>
  <style>
    ${getAstryxStyles()}
    .hierarchy-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      background: var(--forge-bg-root);
      border: 1px solid var(--forge-border);
      padding: 0.35rem 0.75rem;
      border-radius: var(--forge-radius);
      font-size: 0.82rem;
      color: var(--forge-text-main);
    }
  </style>
</head>
<body>
  ${getAstryxHeaderHtml('EXPENSES', 'FINANCE APP')}
  <main class="astryx-container">
    <div class="astryx-card" style="margin-bottom: 1.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
        <h1 style="font-size: 1.5rem; color: var(--forge-text-main); margin: 0;">💳 Expense Approval Engine</h1>
        <span style="font-size: 0.8rem; background: rgba(62, 207, 142, 0.15); color: var(--forge-primary); border: 1px solid var(--forge-primary); border-radius: 9999px; padding: 0.25rem 0.6rem; font-weight: 600;">🛡️ ${userRole}</span>
      </div>
      <p style="color: var(--forge-text-muted); margin-bottom: 1.25rem;">
        Authenticated session verified for <strong>${userName}</strong> (<code>${userEmail}</code>) &bull; Department: <strong style="color: var(--forge-text-main);">${dept}</strong>
      </p>

      <!-- Scoped Hierarchy Approval Chain Card -->
      <div style="background: var(--forge-bg-surface); padding: 1.25rem; border-radius: var(--forge-radius); border: 1px solid var(--forge-border); margin-bottom: 1.5rem;">
        <h3 style="font-size: 0.95rem; color: var(--forge-text-main); margin: 0 0 0.75rem 0;">🏢 Linear Upward Approval Chain</h3>
        <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
          <div class="hierarchy-pill">
            <span style="color: var(--forge-text-muted);">Employee:</span>
            <strong>${userName}</strong>
          </div>
          <span style="color: var(--forge-primary); font-weight: 700;">&rarr;</span>
          <div class="hierarchy-pill">
            <span style="color: var(--forge-text-muted);">Line Manager (Approver):</span>
            <strong style="color: var(--forge-primary);">${approver?.displayName || 'Executive (Self-Approving)'}</strong>
          </div>
          ${
            hierarchy?.managementChain?.[1]
              ? `<span style="color: var(--forge-text-muted);">&rarr;</span>
                 <div class="hierarchy-pill">
                   <span style="color: var(--forge-text-muted);">Skip-Level:</span>
                   <strong>${hierarchy.managementChain[1].displayName}</strong>
                 </div>`
              : ''
          }
        </div>
      </div>

      <!-- Direct Reports Approval Queue (If user is a manager) -->
      ${
        reports.length > 0
          ? `<div style="background: var(--forge-bg-surface); padding: 1.25rem; border-radius: var(--forge-radius); border: 1px solid var(--forge-border); margin-bottom: 1.5rem;">
              <h3 style="font-size: 0.95rem; color: var(--forge-text-main); margin: 0 0 0.5rem 0;">📋 Pending Approvals from Direct Reports (${reports.length})</h3>
              <p style="font-size: 0.8rem; color: var(--forge-text-muted); margin-bottom: 0.75rem;">Employees in your linear reporting line whose expense claims require your review:</p>
              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                ${reports
                  .map(
                    (r) => `
                  <div style="display: flex; justify-content: space-between; align-items: center; background: var(--forge-bg-root); padding: 0.6rem 0.85rem; border-radius: var(--forge-radius); border: 1px solid var(--forge-border);">
                    <div>
                      <strong style="color: var(--forge-text-main); font-size: 0.85rem;">${r.displayName}</strong>
                      <span style="color: var(--forge-text-muted); font-size: 0.75rem; margin-left: 0.5rem;">${r.jobTitle || 'Team Member'}</span>
                    </div>
                    <span class="astryx-badge badge-online">Cleared for Review</span>
                  </div>
                `
                  )
                  .join('')}
              </div>
            </div>`
          : ''
      }

      <div style="background: var(--forge-bg-elevated); padding: 0.75rem 1rem; border-radius: var(--forge-radius); border: 1px solid var(--forge-border); margin-bottom: 1.5rem;">
        <span style="font-size: 0.82rem; color: var(--forge-primary);">Database: <code>expenses_turso.db</code> (Isolated libSQL Instance)</span>
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
        body: JSON.stringify({ service: 'expenses', severity: 'ERROR', message: msg, timestamp: new Date().toISOString() })
      }).catch(function() {});
    };
  </script>
</body>
</html>`;
}

export function startExpensesServer(port: number = PORT) {
  const handler = createSafeHandler(
    'expenses',
    async (req: Request) => {
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

      // 🛡️ Zero-Trust Auth Guard (Requires Employee or Admin role)
      const auth = authGuard(req, {
        appName: 'Expense Approval Engine',
        requiredRoles: ['roles/employee', 'roles/super_admin'],
      });

      if (!auth.authenticated) {
        return auth.response!;
      }

      // 🏢 Fetch Scoped Hierarchy for caller
      let hierarchy: ScopedHierarchyResponse | null = null;
      try {
        if (auth.user?.id) {
          hierarchy = await getScopedHierarchy(auth.user.id);
        }
      } catch {
        // Fallback gracefully if auth service is in isolated test mode
      }

      return new Response(renderAppHtml(auth.user, hierarchy), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    },
    LOG_DIR
  );

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
