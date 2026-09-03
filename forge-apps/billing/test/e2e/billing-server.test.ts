/**
 * @forge/app-billing - Tier 5 E2E: Server Lifecycle & Astryx UI
 * 3A Pattern (Arrange, Act, Assert) Testing Suite
 */

import { describe, expect, it } from 'bun:test';
import { createInternalServiceToken } from '@forge/sdk';
import { startBillingServer } from '../../src/server';

describe('Tier 5 E2E: Billing Full Server Bootstrap', () => {
  it('Arrange, Act, Assert: serves billing service UI with Astryx header and database badge on ephemeral port', async () => {
    // Arrange: Start on ephemeral port 0
    const server = startBillingServer(0);
    const token = createInternalServiceToken(['roles/billing.admin'], 'usr-billing-admin');

    try {
      // Act
      const res = await fetch(`http://localhost:${server.port}/`, {
        headers: { Cookie: `forge_session=${token}` },
      });
      const html = await res.text();

      // Assert
      expect(res.status).toBe(200);
      expect(html).toContain('Invoicing & Billing Service');
      expect(html).toContain('billing_turso.db');
      expect(html).toContain('LEDGER APP');
    } finally {
      server.stop();
    }
  });
});
