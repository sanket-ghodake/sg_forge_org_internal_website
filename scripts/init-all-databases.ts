/**
 * @forge/scripts - Microservices Database Initializer & Seeder (2026 LTS)
 * Initializes dedicated Turso/SQLite databases with schema tables and seed data
 * for all microservices across the SG Forge platform.
 */

import { Database } from 'bun:sqlite';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { resolveCanonicalDataDir } from '../apps/src/sdk/src';

import { seedAuthDatabase } from '../apps/src/auth/src/db/seed';

const DATA_DIR = resolveCanonicalDataDir();
console.log('🚀 Initializing microservices databases in:', DATA_DIR);

// 1. Auth Database (auth.db)
function initAuthDb() {
  seedAuthDatabase(false);
  console.log('  ✅ auth.db initialized (canonical IAM, org tree, test personas)');
}

// 2. Billing Database (billing.db)
function initBillingDb() {
  const dbPath = join(DATA_DIR, 'billing.db');
  const db = new Database(dbPath, { create: true });
  db.run('PRAGMA journal_mode = WAL;');
  db.run('PRAGMA synchronous = NORMAL;');

  db.run(`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      plan TEXT NOT NULL DEFAULT 'growth_tier',
      billing_status TEXT NOT NULL DEFAULT 'current',
      stripe_customer_id TEXT,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    );

    CREATE TABLE IF NOT EXISTS invoices (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL,
      amount_cents INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'USD',
      status TEXT NOT NULL DEFAULT 'paid',
      invoice_date INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      due_date INTEGER NOT NULL,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL,
      plan_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      current_period_start INTEGER NOT NULL,
      current_period_end INTEGER NOT NULL,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    );

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

  const billingInvoicesCount = db.query('SELECT COUNT(*) as c FROM billing_invoices;').get() as any;
  if (!billingInvoicesCount?.c) {
    const nowMs = Date.now();
    db.run(`
      INSERT INTO billing_invoices (id, invoice_number, client_name, amount, currency, status, department_path, created_at) VALUES
      ('inv_101', 'INV-2026-001', 'Acme Cloud Infrastructure', 14500.0, 'USD', 'PAID', '/root/tech/eng-core', ${nowMs - 86400000 * 5}),
      ('inv_102', 'INV-2026-002', 'CyberShield Security Ltd', 8200.0, 'USD', 'PENDING', '/root/tech/sec-ops', ${nowMs - 86400000 * 2}),
      ('inv_103', 'INV-2026-003', 'Global Logistics Hub', 23100.0, 'USD', 'PAID', '/root/finops/accounting', ${nowMs});
    `);
  }

  const custCount = db.query('SELECT COUNT(*) as c FROM customers;').get() as any;
  if (!custCount?.c) {
    const now = Math.floor(Date.now() / 1000);
    db.run(`
      INSERT INTO customers (id, name, email, plan, billing_status, stripe_customer_id) VALUES
      ('cust_acme_01', 'Acme Corp Labs', 'finance@acme.corp', 'enterprise_lts', 'current', 'cus_994018294'),
      ('cust_stark_02', 'Stark Dynamics', 'billing@stark.dyn', 'scale_tier', 'current', 'cus_883019283'),
      ('cust_cyber_03', 'Cybernetic AI', 'ops@cybernetic.ai', 'growth_tier', 'current', 'cus_772019481');

      INSERT INTO invoices (id, customer_id, amount_cents, currency, status, invoice_date, due_date) VALUES
      ('inv_2026_001', 'cust_acme_01', 49900, 'USD', 'paid', ${now - 86400 * 5}, ${now + 86400 * 25}),
      ('inv_2026_002', 'cust_stark_02', 129900, 'USD', 'paid', ${now - 86400 * 3}, ${now + 86400 * 27}),
      ('inv_2026_003', 'cust_cyber_03', 19900, 'USD', 'pending', ${now - 86400 * 1}, ${now + 86400 * 29});

      INSERT INTO subscriptions (id, customer_id, plan_id, status, current_period_start, current_period_end) VALUES
      ('sub_01', 'cust_acme_01', 'plan_enterprise', 'active', ${now - 86400 * 10}, ${now + 86400 * 20}),
      ('sub_02', 'cust_stark_02', 'plan_scale', 'active', ${now - 86400 * 15}, ${now + 86400 * 15});
    `);
  }
  db.close();
  console.log('  ✅ billing.db initialized (customers, invoices, subscriptions, transactions, billing_invoices)');
}

// 3. Expenses Database (expenses.db)
function initExpensesDb() {
  const dbPath = join(DATA_DIR, 'expenses.db');
  const db = new Database(dbPath, { create: true });
  db.run('PRAGMA journal_mode = WAL;');
  db.run('PRAGMA synchronous = NORMAL;');

  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      budget_limit_usd REAL NOT NULL DEFAULT 5000.0,
      department TEXT NOT NULL DEFAULT 'Engineering'
    );

    CREATE TABLE IF NOT EXISTS expense_claims (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      category_id TEXT NOT NULL,
      title TEXT NOT NULL,
      amount_usd REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'approved',
      submitted_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      approved_at INTEGER,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS receipts (
      id TEXT PRIMARY KEY,
      claim_id TEXT NOT NULL,
      file_name TEXT NOT NULL,
      file_size_bytes INTEGER NOT NULL,
      mime_type TEXT NOT NULL DEFAULT 'application/pdf',
      uploaded_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY (claim_id) REFERENCES expense_claims(id) ON DELETE CASCADE
    );
  `);

  const catCount = db.query('SELECT COUNT(*) as c FROM categories;').get() as any;
  if (!catCount?.c) {
    const now = Math.floor(Date.now() / 1000);
    db.run(`
      INSERT INTO categories (id, name, budget_limit_usd, department) VALUES
      ('cat_cloud', 'Cloud Infrastructure & Turso DB', 15000.0, 'DevOps'),
      ('cat_tools', 'Developer Tools & SaaS', 5000.0, 'Engineering'),
      ('cat_travel', 'Team Offsites & Conferences', 8000.0, 'Operations');

      INSERT INTO expense_claims (id, user_id, category_id, title, amount_usd, status, submitted_at, approved_at) VALUES
      ('exp_001', 'usr_dev_01', 'cat_cloud', 'Cloud Infrastructure Hosting', 1420.50, 'approved', ${now - 86400 * 4}, ${now - 86400 * 2}),
      ('exp_002', 'usr_dev_01', 'cat_tools', 'IDE Subscriptions & Tooling', 280.00, 'approved', ${now - 86400 * 2}, ${now - 86400 * 1}),
      ('exp_003', 'usr_admin_01', 'cat_travel', 'Team Offsite & Conference', 650.00, 'pending', ${now - 86400 * 1}, NULL);
    `);
  }
  db.close();
  console.log('  ✅ expenses.db initialized (categories, expense_claims, receipts)');
}

