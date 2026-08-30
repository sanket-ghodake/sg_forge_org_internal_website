/**
 * @forge/dev-dashboard - Tier 5 E2E: Full Server Lifecycle & HTML UI Rendering
 * 3A Pattern (Arrange, Act, Assert) Testing Suite
 */

import { describe, expect, it } from 'bun:test';
import { startDevDashboardServer } from '../../src';

describe('Tier 5 E2E: Dev Dashboard Server & UI Rendering', () => {
  it('serves dynamic Astryx HTML, dual-probe health checks, and 1-Click Latency Benchmark', async () => {
    // Arrange
    const server = startDevDashboardServer(3184);

    try {
      // Act 1: Dual-Probe Health Check
      const healthRes = await fetch('http://localhost:3184/health');
      const healthJson: any = await healthRes.json();

      expect(healthRes.status).toBe(200);
      expect(healthJson.status).toBe('ok');

      // Act 2: Astryx HTML UI entrypoint
      const htmlRes = await fetch('http://localhost:3184/');
      const html = await htmlRes.text();

      expect(htmlRes.status).toBe(200);
      expect(html).toContain('SG Forge');
      expect(html).toContain('Developer Dashboard & Diagnostics');
      expect(html).toContain('sb-global-header');
      expect(html).toContain('dashboard-watchdog');

      // Act 3: 1-Click HTTP Latency Benchmark
      const benchRes = await fetch('http://localhost:3184/api/benchmark', { method: 'POST' });
      const benchJson: any = await benchRes.json();

      expect(benchRes.status).toBe(200);
      expect(benchJson.status).toBe('ok');
      expect(benchJson.samples).toBe(15);
      expect(benchJson.p50Ms).toBeDefined();
    } finally {
      server.stop();
    }
  });
});
