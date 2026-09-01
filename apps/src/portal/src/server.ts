/**
 * @forge/portal - Main Workspace Portal & Org Canvas Service (2026 LTS)
 * Serves on Port 3001 (Ingress /portal via Reverse Proxy)
 * Integrated with Central Auth Microservice & ASVS 5.0 Authentication Gate.
 */

import { authGuard, createLogger, createSafeHandler, handleBrandAssetRequest } from '@forge/sdk';
import { renderPortalHtml, type HeaderUserContext, REGISTERED_PORTAL_APPS, ADMIN_ROSTER_MEMBERS } from './frontend';
import { getOrgTree } from './backend/org-tree-service';
import {
  getLiveNotifications,
  markAllNotificationsAsRead,
  dismissNotification,
  recordCelebration,
  getLiveCompanyEvents,
  getUserDeliveryPreference,
  setUserDeliveryPreference,
} from './backend/inbox-service';

const PORT = Number(process.env.PORTAL_PORT || process.env.PORT || 3001);
const logger = createLogger('portal-service');

export function startPortalServer(port: number = PORT) {
  const handler = createSafeHandler('portal-service', async (req: Request) => {
    const url = new URL(req.url);

    // 0. Static Brand Asset Interceptor
    const assetRes = handleBrandAssetRequest(req);
    if (assetRes) return assetRes;

    if (url.pathname.endsWith('/health')) {
      return Response.json({ status: 'ok', service: 'portal', port, uptime: process.uptime() });
    }

    // Pillar 2: Browser Telemetry Log Bridge
    if (url.pathname === '/api/logs/browser' || url.pathname === '/portal/api/logs/browser') {
      try {
        const body = await req.json();
        logger.logBrowserEvent(
          body.severity || 'INFO',
          body.message || 'Browser event',
          body.metadata,
          body.error ? new Error(body.error.message || body.message) : undefined
        );
        return Response.json({ ok: true });
      } catch {
        return Response.json({ ok: false }, { status: 400 });
      }
    }

    // 🛡️ Zero-Trust SSO Auth Gate & RBAC Verification
    const auth = authGuard(req, {
      appName: 'Main Portal & Org Canvas',
      requiredRoles: ['roles/employee', 'roles/super_admin'],
    });

    if (!auth.authenticated) {
      return auth.response!;
    }

    // JSON API Endpoints for dynamic hydration
    if (url.pathname === '/api/v1/portal/canvas/tree' || url.pathname === '/portal/api/v1/portal/canvas/tree') {
      const maxDepth = url.searchParams.get('max_depth') ? Number(url.searchParams.get('max_depth')) : 5;
      const rootId = url.searchParams.get('root_id') || undefined;
      const tree = getOrgTree({ maxDepth, rootId });
      return Response.json({ ok: true, data: tree });
    }

    if (url.pathname === '/api/v1/portal/apps' || url.pathname === '/portal/api/v1/portal/apps') {
      return Response.json({ ok: true, data: REGISTERED_PORTAL_APPS });
    }

    if (url.pathname === '/api/v1/portal/members' || url.pathname === '/portal/api/v1/portal/members') {
      return Response.json({ ok: true, data: ADMIN_ROSTER_MEMBERS });
    }

    // ── Live Notifications & Announcements API ──
    if (url.pathname === '/api/v1/portal/notifications' || url.pathname === '/portal/api/v1/portal/notifications') {
      const notifs = getLiveNotifications(auth.user!.id);
      return Response.json({ ok: true, data: notifs });
    }

    if (url.pathname === '/api/v1/portal/notifications/mark-read' || url.pathname === '/portal/api/v1/portal/notifications/mark-read') {
      if (req.method === 'POST') {
        const ok = markAllNotificationsAsRead(auth.user!.id);
        return Response.json({ ok });
      }
    }

    if (url.pathname === '/api/v1/portal/notifications/dismiss' || url.pathname === '/portal/api/v1/portal/notifications/dismiss') {
      if (req.method === 'POST') {
        try {
          const body = await req.json();
          const ok = dismissNotification(body.id);
          return Response.json({ ok });
        } catch {
          return Response.json({ ok: false }, { status: 400 });
        }
      }
    }

    if (url.pathname === '/api/v1/portal/notifications/celebrate' || url.pathname === '/portal/api/v1/portal/notifications/celebrate') {
      if (req.method === 'POST') {
        try {
          const body = await req.json();
          const ok = recordCelebration(body.id, auth.user!.id);
          return Response.json({ ok });
        } catch {
          return Response.json({ ok: false }, { status: 400 });
        }
      }
    }

    if (url.pathname === '/api/v1/portal/events' || url.pathname === '/portal/api/v1/portal/events') {
      const events = getLiveCompanyEvents();
      return Response.json({ ok: true, data: events });
    }

    if (url.pathname === '/api/v1/portal/preferences' || url.pathname === '/portal/api/v1/portal/preferences') {
      if (req.method === 'POST') {
        try {
          const body = await req.json();
          const ok = setUserDeliveryPreference(auth.user!.id, body.pref || 'instant');
          return Response.json({ ok });
        } catch {
          return Response.json({ ok: false }, { status: 400 });
        }
      }
      const pref = getUserDeliveryPreference(auth.user!.id);
      return Response.json({ ok: true, data: { digestPref: pref } });
    }

    const user: HeaderUserContext = {
      id: auth.user!.id,
      email: auth.user!.email,
      displayName: auth.user!.displayName,
      roles: auth.user!.roles,
      isAdmin: auth.user!.roles.some((r: string) => r.includes('admin') || r.includes('manager')),
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
