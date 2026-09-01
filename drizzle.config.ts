/**
 * Drizzle Kit Configuration for SG Forge Monorepo (2026 LTS)
 * Allows Drizzle Studio to connect directly to local Turso / SQLite microservice databases.
 * Dynamically resolves data directory and database name via DB_NAME or DB_PATH.
 */

import { defineConfig } from 'drizzle-kit';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

function resolveDataDir(): string {
  if (process.env.FORGE_DATA_DIR && existsSync(process.env.FORGE_DATA_DIR)) {
    return process.env.FORGE_DATA_DIR;
  }
  const appsData = join(process.cwd(), 'apps', 'data');
  if (existsSync(appsData)) return appsData;

  const rootData = join(process.cwd(), 'data');
  if (existsSync(rootData)) return rootData;

  return appsData;
}

const dataDir = resolveDataDir();
const dbName = process.env.DB_NAME || 'platform_core.db';
const dbPath = process.env.DB_PATH || join(dataDir, dbName);

export default defineConfig({
  dialect: 'sqlite',
  dbCredentials: {
    url: dbPath,
  },
});
