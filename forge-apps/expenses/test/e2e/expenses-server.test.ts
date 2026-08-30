/**
 * @forge/app-expenses - Tier 5 E2E: Server Lifecycle & Astryx Micro-App UI
 * 3A Pattern (Arrange, Act, Assert) Testing Suite
 */

import { describe, expect, it } from 'bun:test';
import { startExpensesServer } from '../../src/server';
import { signJwt } from '@forge/auth';

describe('Tier 5 E2E: Expenses Micro-App Full Server Bootstrap', () => {
  it('serves expenses dashboard with Astryx header and database badge', async () => {
    // Arrange
    const server = startExpensesServer(3200);
    const token = signJwt({
      sub: 'usr-employee',
      email: 'employee@forge.internal',
      display_name: 'Standard Employee',
      principal_type: 'EMPLOYEE',
      org_id: 'org-test',
      roles: ['roles/employee'],
      permissions: ['expenses.reports.submit'],
      token_version: 1,
    });

    try {
      // Act
      const res = await fetch('http://localhost:3200/', {
        headers: { Cookie: `forge_session=${token}` },
      });
      const html = await res.text();

      // Assert
      expect(res.status).toBe(200);
      expect(html).toContain('Expense Approval Engine');
      expect(html).toContain('expenses_turso.db');
      expect(html).toContain('astryx-card');
    } finally {
      server.stop();
    }
  });
});
