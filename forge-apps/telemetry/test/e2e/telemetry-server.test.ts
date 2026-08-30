/**
 * @forge/app-telemetry - Tier 5 E2E: Server Lifecycle & Astryx UI
 * 3A Pattern (Arrange, Act, Assert) Testing Suite
 */

import { describe, expect, it } from 'bun:test';
import { startTelemetryServer } from '../../src/server';

describe('Tier 5 E2E: Telemetry Full Server Bootstrap', () => {
  it('serves telemetry dashboard with Astryx header and database badge', async () => {
    // Arrange
    const server = startTelemetryServer(3206);

    try {
      // Act
      const res = await fetch('http://localhost:3206/');
      const html = await res.text();

      // Assert
      expect(res.status).toBe(200);
      expect(html).toContain('Live Telemetry Dashboard');
      expect(html).toContain('telemetry_turso.db');
      expect(html).toContain('PUBLIC DASHBOARD');
    } finally {
      server.stop();
    }
  });
});
