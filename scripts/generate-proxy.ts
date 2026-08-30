#!/usr/bin/env bun
/**
 * Dynamic Ingress & Caddyfile Generator (2026 LTS)
 * Reads declarative service registry from .env and generates proxy/Caddyfile
 * Industry Standard: Declarative Ingress Controller Pattern
 */

import { writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { loadServiceRegistry } from '../apps/src/sdk/src/registry';

const REPO_ROOT = process.cwd();
const CADDYFILE_PATH = join(REPO_ROOT, 'proxy', 'Caddyfile');

export function generateCaddyfile(): string {
  const services = loadServiceRegistry();
  const httpPort = process.env.HTTP_PORT || '80';

  let caddyContent = `# ==============================================================================
# SG Forge - Unified Reverse Proxy Gateway (Auto-Generated from .env)
# DO NOT EDIT DIRECTLY: Modify routes in .env and run './run.sh sync-proxy'
# ==============================================================================

:${httpPort} {
    # Structured Logging
    log {
        output stdout
        format console
    }
`;

  // Filter non-root services
  const subServices = services.filter((s) => s.path !== '/');

  for (const s of subServices) {
    caddyContent += `
    # ${s.name} (${s.id})
    handle_path ${s.path}* {
        reverse_proxy http://${s.containerName}:${s.port}
    }
`;
  }

  // Root landing fallback handler
  const landing = services.find((s) => s.path === '/');
  const landingPort = landing ? landing.port : 3000;
  const landingHost = landing ? landing.containerName : 'landing';

  caddyContent += `
    # Public Platform Hub (Root Ingress)
    handle {
        reverse_proxy http://${landingHost}:${landingPort}
    }
}
`;

  writeFileSync(CADDYFILE_PATH, caddyContent, 'utf8');
  return caddyContent;
}

if (import.meta.main) {
  generateCaddyfile();
  const services = loadServiceRegistry();
  console.log(`🔀 [Caddy Ingress] Auto-generated proxy/Caddyfile with ${services.length} routes from .env`);
  for (const s of services) {
    console.log(`   ├─ ${s.path.padEnd(18)} -> http://${s.containerName}:${s.port} (${s.name})`);
  }
}
