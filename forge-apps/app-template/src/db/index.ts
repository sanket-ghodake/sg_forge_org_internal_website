/**
 * Forge App Template - Dedicated Turso SQLite Database Client (2026 LTS)
 * Strict Per-App Database Isolation (Google & Meta Multi-Tenant Standard)
 */

import { createLogger, getDatabaseClient } from '@forge/sdk';

const logger = createLogger('template-db');
export const templateDb = getDatabaseClient('template.db');

// Initialize isolated tables
templateDb.run(`
  CREATE TABLE IF NOT EXISTS template_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );
`);

logger.info('Initialized isolated Turso DB for template microservice');
