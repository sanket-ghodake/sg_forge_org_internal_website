#!/usr/bin/env bun
/**
 * SG Forge - Landing Discovery Hub & Universal Route Directory
 * Meta Astryx Design Standards & Google SRE Observability (2026 LTS Baseline)
 */

import { createLogger, createSafeHandler } from '@forge/sdk';
import { getAstryxHeaderHtml, getAstryxStyles } from '@forge/ui';

const logger = createLogger('landing-hub');
const PORT = Number(process.env.LANDING_PORT || process.env.PORT || 3000);

interface RouteItem {
  path: string;
  name: string;
  port: number;
  desc: string;
  healthUrl: string;
  role: string;
  isExternal: boolean;
}

interface RouteGroup {
  category: string;
  items: RouteItem[];
}

const routes: RouteGroup[] = [
  {
    category: 'Core Enterprise Services & Workspaces',
    items: [
      {
        path: '/',
        name: 'Platform Hub (Landing)',
        port: 3000,
        desc: 'Central discovery gateway & dynamic micro-app route matrix',
        healthUrl: '/health',
        role: 'Public Ingress',
        isExternal: false,
      },
      {
        path: '/auth',
        name: 'Auth & Identity Service',
        port: 3000,
        desc: 'Stateless session renewal, user directory & scoped JWT token issuer',
        healthUrl: '/auth/health',
        role: 'Public / OAuth',
        isExternal: true, // Opens in new tab
      },
      {
        path: '/portal',
        name: 'Main Workspace & Org Canvas',
        port: 3001,
        desc: '2D visual organizational mapping, employee directory & app launcher',
        healthUrl: '/portal/health',
        role: 'Employee / Admin',
        isExternal: true, // Opens in new tab
      },
      {
        path: '/devcenter',
        name: 'Developer Dashboard',
        port: 3002,
        desc: 'Live streaming container logs, CPU/RAM telemetry & health diagnostics',
        healthUrl: '/devcenter/health',
        role: 'Developer',
        isExternal: true, // Opens in new tab
      },
      {
        path: '/gateway',
        name: 'Developer Hub & SDK Playground',
        port: 3003,
        desc: 'Interactive Forge SDK specs, token testing & Docker scaffolding guides',
        healthUrl: '/gateway/health',
        role: 'Developer',
        isExternal: true, // Opens in new tab
      },
    ],
  },
  {
    category: 'Isolated Polyglot Forge Micro-Apps (Dedicated Turso DB)',
    items: [
      {
        path: '/apps/expenses',
        name: 'Expense Approval Engine',
        port: 8085,
        desc: 'Polyglot micro-app (Python/FastAPI) with dedicated Turso SQLite database',
        healthUrl: '/apps/expenses/health',
        role: 'Finance / Manager',
        isExternal: true, // Opens in new tab
      },
      {
        path: '/apps/billing',
        name: 'Invoicing & Billing Service',
        port: 8086,
        desc: 'Polyglot micro-app (Go/Fiber) with dedicated Turso SQLite database',
        healthUrl: '/apps/billing/health',
        role: 'Finance',
        isExternal: true, // Opens in new tab
      },
      {
        path: '/apps/telemetry',
        name: 'Live Telemetry Dashboard',
        port: 8087,
        desc: 'Real-time telemetry micro-app (TS/Hono) with dedicated Turso SQLite database',
        healthUrl: '/apps/telemetry/health',
        role: 'Engineering',
        isExternal: true, // Opens in new tab
      },
    ],
  },
];

function renderHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SG Forge - Modular Corporate Portal & Micro-App Engine</title>
  <style>
    ${getAstryxStyles()}
  </style>
</head>
<body>
  ${getAstryxHeaderHtml('SG', 'FORGE PLATFORM')}

  <main class="astryx-container">
    <section class="astryx-hero">
      <div style="display: inline-block; margin-bottom: 0.75rem;">
        <span class="astryx-badge badge-pill">Meta Astryx Design System v2.0</span>
      </div>
      <h1>Enterprise Workspace & Micro-App Engine</h1>
      <p>Universal routing hub connecting core organizational workspaces and sandboxed micro-frontends with dedicated Turso DB instances.</p>
    </section>

    ${routes
      .map(
        (group) => `
      <div style="margin-top: 2.5rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--forge-border); padding-bottom: 0.65rem;">
          <h2 style="font-size: 1.15rem; font-weight: 700; color: var(--forge-text-main); letter-spacing: -0.01em;">${group.category}</h2>
          <span style="font-size: 0.8rem; color: var(--forge-text-subtle);">${group.items.length} Registered Endpoints</span>
        </div>
        <div class="astryx-grid">
          ${group.items
            .map(
              (item) => `
            <div class="astryx-card">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                <span class="astryx-code-badge">${item.path}</span>
                <span class="astryx-badge badge-online" id="status-${item.port}">
                  <span class="badge-dot"></span> :${item.port}
                </span>
              </div>
              <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.35rem; color: var(--forge-text-main);">${item.name}</h3>
              <p style="font-size: 0.85rem; color: var(--forge-text-muted); margin-bottom: 1.25rem; min-height: 42px;">${item.desc}</p>
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--forge-border); padding-top: 0.85rem;">
                <span style="font-size: 0.75rem; color: var(--forge-text-subtle);">Access: <strong style="color: var(--forge-text-muted);">${item.role}</strong></span>
                <a href="${item.path}" 
                   class="astryx-btn btn-primary" 
                   style="font-size: 0.8rem; padding: 0.4rem 0.9rem;"
                   ${item.isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''}>
                  ${item.isExternal ? 'Launch App &#x2197;' : 'Current Page'}
                </a>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `
      )
      .join('')}
  </main>

  <footer style="margin-top: auto; padding: 2.5rem 1.5rem; text-align: center; border-top: 1px solid var(--forge-border); font-size: 0.82rem; color: var(--forge-text-subtle);">
    SG Forge Platform Engine v2.0.0 &bull; Meta Astryx Design Tokens &bull; Bun v1.3.14 Runtime &bull; Zero-Host Architecture
  </footer>
</body>
</html>`;
}

export function startLandingServer(port: number = PORT) {
  const handler = createSafeHandler('landing-hub', async (req: Request) => {
    const url = new URL(req.url);

    if (url.pathname === '/health') {
      return Response.json({
        status: 'ok',
        service: 'landing',
        port,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      });
    }

    if (url.pathname === '/auth/health') {
      return Response.json({
        status: 'ok',
        service: 'auth',
        uptime: process.uptime(),
      });
    }

    if (url.pathname === '/auth') {
      return new Response(
        `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Central Auth Service - SG Forge</title><style>${getAstryxStyles()}</style></head><body>${getAstryxHeaderHtml('AUTH', 'CENTRAL IDENTITY')}<main class="astryx-container" style="display:flex;justify-content:center;padding-top:4rem;"><div class="astryx-card" style="width:420px;text-align:center;"><h2>Central Auth Service</h2><p style="color:var(--forge-text-muted);margin:1rem 0;">Identity provider & scoped JWT issuer.</p><a href="/" class="astryx-btn btn-outline">&larr; Back to Hub</a></div></main></body></html>`,
        { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    return new Response(renderHtml(), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  });

  return Bun.serve({
    port,
    fetch: handler,
  });
}

if (import.meta.main) {
  startLandingServer();
  logger.info(`🌐 Landing Hub running on http://localhost:${PORT}`);
}
