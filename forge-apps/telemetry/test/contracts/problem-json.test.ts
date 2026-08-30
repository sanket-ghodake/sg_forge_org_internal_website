/**
 * @forge/app-telemetry - Tier 4 Contract: Health & Problem Contracts
 * 3A Pattern (Arrange, Act, Assert) Testing Suite
 */

import { describe, expect, it } from 'bun:test';
import { startTelemetryServer } from '../../src/server';

describe('Tier 4 Contract: Telemetry Health Probe Schema', () => {
  it('returns valid JSON health specification on /health', async () => {
    // Arrange
    const server = startTelemetryServer(3205);

    try {
      // Act
      const res = await fetch('http://localhost:3205/health');
      const json: any = await res.json();

      // Assert
      expect(res.status).toBe(200);
      expect(json.status).toBe('ok');
      expect(json.app).toBe('telemetry');
    } finally {
      server.stop();
    }
  });
});
