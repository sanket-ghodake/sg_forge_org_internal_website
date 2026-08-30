/**
 * @forge/auth - Generic Multi-Tenant Org & IAM Seed Generator (2026 LTS)
 * Populates standard organizational trees, diverse GCP-style Admin personas, and employees.
 * Default credentials: password123 with mandatory first-time password reset.
 */

import { getAuthDb } from './db';
import { hashPassword } from '../backend/crypto';
import { createLogger } from '@forge/sdk';

const logger = createLogger('auth-seed');

export const DEFAULT_PASSWORD = 'password123';

export function seedAuthDatabase(force: boolean = false): void {
  const db = getAuthDb();

  // Check if already seeded
  const existingOrg = db.query('SELECT id FROM auth_organizations LIMIT 1;').get() as { id: string } | null;
  if (existingOrg && !force) {
    logger.info('Auth database already seeded. Skipping initial seeding.');
    return;
  }

  if (force) {
    db.run('DELETE FROM auth_audit_logs;');
    db.run('DELETE FROM auth_sessions;');
    db.run('DELETE FROM auth_iam_policy_bindings;');
    db.run('DELETE FROM auth_iam_role_permissions;');
    db.run('DELETE FROM auth_iam_roles;');
    db.run('DELETE FROM auth_iam_permissions;');
    db.run('DELETE FROM auth_employee_relationships;');
    db.run('DELETE FROM auth_employee_profiles;');
    db.run('DELETE FROM auth_users;');
    db.run('DELETE FROM auth_org_nodes;');
    db.run('DELETE FROM auth_org_node_types;');
    db.run('DELETE FROM auth_organizations;');
  }

  logger.info('Seeding Auth database with generic Org structure, GCP-style IAM, and test personas...');

  const now = Date.now();
  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || 'SG Forge Global';
  const brandTagline = process.env.NEXT_PUBLIC_BRAND_TAGLINE || 'Modular Corporate Portal & Identity Gateway';

  const orgId = 'org-sg-forge-global';
  const { hash: defaultHash, salt: defaultSalt } = hashPassword(DEFAULT_PASSWORD);

  db.transaction(() => {
    // 1. Organization
    db.run(
      `INSERT INTO auth_organizations (id, name, domain, brand_name, brand_tagline, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [orgId, brandName, 'forge.internal', brandName, brandTagline, now, now]
    );

    // 2. Generic Org Node Types (Dynamic levels)
    const nodeTypes = [
      { id: 'type_company', name: 'ORGANIZATION', level_order: 0, desc: 'Root Enterprise Entity' },
      { id: 'type_division', name: 'DIVISION', level_order: 1, desc: 'Strategic Business Unit' },
      { id: 'type_department', name: 'DEPARTMENT', level_order: 2, desc: 'Functional Department' },
      { id: 'type_squad', name: 'SQUAD', level_order: 3, desc: 'Cross-functional Execution Team' },
    ];

    for (const nt of nodeTypes) {
      db.run(
        `INSERT INTO auth_org_node_types (id, org_id, name, level_order, description) VALUES (?, ?, ?, ?, ?);`,
        [nt.id, orgId, nt.name, nt.level_order, nt.desc]
      );
    }

    // 3. Generic Org Nodes (Tree with materialized paths)
    const nodes = [
      { id: 'node_root', type_id: 'type_company', name: brandName, code: 'HQ', parent_id: null, path: '/root' },
      { id: 'node_div_tech', type_id: 'type_division', name: 'Technology & Engineering', code: 'TECH', parent_id: 'node_root', path: '/root/tech' },
      { id: 'node_div_fin', type_id: 'type_division', name: 'Finance & Operations', code: 'FINOPS', parent_id: 'node_root', path: '/root/finops' },
      { id: 'node_dept_core_eng', type_id: 'type_department', name: 'Core Platform Engineering', code: 'ENG-CORE', parent_id: 'node_div_tech', path: '/root/tech/eng-core' },
      { id: 'node_dept_sec_ops', type_id: 'type_department', name: 'Security & Cloud Operations', code: 'SEC-OPS', parent_id: 'node_div_tech', path: '/root/tech/sec-ops' },
      { id: 'node_dept_accounting', type_id: 'type_department', name: 'Accounting & Billing', code: 'FIN-ACC', parent_id: 'node_div_fin', path: '/root/finops/accounting' },
      { id: 'node_squad_backend', type_id: 'type_squad', name: 'Backend & Infrastructure Squad', code: 'SQ-BE', parent_id: 'node_dept_core_eng', path: '/root/tech/eng-core/be' },
    ];

    for (const node of nodes) {
      db.run(
        `INSERT INTO auth_org_nodes (id, org_id, type_id, name, code, parent_id, path, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [node.id, orgId, node.type_id, node.name, node.code, node.parent_id, node.path, now, now]
      );
    }

    // 4. IAM Permissions (<service>.<resource>.<action>)
    const permissions = [
      // Core Admin & IAM
      { id: 'auth.users.read', service: 'auth', resource: 'users', action: 'read', desc: 'View user directory' },
      { id: 'auth.users.write', service: 'auth', resource: 'users', action: 'write', desc: 'Create, update & suspend users' },
      { id: 'iam.roles.read', service: 'iam', resource: 'roles', action: 'read', desc: 'View IAM roles and policies' },
      { id: 'iam.roles.grant', service: 'iam', resource: 'roles', action: 'grant', desc: 'Grant policy bindings and privileges' },
      // Portal & Workspaces
      { id: 'portal.workspace.access', service: 'portal', resource: 'workspace', action: 'access', desc: 'Access the main portal canvas' },
      { id: 'portal.settings.update', service: 'portal', resource: 'settings', action: 'update', desc: 'Update organization portal settings' },
      // Platform & Dev Center
      { id: 'forge.apps.deploy', service: 'forge', resource: 'apps', action: 'deploy', desc: 'Deploy & configure Forge micro-apps' },
      { id: 'forge.logs.view', service: 'forge', resource: 'logs', action: 'view', desc: 'Inspect platform telemetry & container logs' },
      // Billing & Expenses
      { id: 'billing.invoices.view', service: 'billing', resource: 'invoices', action: 'view', desc: 'View invoices and ledger' },
      { id: 'billing.invoices.manage', service: 'billing', resource: 'invoices', action: 'manage', desc: 'Create and process billing payouts' },
      { id: 'expenses.reports.submit', service: 'expenses', resource: 'reports', action: 'submit', desc: 'Submit employee expense claims' },
      { id: 'expenses.reports.approve', service: 'expenses', resource: 'reports', action: 'approve', desc: 'Approve department expense requests' },
    ];

    for (const p of permissions) {
      db.run(
        `INSERT INTO auth_iam_permissions (id, service, resource, action, description) VALUES (?, ?, ?, ?, ?);`,
        [p.id, p.service, p.resource, p.action, p.desc]
      );
    }

    // 5. IAM Roles (Predefined)
    const roles = [
      { id: 'roles/super_admin', title: 'Super Administrator', type: 'PREDEFINED', desc: 'Full administrative access across all org services' },
      { id: 'roles/security.admin', title: 'IAM & Security Administrator', type: 'PREDEFINED', desc: 'Manage identity, user directory and policy bindings' },
      { id: 'roles/dev.operator', title: 'Forge Platform Operator', type: 'PREDEFINED', desc: 'Deploy micro-apps and view system logs' },
      { id: 'roles/billing.admin', title: 'Billing Administrator', type: 'PREDEFINED', desc: 'Manage invoices, revenue and payout schedules' },
      { id: 'roles/employee', title: 'Standard Employee', type: 'PREDEFINED', desc: 'Basic portal workspace access and self-service expenses' },
    ];

    for (const r of roles) {
      db.run(
        `INSERT INTO auth_iam_roles (id, org_id, title, role_type, description, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?);`,
        [r.id, null, r.title, r.type, r.desc, now, now]
      );
    }

    // 6. Role Permissions Mapping
    const roleMap: Record<string, string[]> = {
      'roles/super_admin': permissions.map((p) => p.id),
      'roles/security.admin': ['auth.users.read', 'auth.users.write', 'iam.roles.read', 'iam.roles.grant', 'portal.workspace.access'],
      'roles/dev.operator': ['portal.workspace.access', 'forge.apps.deploy', 'forge.logs.view'],
      'roles/billing.admin': ['portal.workspace.access', 'billing.invoices.view', 'billing.invoices.manage', 'expenses.reports.approve'],
      'roles/employee': ['portal.workspace.access', 'expenses.reports.submit', 'billing.invoices.view'],
    };

    for (const [roleId, permIds] of Object.entries(roleMap)) {
      for (const permId of permIds) {
        db.run(`INSERT INTO auth_iam_role_permissions (role_id, permission_id) VALUES (?, ?);`, [roleId, permId]);
      }
    }

    // 7. Seed Users & Personas (Default Password: password123, must_change_password = 1)
    const personas = [
      {
        id: 'usr-superadmin',
        email: 'superadmin@forge.internal',
        name: 'Alex Rivera (Super Admin)',
        type: 'ADMIN' as const,
        role: 'roles/super_admin',
        nodeId: 'node_root',
        title: 'Chief Technology Officer',
        code: 'EMP-001',
        managerId: null,
      },
      {
        id: 'usr-secadmin',
        email: 'security@forge.internal',
        name: 'Sarah Vance (Security Admin)',
        type: 'ADMIN' as const,
        role: 'roles/security.admin',
        nodeId: 'node_dept_sec_ops',
        title: 'Lead Information Security Officer',
        code: 'EMP-002',
        managerId: 'usr-superadmin',
      },
      {
        id: 'usr-billadmin',
        email: 'billing.admin@forge.internal',
        name: 'Marcus Sterling (Billing Admin)',
        type: 'ADMIN' as const,
        role: 'roles/billing.admin',
        nodeId: 'node_dept_accounting',
        title: 'Director of Finance & Billing',
        code: 'EMP-003',
        managerId: 'usr-superadmin',
      },
      {
        id: 'usr-developer',
        email: 'developer@forge.internal',
        name: 'Devon Hayes (Forge Operator)',
        type: 'ADMIN' as const,
        role: 'roles/dev.operator',
        nodeId: 'node_dept_core_eng',
        title: 'Principal Systems Operator',
        code: 'EMP-004',
        managerId: 'usr-superadmin',
      },
      {
        id: 'usr-bob-lead',
        email: 'bob.lead@forge.internal',
        name: 'Bob Miller (Tech Lead)',
        type: 'EMPLOYEE' as const,
        role: 'roles/employee',
        nodeId: 'node_dept_core_eng',
        title: 'Core Platform Engineering Lead',
        code: 'EMP-010',
        managerId: 'usr-superadmin',
      },
      {
        id: 'usr-alice-eng',
        email: 'alice.eng@forge.internal',
        name: 'Alice Chen (Senior Engineer)',
        type: 'EMPLOYEE' as const,
        role: 'roles/employee',
        nodeId: 'node_squad_backend',
        title: 'Senior Backend Engineer',
        code: 'EMP-011',
        managerId: 'usr-bob-lead',
      },
      {
        id: 'usr-carol-fin',
        email: 'carol.fin@forge.internal',
        name: 'Carol Wright (Financial Analyst)',
        type: 'EMPLOYEE' as const,
        role: 'roles/employee',
        nodeId: 'node_dept_accounting',
        title: 'Financial Planning Analyst',
        code: 'EMP-012',
        managerId: 'usr-billadmin',
      },
    ];

    for (const p of personas) {
      db.run(
        `INSERT INTO auth_users (id, org_id, email, password_hash, salt, display_name, principal_type, status, must_change_password, token_version, custom_attributes, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE', 1, 1, '{}', ?, ?);`,
        [p.id, orgId, p.email, defaultHash, defaultSalt, p.name, p.type, now, now]
      );

      db.run(
        `INSERT INTO auth_employee_profiles (user_id, org_node_id, job_title, employee_code, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?);`,
        [p.id, p.nodeId, p.title, p.code, now, now]
      );

      db.run(
        `INSERT INTO auth_iam_policy_bindings (id, org_id, principal_id, role_id, resource_scope, condition_expr, created_at)
         VALUES (?, ?, ?, ?, ?, NULL, ?);`,
        [`bind-${p.id}`, orgId, p.id, p.role, 'org/*', now]
      );

      if (p.managerId) {
        db.run(
          `INSERT INTO auth_employee_relationships (id, org_id, employee_id, related_to_id, relationship_type, is_primary)
           VALUES (?, ?, ?, ?, 'LINE_MANAGER', 1);`,
          [`rel-${p.id}`, orgId, p.id, p.managerId]
        );
      }
    }
  })();

  logger.info('Auth database seeding completed successfully.');
}
