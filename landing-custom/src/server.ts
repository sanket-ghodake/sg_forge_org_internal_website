#!/usr/bin/env bun
/**
 * Custom Landing Server (Starter Base)
 * Fast, standalone Bun HTTP server for custom landing page implementations.
 * Designed for independent Git Submodule / isolated repository workflows.
 */

import { renderCustomLandingHtml } from './template.html';

const PORT = Number(process.env.LANDING_PORT || process.env.PORT || 3000);

export function createLandingHandler() {
  return async (req: Request): Promise<Response> => {
    const url = new URL(req.url);

    // Operational Dual-Probe Health Endpoint
    if (url.pathname === '/health' || url.pathname === '/live') {
      return new Response(
        JSON.stringify({
          status: 'pass',
          service: 'landing-custom',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        }
      );
    }

    // Root Landing Page
    if (url.pathname === '/') {
      const html = renderCustomLandingHtml();
      return new Response(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=60',
        },
      });
    }

    // 404 Fallback
    return new Response(
      `<!DOCTYPE html><html><body style="background:#0b0f19;color:#fff;font-family:sans-serif;text-align:center;padding:5rem;"><h1>404 Not Found</h1><p><a href="/" style="color:#3b82f6;">Return to Landing Page</a></p></body></html>`,
      {
        status: 404,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      }
    );
  };
}

export function startServer(port: number = PORT) {
  const handler = createLandingHandler();
  const server = Bun.serve({
    port,
    fetch: handler,
  });

  console.log(`🌐 [Custom Landing] Server listening on http://localhost:${server.port}`);
  return server;
}

if (import.meta.main) {
  startServer();
}