// 4. Telemetry Database (telemetry.db)
function initTelemetryDb() {
  const dbPath = join(DATA_DIR, 'telemetry.db');
  const db = new Database(dbPath, { create: true });
  db.run('PRAGMA journal_mode = WAL;');
  db.run('PRAGMA synchronous = NORMAL;');

  db.run(`
    CREATE TABLE IF NOT EXISTS service_metrics (
      id TEXT PRIMARY KEY,
      service_name TEXT NOT NULL,
      cpu_percent REAL NOT NULL,
      memory_mb REAL NOT NULL,
      request_rate_rps REAL NOT NULL,
      timestamp INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    );

    CREATE TABLE IF NOT EXISTS trace_spans (
      id TEXT PRIMARY KEY,
      trace_id TEXT NOT NULL,
      parent_span_id TEXT,
      service_name TEXT NOT NULL,
      operation TEXT NOT NULL,
      duration_ms REAL NOT NULL,
      status_code INTEGER NOT NULL,
      timestamp INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    );

    CREATE TABLE IF NOT EXISTS system_alerts (
      id TEXT PRIMARY KEY,
      service_name TEXT NOT NULL,
      severity TEXT NOT NULL DEFAULT 'WARNING',
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'resolved',
      triggered_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    );
  `);

  const metricsCount = db.query('SELECT COUNT(*) as c FROM service_metrics;').get() as any;
  if (!metricsCount?.c) {
    const now = Math.floor(Date.now() / 1000);
    db.run(`
      INSERT INTO service_metrics (id, service_name, cpu_percent, memory_mb, request_rate_rps, timestamp) VALUES
      ('m_01', 'auth', 2.4, 48.2, 142.5, ${now - 300}),
      ('m_02', 'dev-dashboard', 1.8, 56.1, 88.0, ${now - 200}),
      ('m_03', 'billing', 0.9, 36.4, 25.1, ${now - 100});

      INSERT INTO system_alerts (id, service_name, severity, message, status, triggered_at) VALUES
      ('alt_01', 'billing', 'INFO', 'Incremental WAL vacuum completed successfully', 'resolved', ${now - 3600});
    `);
  }
  db.close();
  console.log('  ✅ telemetry.db initialized (service_metrics, trace_spans, system_alerts)');
}

