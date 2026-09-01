/**
 * @forge/portal - Main Workspace Portal & Org Canvas Service (2026 LTS)
 * Serves on Port 3001 (Ingress /portal via Reverse Proxy)
 * Integrated with Central Auth Microservice & ASVS 5.0 Authentication Gate.
 */

import { authGuard, createLogger, createSafeHandler, handleBrandAssetRequest } from '@forge/sdk';
import { renderPortalHtml, type HeaderUserContext } from './frontend';

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

    const user: HeaderUserContext = {
      id: auth.user!.id,
      email: auth.user!.email,
      displayName: auth.user!.displayName,
      roles: auth.user!.roles,
      isAdmin: auth.user!.roles.some(r => r.includes('admin') || r.includes('manager')),
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
