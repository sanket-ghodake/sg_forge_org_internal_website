/**
 * @forge/app-billing - Tier 5 E2E: Server Lifecycle & Astryx UI
 * 3A Pattern (Arrange, Act, Assert) Testing Suite
 */

import { describe, expect, it } from 'bun:test';
import { startBillingServer } from '../../src/server';

describe('Tier 5 E2E: Billing Full Server Bootstrap', () => {
  it('serves billing service UI with Astryx header and database badge', async () => {
    // Arrange
    const server = startBillingServer(3203);

    try {
      // Act
      const res = await fetch('http://localhost:3203/');
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
