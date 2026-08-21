/**
 * Forge App: Invoicing & Billing Service (Port 8086)
 * Dedicated Turso SQLite Database Instance
 */

import { getAstryxHeaderHtml, getAstryxStyles } from '@forge/ui';

const PORT = Number(process.env.PORT || 8086);

function renderAppHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SG Forge - Billing Micro-App</title>
  <style>${getAstryxStyles()}</style>
</head>
<body>
  ${getAstryxHeaderHtml('BILLING', 'LEDGER APP')}
  <main class="astryx-container">
    <div class="astryx-card">
      <h1 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--forge-text-main);">🧾 Invoicing & Billing Service</h1>
      <p style="color: var(--forge-text-muted); margin-bottom: 1.25rem;">Isolated financial ledger micro-app running with its dedicated Turso SQLite database.</p>
      <div style="background: var(--forge-bg-elevated); padding: 1rem; border-radius: var(--forge-radius); border: 1px solid var(--forge-border); margin-bottom: 1.5rem;">
        <span style="font-size: 0.85rem; color: var(--forge-primary);">Database: <code>billing_turso.db</code> (Isolated libSQL)</span>
      </div>
      <a href="/" class="astryx-btn btn-outline">&larr; Return to Platform Hub</a>
    </div>
  </main>
</body>
</html>`;
}

export function startBillingServer(port: number = PORT) {
  return Bun.serve({
    port,
    fetch(req) {
      const url = new URL(req.url);
      if (url.pathname.endsWith('/health')) {
        return Response.json({ status: 'ok', app: 'billing', port, db: 'turso_billing.db', uptime: process.uptime() });
      }
      return new Response(renderAppHtml(), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    },
  });
}

if (import.meta.main) {
  startBillingServer();
  console.log(`🧾 [Forge App] Billing running on http://localhost:${PORT}`);
}
