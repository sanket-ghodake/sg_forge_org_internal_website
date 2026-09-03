/**
 * @forge/app-expenses - Tier 3 Security: Tenant Isolation & Claim Boundary Security
 * 3A Pattern (Arrange, Act, Assert) Testing Suite
 */

import { describe, expect, it } from 'bun:test';
import { createInternalServiceToken } from '@forge/sdk';
import { startExpensesServer } from '../../src/server';

describe('Tier 3 Security: Expenses Isolation & Zero-Trust Defense', () => {
  it('Arrange, Act, Assert: blocks unauthenticated requests with 302 redirect', async () => {
    const server = startExpensesServer(0);

    try {
      const res = await fetch(`http://localhost:${server.port}/`, { redirect: 'manual' });
      expect(res.status).toBe(302);
      expect(res.headers.get('location')).toContain('/auth/login');
    } finally {
      server.stop();
    }
  });

  it('Arrange, Act, Assert: permits authenticated employee and renders approval engine', async () => {
    const server = startExpensesServer(0);
    const token = createInternalServiceToken(['roles/employee'], 'usr_expense_tester');

    try {
      const res = await fetch(`http://localhost:${server.port}/`, {
        headers: { Cookie: `forge_session=${token}` },
      });
      expect(res.status).toBe(200);
      const html = await res.text();
      expect(html).toContain('Expense Approval Engine');
      expect(html).toContain('Linear Upward Approval Chain');
    } finally {
      server.stop();
    }
  });
});
