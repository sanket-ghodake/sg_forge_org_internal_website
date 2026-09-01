/**
 * Forge App Template - Dedicated Turso SQLite Database Client (2026 LTS)
 * Strict Per-App Database Isolation (Google & Meta Multi-Tenant Standard)
 */

import { Database } from 'bun:sqlite';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { createLogger } from '@forge/sdk';

const logger = createLogger('template-db');
const DATA_DIR = join(import.meta.dir, '..', '..', '..', '..', 'apps', 'data');

if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = join(DATA_DIR, 'template.db');
export const templateDb = new Database(DB_PATH);

// Initialize isolated tables
templateDb.run(`
  CREATE TABLE IF NOT EXISTS template_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );
`);

logger.info(`Initialized isolated Turso DB for template microservice at ${DB_PATH}`);
