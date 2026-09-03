/**
 * @forge/app-billing - Tier 3 Security: Financial Data Isolation & RBAC Gate
 * 3A Pattern (Arrange, Act, Assert) Testing Suite
 */

import { describe, expect, it } from 'bun:test';
import { createInternalServiceToken } from '@forge/sdk';
import { startBillingServer } from '../../src/server';

describe('Tier 3 Security: Billing Multi-Tenant & RBAC Defense', () => {
  it('Arrange, Act, Assert: blocks unauthenticated requests with 302 redirect', async () => {
    const server = startBillingServer(0);

    try {
      const res = await fetch(`http://localhost:${server.port}/`, { redirect: 'manual' });
      expect(res.status).toBe(302);
      expect(res.headers.get('location')).toContain('/auth/login');
    } finally {
      server.stop();
    }
  });

  it('Arrange, Act, Assert: strictly denies non-billing roles with 403 Forbidden', async () => {
    const server = startBillingServer(0);
    // General engineer role lacking roles/billing.admin
    const token = createInternalServiceToken(['roles/employee', 'roles/developer'], 'usr_eng_bob');

    try {
      const res = await fetch(`http://localhost:${server.port}/`, {
        headers: { Cookie: `forge_session=${token}` },
      });
      expect(res.status).toBe(403);
    } finally {
      server.stop();
    }
  });

  it('Arrange, Act, Assert: grants full ledger access to authorized billing administrator', async () => {
    const server = startBillingServer(0);
    const token = createInternalServiceToken(['roles/billing.admin'], 'usr_billing_admin');

    try {
      const res = await fetch(`http://localhost:${server.port}/`, {
        headers: { Cookie: `forge_session=${token}` },
      });
      expect(res.status).toBe(200);
      const html = await res.text();
      expect(html).toContain('Invoicing & Billing Service');
      expect(html).toContain('billing_turso.db');
    } finally {
      server.stop();
    }
  });
});
