/**
 * Forge App: Billing Service - Dedicated Turso SQLite Client (2026 LTS)
 * Strict Per-App Database Isolation (Google & Meta Multi-Tenant Standard)
 */

import { Database } from 'bun:sqlite';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { createLogger } from '@forge/sdk';

const logger = createLogger('billing-db');
const DATA_DIR = join(import.meta.dir, '..', '..', '..', '..', 'apps', 'data');

if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = join(DATA_DIR, 'billing.db');
export const billingDb = new Database(DB_PATH);

// Initialize isolated invoices table
billingDb.run(`
  CREATE TABLE IF NOT EXISTS billing_invoices (
    id TEXT PRIMARY KEY,
    invoice_number TEXT NOT NULL UNIQUE,
    client_name TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL DEFAULT 'PENDING',
    department_path TEXT NOT NULL DEFAULT '/root/finops/accounting',
    created_at INTEGER NOT NULL
  );
`);

// Seed default ledger records if empty
const count = billingDb.query('SELECT count(*) as total FROM billing_invoices').get() as { total: number };
if (count.total === 0) {
  const insert = billingDb.prepare(`
    INSERT INTO billing_invoices (id, invoice_number, client_name, amount, currency, status, department_path, created_at)
    VALUES ($id, $num, $client, $amount, 'USD', $status, $dept, $created)
  `);

  const now = Date.now();
  insert.run({ $id: 'inv_101', $num: 'INV-2026-001', $client: 'Acme Cloud Infrastructure', $amount: 14500.0, $status: 'PAID', $dept: '/root/tech/eng-core', $created: now - 86400000 * 5 });
  insert.run({ $id: 'inv_102', $num: 'INV-2026-002', $client: 'CyberShield Security Ltd', $amount: 8200.0, $status: 'PENDING', $dept: '/root/tech/sec-ops', $created: now - 86400000 * 2 });
  insert.run({ $id: 'inv_103', $num: 'INV-2026-003', $client: 'Global Logistics Hub', $amount: 23100.0, $status: 'PAID', $dept: '/root/finops/accounting', $created: now });

  logger.info(`Seeded initial ledger records into ${DB_PATH}`);
}
