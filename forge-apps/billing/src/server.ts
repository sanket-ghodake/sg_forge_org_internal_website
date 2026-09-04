/**
 * Forge App: Invoicing & Billing Service (Port 8086)
 * Dedicated Turso SQLite Database Instance with Isolated Observability
 */

import { join } from 'node:path';
import { authGuard, createLogger, createSafeHandler, loadBrandConfig } from '@forge/sdk';
import { getAstryxHeaderHtml, getAstryxStyles, getHeadStateScript } from '@forge/ui';
import type { AuthUser } from '@forge/types';
import { billingDb } from './db';

const LOG_DIR = join(import.meta.dir, '..', 'logs');
const logger = createLogger('billing', LOG_DIR);
const PORT = Number(process.env.PORT || 8086);

interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  amount: number;
  currency: string;
  status: string;
  department_path: string;
  created_at: number;
}

function renderAppHtml(user?: AuthUser, invoices: Invoice[] = []): string {
  const brand = loadBrandConfig();
  const userName = user?.displayName || 'Billing Administrator';
  const userEmail = user?.email || `billing.admin@${brand.domain || 'forge.internal'}`;
  const userRole = user?.roles?.[0] || 'Billing Admin Clearance';
  const totalAmount = invoices.reduce((acc, inv) => acc + inv.amount, 0);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brand.name} - Billing Micro-App</title>
  ${getHeadStateScript({ defaultTheme: 'dark' })}
  <style>
    ${getAstryxStyles()}
    .invoice-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
      margin-top: 0.5rem;
    }
    .invoice-table th {
      text-align: left;
      padding: 0.65rem 0.85rem;
      color: var(--forge-text-muted);
      border-bottom: 1px solid var(--forge-border);
      font-weight: 600;
    }
    .invoice-table td {
      padding: 0.75rem 0.85rem;
      border-bottom: 1px solid var(--forge-border);
      color: var(--forge-text-main);
    }
  </style>
</head>
<body>
  ${getAstryxHeaderHtml('BILLING', 'LEDGER APP')}
  <main class="astryx-container">
    <div class="astryx-card" style="margin-bottom: 1.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
        <h1 style="font-size: 1.5rem; color: var(--forge-text-main); margin: 0;">🧾 Invoicing & Billing Service</h1>
        <span style="font-size: 0.8rem; background: var(--forge-success-bg); color: var(--forge-primary); border: 1px solid var(--forge-primary); border-radius: 9999px; padding: 0.25rem 0.6rem; font-weight: 600;">🛡️ ${userRole}</span>
      </div>
      <p style="color: var(--forge-text-muted); margin-bottom: 1.25rem;">
        High-security financial ledger accessible only by billing administrators. Verified session for <strong>${userName}</strong> (<code>${userEmail}</code>).
      </p>

      <!-- Ledger Summary Stats -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
        <div style="background: var(--forge-bg-root); padding: 1rem; border-radius: var(--forge-radius); border: 1px solid var(--forge-border);">
          <span style="font-size: 0.75rem; color: var(--forge-text-muted);">Active Ledger Total</span>
          <div style="font-size: 1.35rem; font-weight: 700; color: var(--forge-primary); margin-top: 0.25rem;">$${totalAmount.toLocaleString()}</div>
        </div>
        <div style="background: var(--forge-bg-root); padding: 1rem; border-radius: var(--forge-radius); border: 1px solid var(--forge-border);">
          <span style="font-size: 0.75rem; color: var(--forge-text-muted);">Total Invoices</span>
          <div style="font-size: 1.35rem; font-weight: 700; color: var(--forge-text-main); margin-top: 0.25rem;">${invoices.length}</div>
        </div>
      </div>

      <!-- Invoices Ledger Table -->
      <div style="background: var(--forge-bg-root); padding: 1.25rem; border-radius: var(--forge-radius); border: 1px solid var(--forge-border); margin-bottom: 1.5rem; overflow-x: auto;">
        <h3 style="font-size: 0.95rem; color: var(--forge-text-main); margin: 0 0 0.5rem 0;">📋 Ledger Records (Dedicated Turso DB)</h3>
        <table class="invoice-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Client Name</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            ${invoices
              .map(
                (inv) => `
              <tr>
                <td><strong>${inv.invoice_number}</strong></td>
                <td>${inv.client_name}</td>
                <td style="color: var(--forge-primary); font-weight: 600;">$${inv.amount.toLocaleString()} ${inv.currency}</td>
                <td>
                  <span class="astryx-badge ${inv.status === 'PAID' ? 'badge-online' : 'badge-pill'}">${inv.status}</span>
                </td>
                <td style="color: var(--forge-text-muted); font-size: 0.78rem;">${inv.department_path}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>

      <div style="background: var(--forge-bg-root); padding: 0.75rem 1rem; border-radius: var(--forge-radius); border: 1px solid var(--forge-border); margin-bottom: 1.5rem;">
        <span style="font-size: 0.82rem; color: var(--forge-primary);">Database: <code>billing_turso.db</code> (Isolated libSQL Instance)</span>
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
  const handler = createSafeHandler(
    'billing',
    async (req: Request) => {
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
        appId: 'billing',
        requiredRoles: ['roles/billing.admin', 'roles/super_admin'],
      });

      if (!auth.authenticated) {
        return auth.response!;
      }

      // Query isolated invoices table
      const startQuery = performance.now();
      const invoices = billingDb.query('SELECT * FROM billing_invoices ORDER BY created_at DESC').all() as Invoice[];
      logger.logDbQuery('SELECT * FROM billing_invoices', performance.now() - startQuery);

      if (url.pathname === '/api/invoices') {
        return Response.json({ status: 'SUCCESS', invoices });
      }

      return new Response(renderAppHtml(auth.user, invoices), {
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
