/**
 * @forge/portal - Main Workspace Portal & Org Canvas Service
 * Serves on Port 3001 (Ingress /portal via Reverse Proxy)
 * Meta Astryx Enterprise Baseline (v2.0.0 LTS)
 */

import { getAstryxHeaderHtml, getAstryxStyles, getHeadStateScript } from '@forge/ui';
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
  ${getHeadStateScript({ defaultTheme: 'dark' })}
  <style>
    ${getAstryxStyles()}
    .portal-nav-tab {
      padding: 0.5rem 1rem;
      border-radius: var(--forge-radius-sm);
      border: 1px solid var(--forge-border);
      background: var(--forge-bg-surface);
      color: var(--forge-text-muted);
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      transition: var(--forge-transition);
      text-decoration: none;
    }
    .portal-nav-tab:hover {
      border-color: var(--forge-primary);
      color: var(--forge-text-main);
    }
    .portal-nav-tab.active {
      background: var(--forge-primary);
      color: var(--forge-bg-root);
      border-color: var(--forge-primary);
      font-weight: 600;
    }
    .portal-view-section {
      display: none;
    }
    .portal-view-section.active {
      display: block;
    }
  </style>
</head>
<body>
  ${getAstryxHeaderHtml('PORTAL', 'MAIN WORKSPACE')}
  <main class="astryx-container">
    <div class="astryx-card" style="margin-bottom: 1.5rem;">
      <h1 style="font-size: 1.75rem; margin-bottom: 0.5rem; color: var(--forge-text-main);">🏢 Main Portal & Org Canvas</h1>
      <p style="color: var(--forge-text-muted); margin-bottom: 1.25rem;">Interactive 2D organizational workspace, employee directory, and Forge App launcher.</p>
      
      <!-- Nav Tabs -->
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem;" id="portal-tabs">
        <button class="portal-nav-tab active" data-view="canvas">🌐 Org Canvas</button>
        <button class="portal-nav-tab" data-view="launcher">🧩 App Launcher</button>
        <button class="portal-nav-tab" data-view="rbac">🛡️ RBAC Clearance</button>
        <button class="portal-nav-tab" data-view="settings">⚙️ Portal Settings</button>
      </div>

      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
        <a href="/" class="astryx-btn btn-outline">&larr; Return to Platform Hub</a>
        <a href="/devcenter" class="astryx-btn btn-outline">Developer Center &rarr;</a>
      </div>
    </div>

    <!-- Section: Org Canvas -->
    <div id="view-canvas" class="portal-view-section active">
      <div class="astryx-card">
        <h3 style="color: var(--forge-text-main); margin-bottom: 0.5rem;">🌐 Semantic Org Canvas</h3>
        <p style="font-size: 0.9rem; color: var(--forge-text-muted); margin-bottom: 1rem;">Visual 2D zoomable graph rendering Macro, Meso, and Micro organizational units.</p>
        <div style="padding: 2rem; border: 1px dashed var(--forge-border); border-radius: var(--forge-radius); text-align: center; background: var(--forge-bg-root);">
          <span style="font-size: 1.5rem;">🗺️</span>
          <p style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--forge-text-muted);">Canvas Graph Engine Active • Zero Layout Shift Hydrated</p>
        </div>
      </div>
    </div>

    <!-- Section: App Launcher -->
    <div id="view-launcher" class="portal-view-section">
      <div class="astryx-card">
        <h3 style="color: var(--forge-text-main); margin-bottom: 0.5rem;">🧩 Forge App Launcher</h3>
        <p style="font-size: 0.9rem; color: var(--forge-text-muted); margin-bottom: 1rem;">Role-aware sandbox micro-app launcher with OAuth & short-lived token scoping.</p>
        <div class="astryx-grid" style="margin-top: 0;">
          <div class="astryx-card" style="background: var(--forge-bg-root);">
            <h4>💳 Expenses Micro-App</h4>
            <p style="font-size: 0.85rem; color: var(--forge-text-muted); margin: 0.5rem 0;">Port 3004 • Financial approval workflows</p>
            <a href="/expenses" class="astryx-btn btn-outline" style="font-size: 0.8rem; padding: 0.3rem 0.6rem;">Launch App &rarr;</a>
          </div>
          <div class="astryx-card" style="background: var(--forge-bg-root);">
            <h4>🧾 Billing & Invoicing</h4>
            <p style="font-size: 0.85rem; color: var(--forge-text-muted); margin: 0.5rem 0;">Port 3005 • Multi-tenant invoice generator</p>
            <a href="/billing" class="astryx-btn btn-outline" style="font-size: 0.8rem; padding: 0.3rem 0.6rem;">Launch App &rarr;</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Section: RBAC -->
    <div id="view-rbac" class="portal-view-section">
      <div class="astryx-card">
        <h3 style="color: var(--forge-text-main); margin-bottom: 0.5rem;">🛡️ Hierarchical RBAC Clearance</h3>
        <p style="font-size: 0.9rem; color: var(--forge-text-muted);">Department clearance, dynamic metadata, and app access approval queues.</p>
      </div>
    </div>

    <!-- Section: Settings -->
    <div id="view-settings" class="portal-view-section">
      <div class="astryx-card">
        <h3 style="color: var(--forge-text-main); margin-bottom: 0.5rem;">⚙️ Portal Preferences & State</h3>
        <p style="font-size: 0.9rem; color: var(--forge-text-muted); margin-bottom: 1rem;">Client-side storage preferences managed via Google 4-tier architecture.</p>
        <div style="font-size: 0.85rem; color: var(--forge-text-muted); line-height: 1.8;">
          <div>• Storage Key: <code class="astryx-code-badge">forge:v1:portal:view</code></div>
          <div>• State Sync Bus: <code class="astryx-code-badge">sg_forge_state_sync_bus</code> (Active)</div>
        </div>
      </div>
    </div>
  </main>

  <script>
    (function() {
      var STORAGE_KEY = 'forge:v1:portal:view';
      var params = new URLSearchParams(window.location.search);
      var initialView = params.get('view');
      if (!initialView) {
        try {
          var raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            var env = JSON.parse(raw);
            initialView = (env && typeof env === 'object' && env.data) ? env.data : env;
          }
        } catch(e) {}
      }
      initialView = initialView || 'canvas';

      function switchPortalView(view, updateUrl) {
        var tabs = document.querySelectorAll('.portal-nav-tab');
        var sections = document.querySelectorAll('.portal-view-section');

        tabs.forEach(function(t) {
          t.classList.toggle('active', t.getAttribute('data-view') === view);
        });

        sections.forEach(function(s) {
          s.classList.toggle('active', s.id === 'view-' + view);
        });

        if (updateUrl !== false) {
          var url = new URL(window.location.href);
          url.searchParams.set('view', view);
          window.history.replaceState({ view: view }, '', url.toString());
        }

        try {
          var env = { version: 1, updatedAt: new Date().toISOString(), data: view };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(env));
        } catch(e) {}
      }

      switchPortalView(initialView, false);

      document.querySelectorAll('.portal-nav-tab').forEach(function(tab) {
        tab.addEventListener('click', function() {
          var target = tab.getAttribute('data-view');
          if (target) switchPortalView(target, true);
        });
      });
    })();
  </script>
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
