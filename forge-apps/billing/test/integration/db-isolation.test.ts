/**
 * @forge/app-billing - Tier 2 Integration: Billing Database & Dual-Probe Health
 * 3A Pattern (Arrange, Act, Assert) Testing Suite
 */

import { describe, expect, it } from 'bun:test';
import { startBillingServer } from '../../src/server';

describe('Tier 2 Integration: Billing Dedicated DB & Signals', () => {
  it('serves billing health endpoint with memory metrics and dual probes', async () => {
    // Arrange
    const server = startBillingServer(3201);

    try {
      // Act
      const res = await fetch('http://localhost:3201/health');
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
});
