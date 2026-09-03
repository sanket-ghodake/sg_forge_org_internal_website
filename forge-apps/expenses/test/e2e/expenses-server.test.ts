/**
 * @forge/app-expenses - Tier 5 E2E: Server Lifecycle & Astryx Micro-App UI
 * 3A Pattern (Arrange, Act, Assert) Testing Suite
 */

import { describe, expect, it } from 'bun:test';
import { createInternalServiceToken } from '@forge/sdk';
import { startExpensesServer } from '../../src/server';

describe('Tier 5 E2E: Expenses Micro-App Full Server Bootstrap', () => {
  it('Arrange, Act, Assert: serves expenses dashboard with Astryx header and database badge on ephemeral port', async () => {
    // Arrange: Start on ephemeral port 0
    const server = startExpensesServer(0);
    const token = createInternalServiceToken(['roles/employee'], 'usr-employee');

    try {
      // Act
      const res = await fetch(`http://localhost:${server.port}/`, {
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
