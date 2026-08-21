/**
 * @forge/sdk - Dynamic Service Registry Engine (2026 LTS)
 * Parses declarative app registrations from environment (.env)
 * Industry Standard: Spotify Backstage & Traefik Declarative Ingress Model
 */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface ServiceEntry {
  id: string;
  name: string;
  port: number;
  path: string;
  category: string;
  role: string;
  containerName: string;
  isExternal: boolean;
  healthUrl: string;
}

/**
 * Loads and parses all registered services from .env or active environment variables.
 * Format: APP_<ID>="Display Name|Internal Port|Public Ingress Path|Category|Access Role"
 */
export function loadServiceRegistry(envPath?: string): ServiceEntry[] {
  const resolvedEnvPath = envPath || join(process.cwd(), '.env');
  const envMap: Record<string, string> = { ...process.env as Record<string, string> };

  if (existsSync(resolvedEnvPath)) {
    const rawContent = readFileSync(resolvedEnvPath, 'utf8');
    for (const line of rawContent.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        envMap[key] = val;
      }
    }
  }

  const services: ServiceEntry[] = [];

  // Default Platform Hub entry
  const landingPort = Number(envMap.LANDING_PORT || 3000);
  services.push({
    id: 'landing',
    name: 'Platform Hub (Landing)',
    port: landingPort,
    path: '/',
    category: 'Core Workspaces',
    role: 'Public Ingress',
    containerName: 'landing',
    isExternal: false,
    healthUrl: '/health',
  });

  for (const [key, value] of Object.entries(envMap)) {
    if (key.startsWith('APP_') && typeof value === 'string' && value.includes('|')) {
      const appId = key.replace('APP_', '').toLowerCase().replace(/_/g, '-');
      const parts = value.split('|').map((p) => p.trim());

      if (parts.length >= 3) {
        const name = parts[0];
        const port = Number(parts[1]);
        const path = parts[2];
        const category = parts[3] || 'Micro-Apps';
        const role = parts[4] || 'General';

        // Infer container hostname
        let containerName = appId;
        if (['expenses', 'billing', 'telemetry'].includes(appId)) {
          containerName = `app-${appId}`;
        } else if (appId === 'devcenter' || appId === 'dev-dashboard') {
          containerName = 'dev-dashboard';
        } else if (appId === 'gateway' || appId === 'dev-hub') {
          containerName = 'dev-hub';
        } else if (appId === 'auth') {
          containerName = 'auth';
        }

        services.push({
          id: appId,
          name,
          port,
          path,
          category,
          role,
          containerName,
          isExternal: path !== '/',
          healthUrl: `${path}/health`,
        });
      }
    }
  }

  return services;
}
