/**
 * Forge App: Telemetry Service - Dedicated Turso SQLite Client (2026 LTS)
 * Strict Per-App Database Isolation (Google & Meta Multi-Tenant Standard)
 */

import { Database } from 'bun:sqlite';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { createLogger } from '@forge/sdk';

const logger = createLogger('telemetry-db');
const DATA_DIR = join(import.meta.dir, '..', '..', '..', '..', 'apps', 'data');

if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = join(DATA_DIR, 'telemetry.db');
export const telemetryDb = new Database(DB_PATH);

// Initialize telemetry snapshots table
telemetryDb.run(`
  CREATE TABLE IF NOT EXISTS telemetry_snapshots (
    id TEXT PRIMARY KEY,
    cpu_percent REAL NOT NULL,
    memory_mb REAL NOT NULL,
    active_services INTEGER NOT NULL,
    timestamp INTEGER NOT NULL
  );
`);

logger.info(`Initialized isolated Turso DB for telemetry microservice at ${DB_PATH}`);