// 5. Dev Hub Database (dev_hub.db)
function initDevHubDb() {
  const dbPath = join(DATA_DIR, 'dev_hub.db');
  const db = new Database(dbPath, { create: true });
  db.run('PRAGMA journal_mode = WAL;');
  db.run('PRAGMA synchronous = NORMAL;');

  db.run(`
    CREATE TABLE IF NOT EXISTS api_specs (
      id TEXT PRIMARY KEY,
      service_name TEXT NOT NULL UNIQUE,
      version TEXT NOT NULL DEFAULT '1.0.0',
      title TEXT NOT NULL,
      openapi_json TEXT,
      updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    );

    CREATE TABLE IF NOT EXISTS webhooks (
      id TEXT PRIMARY KEY,
      target_url TEXT NOT NULL,
      event_types TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    );
  `);

  const specCount = db.query('SELECT COUNT(*) as c FROM api_specs;').get() as any;
  if (!specCount?.c) {
    db.run(`
      INSERT INTO api_specs (id, service_name, version, title) VALUES
      ('spec_auth', 'auth', '2.0.0', 'Auth & RBAC Identity API'),
      ('spec_billing', 'billing', '1.4.0', 'Financial Ledger & Invoicing API'),
      ('spec_portal', 'portal', '2.1.0', 'Workspace Portal Gateway API');
    `);
  }
  db.close();
  console.log('  ✅ dev_hub.db initialized (api_specs, webhooks)');
}

// 6. Platform Core Database (platform_core.db)
function initPlatformCoreDb() {
  const dbPath = join(DATA_DIR, 'platform_core.db');
  const db = new Database(dbPath, { create: true });
  db.run('PRAGMA journal_mode = WAL;');
  db.run('PRAGMA busy_timeout = 5000;');
  db.run('PRAGMA auto_vacuum = INCREMENTAL;');
  db.run('PRAGMA synchronous = NORMAL;');

  db.run(`CREATE TABLE IF NOT EXISTS apps_registry (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, port INTEGER NOT NULL, ingress_path TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL DEFAULT 'Micro-Apps', access_role TEXT NOT NULL DEFAULT 'General',
    container_name TEXT, db_file_path TEXT, runtime_type TEXT NOT NULL DEFAULT 'bun-watch',
    remote_url TEXT, status TEXT NOT NULL DEFAULT 'active', storage_quota_mb INTEGER NOT NULL DEFAULT 50,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')), updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS traffic_events (
    id TEXT PRIMARY KEY, app_id TEXT NOT NULL, path TEXT NOT NULL, method TEXT NOT NULL,
    status_code INTEGER NOT NULL, duration_ms REAL NOT NULL, ip_hash TEXT, user_agent TEXT,
    trace_id TEXT, timestamp INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS issue_reports (
    id TEXT PRIMARY KEY, app_id TEXT NOT NULL, fingerprint TEXT NOT NULL UNIQUE, error_type TEXT NOT NULL,
    message TEXT NOT NULL, stack_trace TEXT, context_json TEXT, trace_id TEXT,
    occurrence_count INTEGER NOT NULL DEFAULT 1, status TEXT NOT NULL DEFAULT 'open',
    first_seen INTEGER NOT NULL DEFAULT (strftime('%s', 'now')), last_seen INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY, actor_id TEXT NOT NULL, action_type TEXT NOT NULL, target_service TEXT NOT NULL,
    payload_json TEXT, ip_hash TEXT, result_status TEXT NOT NULL DEFAULT 'success',
    timestamp INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS remote_connections (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, type TEXT NOT NULL DEFAULT 'turso',
    url TEXT NOT NULL, auth_token TEXT, is_active INTEGER NOT NULL DEFAULT 1,
    last_ping_ms REAL, error_message TEXT,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')), updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
  );`);

  db.close();
  console.log('  ✅ platform_core.db initialized (apps_registry, traffic, issues, audit, remotes)');
}

// Run all initializations
initAuthDb();
initBillingDb();
initExpensesDb();
initTelemetryDb();
initDevHubDb();
initPlatformCoreDb();

console.log('🎉 All microservices databases successfully configured & seeded in:', DATA_DIR);
