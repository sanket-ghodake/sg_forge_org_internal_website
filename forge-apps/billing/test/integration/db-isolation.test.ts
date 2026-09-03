/**
 * @forge/app-billing - Tier 2 Integration: Billing Database & Dual-Probe Health
 * 3A Pattern (Arrange, Act, Assert) Testing Suite
 */

import { describe, expect, it } from 'bun:test';
import { createInternalServiceToken } from '@forge/sdk';
import { startBillingServer } from '../../src/server';

describe('Tier 2 Integration: Billing Dedicated DB & Signals', () => {
  it('Arrange, Act, Assert: serves billing health endpoint with memory metrics and dual probes', async () => {
    // Arrange: Start on ephemeral port 0
    const server = startBillingServer(0);

    try {
      // Act
      const res = await fetch(`http://localhost:${server.port}/health`);
      const json: any = await res.json();

      // Assert
      expect(res.status).toBe(200);
      expect(json.status).toBe('ok');
      expect(json.app).toBe('billing');
      expect(json.livez).toBe(true);
      expect(json.readyz).toBe(true);
      expect(typeof json.memoryMb).toBe('number');
    } finally {
      server.stop();
    }
  });

  it('Arrange, Act, Assert: serves /api/invoices returning structured invoice ledger for authorized caller', async () => {
    const server = startBillingServer(0);
    const token = createInternalServiceToken(['roles/billing.admin']);

    try {
      const res = await fetch(`http://localhost:${server.port}/api/invoices`, {
        headers: { Cookie: `forge_session=${token}` },
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.status).toBe('SUCCESS');
      expect(Array.isArray(data.invoices)).toBe(true);
      expect(data.invoices.length).toBeGreaterThanOrEqual(1);
    } finally {
      server.stop();
    }
  });
});
