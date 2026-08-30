/**
 * @forge/app-telemetry - Tier 2 Integration: Telemetry Dual-Probe Health & Database
 * 3A Pattern (Arrange, Act, Assert) Testing Suite
 */

import { describe, expect, it } from 'bun:test';
import { startTelemetryServer } from '../../src/server';

describe('Tier 2 Integration: Telemetry Dedicated Database & Dual Probes', () => {
  it('serves telemetry health probe with memory statistics and dual signals', async () => {
    // Arrange
    const server = startTelemetryServer(3204);

    try {
      // Act
      const res = await fetch('http://localhost:3204/health');
      const json: any = await res.json();

      // Assert
      expect(res.status).toBe(200);
      expect(json.status).toBe('ok');
      expect(json.app).toBe('telemetry');
      expect(json.livez).toBe(true);
      expect(json.readyz).toBe(true);
      expect(typeof json.memoryMb).toBe('number');
    } finally {
      server.stop();
    }
  });
});
