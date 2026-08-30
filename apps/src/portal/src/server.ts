/**
 * @forge/portal - Main Workspace Portal & Org Canvas Service (2026 LTS)
 * Serves on Port 3001 (Ingress /portal via Reverse Proxy)
 * Integrated with Central Auth Microservice & ASVS 5.0 Authentication Gate.
 */

import { getAstryxHeaderHtml, getAstryxStyles, getHeadStateScript } from '@forge/ui';
import { createLogger, createSafeHandler } from '@forge/sdk';
import { verifyJwt } from '@forge/auth';

const PORT = Number(process.env.PORTAL_PORT || process.env.PORT || 3001);
const logger = createLogger('portal-service');

interface UserContext {
  id: string;
  email: string;
  displayName: string;
  principalType: string;
  roles: string[];
}

function renderPortalHtml(user?: UserContext): string {
  const userName = user?.displayName || 'Authorized Employee';
  const userEmail = user?.email || 'user@forge.internal';
  const roleTitle = user?.roles?.[0] || 'Standard Access';

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
    .user-profile-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1.25rem;
      background: var(--forge-bg-surface);
      border: 1px solid var(--forge-border);
      border-radius: var(--forge-radius-sm);
      margin-bottom: 1.25rem;
    }
    .user-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.8rem;
      padding: 0.25rem 0.6rem;
      background: var(--forge-success-bg, rgba(62, 207, 142, 0.12));
      border: 1px solid var(--forge-primary);
      border-radius: 9999px;
      color: var(--forge-primary);
      font-weight: 600;
    }
  </style>
</head>
<body>
  ${getAstryxHeaderHtml('PORTAL', 'MAIN WORKSPACE')}

  <main class="astryx-container">
    <!-- Authenticated User Banner -->
    <div class="user-profile-banner">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <span style="font-size: 1.4rem;">👤</span>
        <div>
          <strong style="color: var(--forge-text-main); font-size: 0.95rem;">${userName}</strong>
          <span style="color: var(--forge-text-muted); font-size: 0.8rem; margin-left: 0.5rem;">(${userEmail})</span>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <span class="user-badge">🛡️ ${roleTitle}</span>
        <button id="logout-btn" class="astryx-btn btn-outline" style="font-size: 0.8rem; padding: 0.35rem 0.75rem;">Sign Out</button>
      </div>
    </div>

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
          <p style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--forge-text-muted);">Generic Org Tree Active • Verified Session for ${userEmail}</p>
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
            <p style="font-size: 0.85rem; color: var(--forge-text-muted); margin: 0.5rem 0;">Port 8085 • Financial approval workflows</p>
            <a href="/expenses" class="astryx-btn btn-outline" style="font-size: 0.8rem; padding: 0.3rem 0.6rem;">Launch App &rarr;</a>
          </div>
          <div class="astryx-card" style="background: var(--forge-bg-root);">
            <h4>🧾 Billing & Invoicing</h4>
            <p style="font-size: 0.85rem; color: var(--forge-text-muted); margin: 0.5rem 0;">Port 8086 • Multi-tenant invoice generator</p>
            <a href="/billing" class="astryx-btn btn-outline" style="font-size: 0.8rem; padding: 0.3rem 0.6rem;">Launch App &rarr;</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Section: RBAC -->
    <div id="view-rbac" class="portal-view-section">
      <div class="astryx-card">
        <h3 style="color: var(--forge-text-main); margin-bottom: 0.5rem;">🛡️ Hierarchical RBAC Clearance</h3>
        <p style="font-size: 0.9rem; color: var(--forge-text-muted);">Assigned Roles: <code>${(user?.roles || []).join(', ')}</code></p>
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
      var initialView = params.get('view') || 'canvas';

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
      }

      switchPortalView(initialView, false);

      document.querySelectorAll('.portal-nav-tab').forEach(function(tab) {
        tab.addEventListener('click', function() {
          var target = tab.getAttribute('data-view');
          if (target) switchPortalView(target, true);
        });
      });

      var logoutBtn = document.getElementById('logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', async function() {
          try {
            await fetch('/api/v1/auth/logout', { method: 'POST' });
          } catch(e) {}
          window.location.href = '/auth/login?return_url=/portal';
        });
      }
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

    // Pillar 2: Browser Telemetry Log Bridge
    if (url.pathname === '/api/logs/browser' || url.pathname === '/portal/api/logs/browser') {
      try {
        const body = await req.json();
        logger.logBrowserEvent(body.severity || 'INFO', body.message || 'Browser event', body.metadata, body.error ? new Error(body.error.message || body.message) : undefined);
        return Response.json({ ok: true });
      } catch {
        return Response.json({ ok: false }, { status: 400 });
      }
    }

    // Determine target portal ingress path for return_url
    const ingressPrefix = req.headers.get('x-forwarded-prefix') || '/portal';
    const targetPath =
      url.pathname === '/' || url.pathname === ''
        ? ingressPrefix
        : url.pathname.startsWith('/portal')
        ? url.pathname
        : `${ingressPrefix}${url.pathname}`;
    const returnUrlParam = encodeURIComponent(targetPath + (url.search || ''));

    // Authentication Verification Gate
    const cookieHeader = req.headers.get('cookie') || '';
    const sessionMatch = cookieHeader.match(/forge_session=([^;]+)/);
    const authHeader = req.headers.get('authorization') || '';
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const token = sessionMatch ? sessionMatch[1] : bearerToken;

    if (!token) {
      // Unauthenticated -> 302 Redirect to Auth Service Login with preserved /portal target
      return new Response(null, {
        status: 302,
        headers: {
          Location: `/auth/login?return_url=${returnUrlParam}`,
        },
      });
    }

    const { valid, payload } = verifyJwt(token);
    if (!valid || !payload) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: `/auth/login?return_url=${returnUrlParam}`,
        },
      });
    }

    const user: UserContext = {
      id: payload.sub,
      email: payload.email,
      displayName: payload.display_name,
      principalType: payload.principal_type,
      roles: payload.roles || [],
    };

    return new Response(renderPortalHtml(user), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  });

  const server = Bun.serve({
    port,
    fetch: handler,
  });

  const shutdown = () => {
    logger.info('Received termination signal. Gracefully shutting down Portal Service...');
    server.stop(true);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  return server;
}

if (import.meta.main) {
  startPortalServer();
  logger.info(`🏢 Main Portal running on http://localhost:${PORT}`);
}
